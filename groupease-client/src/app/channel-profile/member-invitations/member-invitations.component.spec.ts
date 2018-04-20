import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInvitationsComponent } from './member-invitations.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatExpansionModule, MatIconModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { GroupInvitationService } from '../../core/group-invitation.service';
import { UserService } from '../../core/user.service';
import { Channel } from '../../core/channel';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../core/user';

describe('MemberInvitationsComponent', () => {
  let component: MemberInvitationsComponent;
  let fixture: ComponentFixture<MemberInvitationsComponent>;
  let groupInvitationService: jasmine.SpyObj<GroupInvitationService>;
  let userService: jasmine.SpyObj<UserService>;
  let channel: Channel;
  let currentUser: User;

  beforeEach(async(() => {

    channel = new Channel();
    channel.id = 123;
    channel.name = 'channel name';
    channel.description = 'channel description';
    channel.lastUpdatedOn = 1523198394721;

    currentUser = new User();
    currentUser.id = 456;

    groupInvitationService = jasmine.createSpyObj(
      'GroupInvitationService',
      [
        'listAllForUserInChannel',
        'acceptInvitation',
        'rejectInvitation'
      ]
    );

    userService = jasmine.createSpyObj(
      'UserService',
      [
        'getCurrentUser'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        MemberInvitationsComponent
      ],
      providers: [
        {
          provide: GroupInvitationService,
          useValue: groupInvitationService
        },
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              parent: {
                parent: {
                  data: Observable.of(
                    {
                      channel: channel
                    }
                  )
                }
              }
            }
          }
        }
      ],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatProgressBarModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberInvitationsComponent);
    component = fixture.componentInstance;
    userService.getCurrentUser.and.returnValue(Observable.of(currentUser));
    groupInvitationService.listAllForUserInChannel.and.returnValue(Observable.of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
