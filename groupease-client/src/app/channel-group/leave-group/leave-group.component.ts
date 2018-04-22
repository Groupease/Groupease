import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../core/group';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../core/member.service';
import { Observable } from 'rxjs/Observable';
import { Member } from '../../core/member';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { GroupService } from '../../core/group.service';
import { MatSnackBar } from '@angular/material';

class GroupMemberStatus {
  group: Group;
  currentMember: Member;
  currentlyInGroup: boolean;
}

@Component({
  selector: 'app-leave-group',
  templateUrl: './leave-group.component.html',
  styleUrls: ['./leave-group.component.scss']
})
export class LeaveGroupComponent implements OnInit {

  /* Apply CSS class to the component element. */
  @HostBinding('class.groupease-view') true;

  groupMemberStatusObservable: Observable<GroupMemberStatus>;

  constructor(
    private groupService: GroupService,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.groupMemberStatusObservable = this.route.parent.data.switchMap(
      (data: { group: Group }) => {
        return Observable.of(data.group);
      }
    ).switchMap(
      (group: Group) => {
        return this.memberService.getMemberForCurrentUser(group.channelId).switchMap(
          (currentMember: Member) => {
            const currentlyInGroup: boolean = group.members.some(
              (groupMember: Member) => {
                return groupMember.id === currentMember.id;
              }
            );

            const groupMemberStatus: GroupMemberStatus = new GroupMemberStatus();
            groupMemberStatus.group = group;
            groupMemberStatus.currentMember = currentMember;
            groupMemberStatus.currentlyInGroup = currentlyInGroup;

            return Observable.of(groupMemberStatus);
          }
        );
      }
    );
  }

  leaveGroup(
    groupMemberStatus: GroupMemberStatus
  ): void {
    const group = groupMemberStatus.group;
    const currentMember = groupMemberStatus.currentMember;

    /* Remove current user. */
    group.members = group.members.filter(
      (groupMember: Member) => {
        return groupMember.id !== currentMember.id;
      }
    );

    this.groupService.updateGroup(group)
      .subscribe(
        () => {
          const snackBarRef = this.snackBar.open(
            'Group left',
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

          /* Reload data. */
          this.loadData();
        },
        () => {
          const snackBarRef = this.snackBar.open(
            'Failed to leave group',
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
