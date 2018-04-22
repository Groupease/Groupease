import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveGroupComponent } from './leave-group.component';
import { MatButtonModule, MatCardModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { GroupService } from '../../core/group.service';
import { MemberService } from '../../core/member.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Group } from '../../core/group';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Channel } from '../../core/channel';
import { User } from '../../core/user';
import { Member } from '../../core/member';

describe('LeaveGroupComponent', () => {
  let component: LeaveGroupComponent;
  let fixture: ComponentFixture<LeaveGroupComponent>;
  let groupService: jasmine.SpyObj<GroupService>;
  let memberService: jasmine.SpyObj<MemberService>;
  let channel: Channel;
  let group: Group;
  let member: Member;

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
    group.channelId = channel.id;
    group.members = [
      member
    ];

    groupService = jasmine.createSpyObj(
      'GroupService',
      [
        'updateGroup'
      ]
    );

    memberService = jasmine.createSpyObj(
      'MemberService',
      [
        'getMemberForCurrentUser'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        LeaveGroupComponent
      ],
      providers: [
        {
          provide: GroupService,
          useValue: groupService
        },
        {
          provide: MemberService,
          useValue: memberService
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
        MatButtonModule,
        MatCardModule,
        MatProgressBarModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveGroupComponent);
    component = fixture.componentInstance;
    memberService.getMemberForCurrentUser.and.returnValue(Observable.of(member));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
