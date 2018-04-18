package io.github.groupease.channel;

import java.lang.invoke.MethodHandles;
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.concurrent.Immutable;
import javax.inject.Inject;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Strings;
import com.google.inject.persist.Transactional;
import io.github.groupease.channelmember.ChannelMemberService;
import io.github.groupease.db.MemberDao;
import io.github.groupease.model.Member;
import io.github.groupease.user.GroupeaseUser;
import io.github.groupease.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.util.Objects.requireNonNull;

/**
 * Default implementation of {@link ChannelService}.
 */
@Immutable
public class DefaultChannelService implements ChannelService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final ChannelDao channelDao;
    private final MemberDao memberDao;
    private final UserService userService;

    /**
     * Injectable constructor.
     *
     * @param channelDao {@link ChannelDao} instance.
     */
    @Inject
    public DefaultChannelService(
            @Nonnull ChannelDao channelDao,
            @Nonnull MemberDao memberDao,
            @Nonnull UserService userService
    ) {
        this.channelDao = requireNonNull(channelDao);
        this.memberDao = requireNonNull(memberDao);
        this.userService = requireNonNull(userService);
    }

    @Nonnull
    @Override
    @Timed
    public List<Channel> list() {
        LOGGER.debug("DefaultChannelService.list() called.");
        return channelDao.list();
    }

    @Nonnull
    @Override
    @Timed
    public List<Channel> list(
            long userId
    ) {
        LOGGER.debug("DefaultChannelService.list({}) called.", userId);
        return channelDao.list(userId);
    }

    @Nonnull
    @Override
    @Timed
    public Channel getById(
            long id
    ) {
        LOGGER.debug("DefaultChannelService.getForUser({}) called.", id);
        return channelDao.getById(id);
    }

    @Nonnull
    @Override
    @Timed
    @Transactional
    public Channel update(
            @Nonnull ChannelDto toUpdate
    ) {
        LOGGER.debug("DefaultChannelService.update({}) called.", toUpdate);

        requireNonNull(toUpdate);
        requireNonNull(toUpdate.getId());

        if (Strings.isNullOrEmpty(toUpdate.getName())) {
            throw new ChannelNameMissingException("Channel name is required.");
        }

        /* Confirm current user is owner of channel. */

        /* Get current user. */
        GroupeaseUser currentUser = getCurrentUser();

        /* Get channel member. */
        Member member = memberDao.getForUser(
                currentUser.getId(),
                toUpdate.getId()
        );

        if (member == null || !member.isOwner()) {
            throw new ChannelEditByNonOwnerException();
        }

        return channelDao.update(toUpdate);
    }

    @Nonnull
    @Override
    @Timed
    @Transactional
    public Channel create(
            @Nonnull ChannelDto toCreate
    ) {
        LOGGER.debug("DefaultChannelService.create({}) called.", toCreate);

        requireNonNull(toCreate);

        if (toCreate.getId() != null) {
            throw new NewChannelHasIdException("A new Channel cannot already have an ID.");
        }

        if (Strings.isNullOrEmpty(toCreate.getName())) {
            throw new ChannelNameMissingException("Channel name is required.");
        }

        /* Create channel. */
        Channel newChannel = channelDao.create(toCreate);

        /* Get current user. */
        GroupeaseUser currentUser = getCurrentUser();

        /* Add current user as channel member and owner. */
        memberDao.create(
                currentUser.getId(),
                newChannel.getId(),
                true
        );

        /* Return the new channel. */
        return newChannel;
    }

    @Override
    @Timed
    @Transactional
    public void delete(
            long id
    ) {
        LOGGER.debug("DefaultChannelService.delete({}) called.", id);

        /* Confirm current user is owner of channel. */

        /* Get current user. */
        GroupeaseUser currentUser = getCurrentUser();

        /* Get channel member. */
        Member member = memberDao.getForUser(
                currentUser.getId(),
                id
        );

        if (member == null || !member.isOwner()) {
            throw new ChannelEditByNonOwnerException();
        }

        /* Delete channel. */
        channelDao.delete(id);
    }

    @Override
    @Timed
    @Transactional
    public void deleteNoCheck(
            long id
    ) {
        LOGGER.debug("DefaultChannelService.delete({}) called.", id);

        /* Confirm current user is owner of channel. */

        /* Get current user. */
        GroupeaseUser currentUser = getCurrentUser();

        /* Get channel member. */
        Member member = memberDao.getForUser(
                currentUser.getId(),
                id
        );

        /* Delete channel. */
        channelDao.delete(id);
    }

    private GroupeaseUser getCurrentUser() {
        /* Get current user, ensuring saved in DB and refreshing from source. */
        return userService.updateCurrentUser();
    }

}
