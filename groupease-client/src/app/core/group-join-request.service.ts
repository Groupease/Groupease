import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GroupJoinRequest } from './group-join-request';

@Injectable()
export class GroupJoinRequestService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Returns the options for HTTP calls, including authentication headers.
   *
   * @returns {{headers: HttpHeaders}}
   */
  private getHttpOptions(): {headers: HttpHeaders} {
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this.authService.getAccessToken()}`)
    };
  }

  /**
   * Fetches a list of all group join requests for the specified group.
   *
   * @param {number} channelId
   * @param {number} groupId
   * @returns {Observable<GroupJoinRequest[]>}
   */
  listAllForGroup(
    channelId: number,
    groupId: number
  ): Observable<GroupJoinRequest[]> {

    const url = `api/channels/${channelId}/groups/${groupId}/join-requests`;

    return this.http.get<GroupJoinRequest[]>(
      url,
      this.getHttpOptions()
    );
  }

  /**
   * Fetches a group join request from the server by its IDs.
   *
   * @param {number} channelId
   * @param {number} groupId
   * @param {number} requestId
   * @returns {Observable<GroupJoinRequest>}
   */
  getRequest(
    channelId: number,
    groupId: number,
    requestId: number
  ): Observable<GroupJoinRequest> {

    const url = `api/channels/${channelId}/groups/${groupId}/join-requests/${requestId}`;

    return this.http.get<GroupJoinRequest>(
      url,
      this.getHttpOptions()
    );
  }

  /**
   * Creates a new group join request on the server.
   *
   * @param {GroupJoinRequest} groupJoinRequest
   * @returns {Observable<GroupJoinRequest>}
   */
  createRequest(
    groupJoinRequest: GroupJoinRequest
  ): Observable<GroupJoinRequest> {

    const channelId = groupJoinRequest.group.channelId;
    const groupId = groupJoinRequest.group.id;
    const url = `api/channels/${channelId}/groups/${groupId}/join-requests`;

    return this.http.post<GroupJoinRequest>(
      url,
      groupJoinRequest,
      this.getHttpOptions()
    );
  }

  /**
   * Accepts a group join request, adding the sender as a member.
   *
   * @param {GroupJoinRequest} groupJoinRequest
   * @returns {Observable<GroupJoinRequest>}
   */
  acceptRequest(
    groupJoinRequest: GroupJoinRequest
  ): Observable<GroupJoinRequest> {

    const channelId = groupJoinRequest.group.channelId;
    const groupId = groupJoinRequest.group.id;
    const url = `api/channels/${channelId}/groups/${groupId}/join-requests/${groupJoinRequest.id}/acceptance`;

    return this.http.post<GroupJoinRequest>(
      url,
      groupJoinRequest,
      this.getHttpOptions()
    );
  }

  /**
   * Rejects a group join request, deleting it.
   *
   * @param {GroupJoinRequest} groupJoinRequest
   * @returns {Observable<GroupJoinRequest>}
   */
  rejectRequest(
    groupJoinRequest: GroupJoinRequest
  ): Observable<GroupJoinRequest> {

    const channelId = groupJoinRequest.group.channelId;
    const groupId = groupJoinRequest.group.id;
    const url = `api/channels/${channelId}/groups/${groupId}/join-requests/${groupJoinRequest.id}/rejection`;

    return this.http.post<GroupJoinRequest>(
      url,
      groupJoinRequest,
      this.getHttpOptions()
    );
  }

  /**
   * Deletes a group join request from the server.
   *
   * @param {GroupJoinRequest} groupJoinRequest
   * @returns {Observable<GroupJoinRequest>}
   */
  deleteRequest(
    groupJoinRequest: GroupJoinRequest
  ): Observable<GroupJoinRequest> {

    const channelId = groupJoinRequest.group.channelId;
    const groupId = groupJoinRequest.group.id;
    const url = `api/channels/${channelId}/groups/${groupId}/join-requests/${groupJoinRequest.id}`;

    return this.http.delete<GroupJoinRequest>(
      url,
      this.getHttpOptions()
    );
  }

}
