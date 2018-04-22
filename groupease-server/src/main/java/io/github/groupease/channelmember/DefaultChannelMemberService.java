package io.github.groupease.channelmember;

import java.lang.invoke.MethodHandles;
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.concurrent.Immutable;
import javax.inject.Inject;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.persist.Transactional;
import io.github.groupease.channel.ChannelService;
import io.github.groupease.db.MemberDao;
import io.github.groupease.model.Member;
import io.github.groupease.user.GroupeaseUser;
import io.github.groupease.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.util.Objects.requireNonNull;

/**
 * Default implementation of {@link ChannelMemberService}.
 */
@Immutable
public class DefaultChannelMemberService implements ChannelMemberService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final UserService userService;
    private final MemberDao memberDao;
    private final ChannelService channelService;

    /**
     * Injectable constructor.
     *
     * @param userService to fetch users.
     * @param memberDao to save and fetch channel members.
     */
    @Inject
    public DefaultChannelMemberService(
            @Nonnull UserService userService,
            @Nonnull MemberDao memberDao,
            @Nonnull ChannelService channelService
    ) {
        this.userService = requireNonNull(userService);
        this.memberDao = requireNonNull(memberDao);
        this.channelService = requireNonNull(channelService);
    }

    @Nonnull
    @Override
    @Timed
    public List<Member> list(
            long channelId
    ) {
        LOGGER.debug(
                "DefaultChannelMemberService.list called with channelId: '{}'.",
                channelId
        );
        return memberDao.list(channelId);
    }

    @Nonnull
    @Override
    @Timed
    public Member getByMemberId(
            long memberId
    ) {
        LOGGER.debug(
                "DefaultChannelMemberService.getByMemberId called with memberId '{}'.",
                memberId
        );
        return memberDao.getByMemberId(memberId);
    }

    @Nonnull
    @Override
    @Timed
    public Member getForCurrentUser(
            long channelId
    ) {
        LOGGER.debug(
                "DefaultChannelMemberService.getForCurrentUser called with channelId '{}'.",
                channelId
        );

        /* Get current user. */
        GroupeaseUser currentUser = getCurrentUser();

        return getForUser(
                channelId,
                currentUser.getId()
        );
    }

    @Nonnull
    @Override
    @Timed
    public Member getForUser(
            long channelId,
            long userId
    ) {
        LOGGER.debug(
                "DefaultChannelMemberService.getForUser called with channelId '{}' userId '{}'.",
                channelId,
                userId
        );

        return memberDao.getForUser(
                userId,
                channelId
        );
    }

    @Nonnull
    @Override
    @Timed
    @Transactional
    public Member update(
            @Nonnull Member toUpdate
    ) {
        LOGGER.debug(
                "DefaultChannelMemberService.update called with toUpdate: '{}'.",
                toUpdate
        );

        /*
         * Ensure if "isOwner" is being changed, that current user is a channel admin.
         * Also ensure non-owners can only edit their own profile.
         */

        Member editor = getForCurrentUser(toUpdate.getChannel().getId());

        if (!editor.isOwner()) {
            /* Checks are only needed for non-owners. */

            if (!editor.getId().equals(toUpdate.getId())) {
                /* Non-admin is editing someone else's profile. */
                throw new MemberEditForbiddenException("Non admin cannot edit a different channel member.");
            }

            if (toUpdate.isOwner()) {
                /* Current user is not an owner, but they have tried to become one. */
                throw new ChannelMemberNotOwnerException("Member must be owner to update isOwner");
            }
        }

        /* All checks passed. */
        return memberDao.update(toUpdate);
    }

    @Nonnull
    @Override
    @Transactional
    public Member create(
            long channelId,
            long userId,
            boolean owner
    ) {
        LOGGER.debug(
                "DefaultChannelMemberService.create called with channelId '{}'; userId '{}'; owner '{}'.",
                channelId,
                userId,
                owner
        );

        return memberDao.create(
                userId,
                channelId,
                owner
        );
    }

    @Override
    @Timed
    @Transactional
    public void delete(
            long memberId
    ) {
        LOGGER.debug(
                "DefaultChannelMemberService.delete called with memberId: '{}'.",
                memberId
        );

        Member memberToDelete = getByMemberId(memberId);

        long channelId = memberToDelete.getChannel().getId();

        Member currentMember = getForCurrentUser(channelId);

        if (currentMember.isOwner() || currentMember.getId().equals(memberId)) {
            memberDao.delete(memberToDelete);
            if(list(channelId).isEmpty()) {
                channelService.deleteNoCheck(channelId);
            }
        } else {
            throw new ChannelMemberDeleteForbiddenException();
        }

    }

    private GroupeaseUser getCurrentUser() {
        /* Get current user, ensuring saved in DB and refreshing from source. */
        return userService.updateCurrentUser();
    }

}
