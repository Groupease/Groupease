import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatExpansionModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { UserService } from '../../core/user.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Channel } from '../../core/channel';
import { ChannelInvitationService } from '../../core/channel-invitation.service';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let channelInvitationService: jasmine.SpyObj<ChannelInvitationService>;
  let userService: jasmine.SpyObj<UserService>;
  let channel: Channel;

  beforeEach(async(() => {

    channel = new Channel();
    channel.id = 123;
    channel.name = 'channel name';
    channel.description = 'channel description';
    channel.lastUpdatedOn = 1523198394721;

    channelInvitationService = jasmine.createSpyObj(
      'ChannelInvitationService',
      [
        'createInvitation'
      ]
    );

    userService = jasmine.createSpyObj(
      'UserService',
      [
        'listAll'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        UserListComponent
      ],
      providers: [
        {
          provide: ChannelInvitationService,
          useValue: channelInvitationService
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
        MatExpansionModule,
        MatSnackBarModule,
        MatProgressBarModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService.listAll.and.returnValue(Observable.of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
