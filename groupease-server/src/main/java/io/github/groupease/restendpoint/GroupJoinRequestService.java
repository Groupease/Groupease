package io.github.groupease.restendpoint;

import com.codahale.metrics.annotation.Timed;
import com.google.inject.persist.Transactional;
import io.github.groupease.auth.CurrentUserId;
import io.github.groupease.db.GroupDao;
import io.github.groupease.db.GroupJoinRequestDao;
import io.github.groupease.db.GroupeaseUserDao;
import io.github.groupease.exception.*;
import io.github.groupease.model.Group;
import io.github.groupease.model.GroupJoinRequest;
import io.github.groupease.model.GroupeaseUser;
import io.github.groupease.model.Member;
import io.github.groupease.user.UserNotFoundException;
import io.github.groupease.util.CommentWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nonnull;
import javax.inject.Inject;
import javax.inject.Provider;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.Optional;

@Path("channels/{channelId}/groups/{groupId}/join-requests")
@Produces(MediaType.APPLICATION_JSON)
public class GroupJoinRequestService {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final GroupJoinRequestDao requestDao;
    private final GroupDao groupDao;
    private final GroupeaseUserDao userDao;
    private final Provider<String> currentUserIdProvider;
    private GroupeaseUser loggedInUser;

    @Inject
    public GroupJoinRequestService(@Nonnull GroupJoinRequestDao requestDao,
                                   @Nonnull GroupDao groupDao, @Nonnull GroupeaseUserDao userDao,
                                   @Nonnull @CurrentUserId Provider<String> currentUserIdProvider)
    {
        this.requestDao = requestDao;
        this.groupDao = groupDao;
        this.userDao = userDao;
        this.currentUserIdProvider = currentUserIdProvider;
    }

    /**
     * Gets a list of all {@link GroupJoinRequest}s sent to the given group. The list will be filtered to only return
     * requests sent by the logged in user if he is not already a group member.
     * @param channelId The unique ID of the channel that the requested group is in
     * @param groupId The unique ID of the group to get join requests for
     * @return The list of all join requests, possibly filtered based on existing group membership. The list will be
     * empty if no matching requests were found
     */
    @GET
    @Timed
    @Nonnull
    public List<GroupJoinRequest> list(@PathParam("channelId") long channelId, @PathParam("groupId") long groupId)
    {
        LOGGER.debug("GroupJoinRequestService.list(channel={}, group={})", channelId, groupId);

        // Make sure that the group is in the channel
        Group group = groupDao.get(groupId);
        if(group == null || group.getChannelId() != channelId)
        {
            throw new GroupNotFoundException("No group with that ID in that channel was found");
        }

        // If the current user is a member of the group then show all join requests
        if(isGroupMember(group))
        {
            return requestDao.list(groupId);
        }

        // The logged in user isn't a group member, but list a join request if he sent it
        return requestDao.list(groupId, loggedInUser.getId());
    }

    /**
     * Gets a specific {@link GroupJoinRequest}
     * @param channelId The unique ID of the channel that the specified group is in
     * @param groupId The unique ID of the group the request was sent to
     * @param requestId The unique ID of the request to retrieve
     * @return The join request if found
     */
    @GET
    @Path("{requestId}")
    @Timed
    public GroupJoinRequest get(@PathParam("channelId") long channelId, @PathParam("groupId") long groupId,
                                @PathParam("requestId") long requestId)
    {
        LOGGER.debug("GroupJoinRequestService.get(channel={}, group={}, request={})", channelId, groupId, requestId);

        // Get the join request if it is for the right group in the right channel
        GroupJoinRequest request = requestDao.get(channelId, groupId, requestId);
        if(request == null)
        {
            throw new GroupJoinRequestNotFoundException(
                    "No group join request could be found with that ID for that group in that channel");
        }

        // Only an existing group member or the sender can view the request
        if(isGroupMember(channelId, groupId) || request.getSender().equals(loggedInUser))
        {
            return request;
        }

        // Not authorized
        throw new NotSenderException("Only the sender or a group member can view this group join request");
    }

    /**
     * Accepts a {@link GroupJoinRequest} and adds the sender as a new member of the group. The request is deleted
     * @param channelId The unique ID of the channel that the specified group is in
     * @param groupId The unique ID of the group the request was sent to
     * @param requestId The unique ID of the request to accept
     */
    @POST
    @Path("{requestId}/acceptance")
    @Timed
    @Transactional
    public void accept(@PathParam("channelId") long channelId, @PathParam("groupId") long groupId,
                       @PathParam("requestId") long requestId)
    {
        LOGGER.debug("GroupJoinRequestService.accept(channel={}, group={}, request={})", channelId, groupId, requestId);

        // Validate group and channel parameters
        Group group = groupDao.get(groupId);
        if(group == null || group.getChannelId() != channelId)
        {
            throw new GroupNotFoundException("No group with that ID in that channel was found");
        }

        // Only a group member can accept a request
        if(!isGroupMember(group))
        {
            throw new NotGroupMemberException("Only a group member can accept a group join request");
        }

        // Find the invitation
        GroupJoinRequest request = requestDao.get(channelId, groupId, requestId);
        if(request == null)
        {
            throw new GroupJoinRequestNotFoundException(
                    "No group join request could be found with that ID for that group in that channel");
        }

        // Add the sender to the group
        group.getMembers().add(request.getSender().getMemberList()
                .stream().filter(member -> member.getChannel().getId() == channelId).findFirst().get());

        // Cleanup the invitation
        requestDao.delete(request);
    }

