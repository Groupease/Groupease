import { Component, HostBinding, OnInit } from '@angular/core';
import { GroupInvitationService } from '../../core/group-invitation.service';
import { MemberService } from '../../core/member.service';
import { Group } from '../../core/group';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../core/member';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { MatExpansionPanel, MatSnackBar } from '@angular/material';
import { GroupInvitation } from '../../core/group-invitation';

@Component({
  selector: 'app-group-details-invitations',
  templateUrl: './group-details-invitations.component.html',
  styleUrls: ['./group-details-invitations.component.scss']
})
export class GroupDetailsInvitationsComponent implements OnInit {

  /* Apply CSS class to the component element. */
  @HostBinding('class.groupease-view') true;

  public memberListObservable: Observable<Member[]>;

  private group: Group;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private groupInvitationService: GroupInvitationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    /* Get members in channel and store group for creating a GroupInvitation later. */
    this.memberListObservable = this.route.parent.data.switchMap(
      (data: { group: Group }) => {
        this.group = data.group;
        return this.memberService.listAllInChannel(data.group.channelId);
      }
    );
  }

  invite(
    member: Member,
    memberPanel: MatExpansionPanel
  ): void {

    const groupInvitation: GroupInvitation = new GroupInvitation();
    groupInvitation.group = this.group;
    groupInvitation.recipient = member.groupeaseUser;

    this.groupInvitationService.createInvitation(groupInvitation)
      .subscribe(
        () => {
          const snackBarRef = this.snackBar.open(
            'Group invitation sent',
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

          /* Collapse the panel. */
          memberPanel.close();
        },
        () => {
          const snackBarRef = this.snackBar.open(
            'Group invitation failed',
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
