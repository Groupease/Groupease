import { Component, OnInit } from '@angular/core';
import { Channel } from '../../core/channel';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Member } from '../../core/member';
import { MemberService } from '../../core/member.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  memberListObservable: Observable<Member[]>;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.memberListObservable = this.route.parent.parent.parent.data.switchMap(
      (data: { channel: Channel }) => {
        const channelId: number = data.channel.id;
        return this.memberService.listAllInChannel(channelId);
      }
    );
  }

  deleteMember(
    member: Member
  ): void {
    this.memberService.deleteMember(member)
      .subscribe(
        () => {
          const snackBarRef = this.snackBar.open(
            'Channel member deleted',
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
          this.loadData();
        },
        () => {
          const snackBarRef = this.snackBar.open(
            'Channel member deletion failed',
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

  demoteMember(
    member: Member
  ): void {
    member.owner = false;
    this.memberService.updateMember(member)
      .subscribe(
        () => {
          const snackBarRef = this.snackBar.open(
            'Channel member is no longer an owner',
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
          this.loadData();
        },
        () => {
          const snackBarRef = this.snackBar.open(
            'Channel member demotion failed',
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

  promoteMember(
    member: Member
  ): void {
    member.owner = true;
    this.memberService.updateMember(member)
      .subscribe(
        () => {
          const snackBarRef = this.snackBar.open(
            'Channel member is now an owner',
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
          this.loadData();
        },
        () => {
          const snackBarRef = this.snackBar.open(
            'Channel member promotion failed',
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