    /**
     * Rejects a {@link GroupJoinRequest}. The sender will not be added to the group. The request is deleted
     * @param channelId The unique ID of the channel that the specified group is in
     * @param groupId The unique ID of the group the request was sent to
     * @param requestId The unique ID of the request to accept
     */
    @POST
    @Path("{requestId}/rejection")
    @Timed
    @Transactional
    public void reject(@PathParam("channelId") long channelId, @PathParam("groupId") long groupId,
                       @PathParam("requestId") long requestId)
    {
        LOGGER.debug("GroupJoinRequestService.reject(channel={}, group={}, request={})", channelId, groupId, requestId);

        // Validate group and channel parameters
        Group group = groupDao.get(groupId);
        if(group == null || group.getChannelId() != channelId)
        {
            throw new GroupNotFoundException("No group with that ID in that channel was found");
        }

        // Only a group member can reject a request
        if(!isGroupMember(group))
        {
            throw new NotGroupMemberException("Only a group member can reject a group join request");
        }

        // Find the invitation
        GroupJoinRequest request = requestDao.get(channelId, groupId, requestId);
        if(request == null)
        {
            throw new GroupJoinRequestNotFoundException(
                    "No group join request could be found with that ID for that group in that channel");
        }

        // Remove the invitation
        requestDao.delete(request);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Timed
    @Transactional
    public GroupJoinRequest create(@PathParam("channelId") long channelId, @PathParam("groupId") long groupId,
                                   @Nonnull CommentWrapper wrapper)
    {
        LOGGER.debug("GroupJoinRequestService.create(channel={}, group={})", channelId, groupId);

        GroupeaseUser user = userDao.getByProviderId(currentUserIdProvider.get());
        if(user == null)
        {
            throw new UserNotFoundException();
        }

        // Check that user is a member of the channel this group is in
        Optional<Member> possibleUserMember = user.getMemberList().stream()
                .filter(member -> member.getChannel().getId() == channelId).findFirst();
        if(!possibleUserMember.isPresent())
        {
            throw new NotChannelMemberException("You cannot request to join a group in a channel you are not a member of");
        }
        Member currentUserMember = possibleUserMember.get();

        // Make sure that the group exists
        Group group = groupDao.get(groupId);
        if(group == null || group.getChannelId() != channelId)
        {
            throw new GroupNotFoundException("No group with that ID in that channel was found");
        }

        // Check if an existing group join request for this user and group already exists
        List<GroupJoinRequest> existing = requestDao.list(groupId, user.getId());
        if(!existing.isEmpty())
        {
            throw new DuplicateGroupJoinRequestException("You've already sent a join request to this group. You cannot send another");
        }

        // Check if the user is already a member of the group
        if(group.getMembers().contains(currentUserMember))
        {
            throw new AlreadyMemberException("User cannot request to join group the user is already a member of");
        }

        return requestDao.create(currentUserMember, group, wrapper.comments);
    }

    /**
     * Deletes (cancels) a {@link GroupJoinRequest}. The specified request must be sent to the indicated group and
     * in the indicated channel.
     * @param channelId The unique ID of the channel that the specified group is in
     * @param groupId The unique ID of the group the request was sent to
     * @param requestId The unique ID of the request to retrieve
     */
    @DELETE
    @Path("{requestId}")
    @Timed
    @Transactional
    public void delete(@PathParam("channelId") long channelId, @PathParam("groupId") long groupId,
                       @PathParam("requestId") long requestId)
    {
        LOGGER.debug("GroupJoinRequestService.delete(channel={}, group={}, request={})", channelId, groupId, requestId);

        GroupJoinRequest request = requestDao.get(channelId, groupId, requestId);
        if(request == null)
        {
            throw new GroupJoinRequestNotFoundException(
                    "No group join request could be found with that ID for that group in that channel");
        }

        // Only the original sender can delete a join request. Group members must use reject instead
        loggedInUser = userDao.getByProviderId(currentUserIdProvider.get());
        if(!request.getSender().equals(loggedInUser))
        {
            throw new NotSenderException("Only the sender of this join request can delete it");
        }

        requestDao.delete(request);
    }

    private boolean isGroupMember(long channelId, long groupId)
    {
        Group group = groupDao.get(groupId);
        if(group == null || group.getChannelId() != channelId)
        {
            throw new GroupNotFoundException("No group with that ID in that channel was found");
        }

        return isGroupMember(group);
    }

    private boolean isGroupMember(@Nonnull Group group)
    {
        loggedInUser = userDao.getByProviderId(currentUserIdProvider.get());
        return group.getMembers().stream().anyMatch(member -> member.getGroupeaseUser().equals(loggedInUser));
    }
}
