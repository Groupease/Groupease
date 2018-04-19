import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Group } from '../../core/group';
import { GroupJoinRequestService } from '../../core/group-join-request.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { GroupJoinRequest } from '../../core/group-join-request';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-join-request-list',
  templateUrl: './group-join-request-list.component.html',
  styleUrls: ['./group-join-request-list.component.scss']
})
export class GroupJoinRequestListComponent implements OnChanges {

  @Input()
  group: Group;

  groupJoinRequestListObservable: Observable<GroupJoinRequest[]>;

  constructor(
    private groupJoinRequestService: GroupJoinRequestService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnChanges() {
    if (this.group) {
      this.groupJoinRequestListObservable = this.groupJoinRequestService.listAllForGroup(
        this.group.channelId,
        this.group.id
      );
    }
  }

  acceptRequest(
    groupJoinRequest: GroupJoinRequest
  ): void {
    this.groupJoinRequestService.acceptRequest(groupJoinRequest)
      .subscribe(
        () => {
          const snackBarRef = this.snackBar.open(
            'Request approved',
            'DISMISS',
            {
              duration: 2000
            }
          );

          /* Dismiss notification if dismiss clicked. */
          snackBarRef.onAction().subscribe(
            () => {
              snackBarRef.dismiss();
            }
          );

          /* Navigate to group page. */
          this.router.navigate(
            [
              '../..'
            ],
            {
              relativeTo: this.route
            }
          );
        },
        () => {
          const snackBarRef = this.snackBar.open(
            'Request approval failed',
            'DISMISS',
            {
              duration: 2000
            }
          );

          /* Dismiss notification if dismiss clicked. */
          snackBarRef.onAction().subscribe(
            () => {
              snackBarRef.dismiss();
            }
          );
        }
      );
  }

  rejectRequest(
    groupJoinRequest: GroupJoinRequest
  ): void {
    this.groupJoinRequestService.rejectRequest(groupJoinRequest)
      .subscribe(
        () => {
          const snackBarRef = this.snackBar.open(
            'Request rejected',
            'DISMISS',
            {
              duration: 2000
            }
          );

          /* Dismiss notification if dismiss clicked. */
          snackBarRef.onAction().subscribe(
            () => {
              snackBarRef.dismiss();
            }
          );

          /* Reload list observable. */
          this.ngOnChanges();
        },
        () => {
          const snackBarRef = this.snackBar.open(
            'Request rejection failed',
            'DISMISS',
            {
              duration: 2000
            }
          );

          /* Dismiss notification if dismiss clicked. */
          snackBarRef.onAction().subscribe(
            () => {
              snackBarRef.dismiss();
            }
          );
        }
      );
  }

}
