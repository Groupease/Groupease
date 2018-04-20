import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailsInvitationsComponent } from './group-details-invitations.component';
import { MemberService } from '../../core/member.service';
import { Channel } from '../../core/channel';
import { Member } from '../../core/member';
import { User } from '../../core/user';
import { Group } from '../../core/group';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { GroupInvitationService } from '../../core/group-invitation.service';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GroupDetailsInvitationsComponent', () => {
  let component: GroupDetailsInvitationsComponent;
  let fixture: ComponentFixture<GroupDetailsInvitationsComponent>;
  let memberService: jasmine.SpyObj<MemberService>;
  let groupInvitationService: GroupInvitationService;
  let channel: Channel;
  let member: Member;
  let group: Group;

  beforeEach(async(() => {

    channel = new Channel();
    channel.id = 123;
    channel.name = 'channel name';
    channel.description = 'channel description';
    channel.lastUpdatedOn = 1523198394721;

    member = new Member();
    member.id = 456;
    member.channel = channel;
    member.owner = false;
    member.groupeaseUser = new User();

    group = new Group();
    group.id = 789;
    group.channelId = channel.id;
    group.name = 'group name';
    group.description = 'group description';
    group.full = false;
    group.members = [];

    memberService = jasmine.createSpyObj(
      'MemberService',
      [
        'listAllInChannel'
      ]
    );

    groupInvitationService = jasmine.createSpyObj(
      'GroupInvitationService',
      [
        'createInvitation'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        GroupDetailsInvitationsComponent
      ],
      providers: [
        {
          provide: MemberService,
          useValue: memberService
        },
        {
          provide: GroupInvitationService,
          useValue: groupInvitationService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              data: Observable.of(
                {
                  group: group
                }
              )
            }
          }
        }
      ],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatListModule,
        MatProgressBarModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailsInvitationsComponent);
    component = fixture.componentInstance;
    memberService.listAllInChannel.and.returnValue(Observable.of( [ member ]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
