import { Component, Input, OnInit } from '@angular/core';
import { GroupJoinRequestService } from '../../core/group-join-request.service';
import { Group } from '../../core/group';
import { GroupJoinRequest } from '../../core/group-join-request';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-join-request-form',
  templateUrl: './group-join-request-form.component.html',
  styleUrls: ['./group-join-request-form.component.scss']
})
export class GroupJoinRequestFormComponent implements OnInit {

  @Input()
  group: Group;

  constructor(
    private groupJoinRequestService: GroupJoinRequestService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  sendJoinRequest(
    comments: string
  ): void {

    const groupJoinRequest = new GroupJoinRequest();
    groupJoinRequest.group = this.group;

    if (comments) {
      groupJoinRequest.comments = comments;
    }

    this.groupJoinRequestService.createRequest(groupJoinRequest)
      .subscribe(
        () => {

          const snackBarRef = this.snackBar.open(
            'Group join request sent',
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
              '../home'
            ],
            {
              relativeTo: this.route
            }
          );
        },
        () => {
          const snackBarRef = this.snackBar.open(
            'Group join request failed',
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
