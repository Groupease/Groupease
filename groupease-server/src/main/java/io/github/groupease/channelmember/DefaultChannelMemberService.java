package io.github.groupease.channelmember;

import java.lang.invoke.MethodHandles;
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.concurrent.Immutable;
import javax.inject.Inject;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.persist.Transactional;
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

    /**
     * Injectable constructor.
     *
     * @param userService to fetch users.
     * @param memberDao to save and fetch channel members.
     */
    @Inject
    public DefaultChannelMemberService(
            @Nonnull UserService userService,
            @Nonnull MemberDao memberDao
    ) {
        this.userService = requireNonNull(userService);
        this.memberDao = requireNonNull(memberDao);
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
         * TODO: Get member & confirm access. See delete method below for example.
         * Additional check:
         * Ensure if "isOwner" is being changed, that current user is a channel admin.
         */

        Member editor = getForCurrentUser(toUpdate.getChannel().getId());
        Member existingMember = getByMemberId(toUpdate.getId());

        if(editor.isOwner() || editor.getId().equals(toUpdate.getId())){   //Is the current user an owner? or editing themself?
            if(toUpdate.isOwner() == existingMember.isOwner()){ //Changing isOwner?
                if(editor.isOwner()){
                    return memberDao.update(toUpdate);
                } else {
                    throw new ChannelMemberIdMismatchException(); //has to be an owner to change that
                }
            } else {  //not changing owner? Good to update
                return memberDao.update(toUpdate);
            }
        } else {  //Not owner or editing self? Not authorized
            throw new ChannelMemberIdMismatchException();
        }
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
        } else {
            throw new ChannelMemberDeleteForbiddenException();
        }

    }

    private GroupeaseUser getCurrentUser() {
        /* Get current user, ensuring saved in DB and refreshing from source. */
        return userService.updateCurrentUser();
    }

}
