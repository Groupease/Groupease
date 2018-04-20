import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationListComponent } from './invitation-list.component';
import { MatButtonModule, MatExpansionModule, MatIconModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { ChannelInvitationService } from '../../core/channel-invitation.service';
import { UserService } from '../../core/user.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../core/user';

describe('InvitationListComponent', () => {
  let component: InvitationListComponent;
  let fixture: ComponentFixture<InvitationListComponent>;
  let channelInvitationService: jasmine.SpyObj<ChannelInvitationService>;
  let userService: jasmine.SpyObj<UserService>;
  let user: User;

  beforeEach(async(() => {

    user = new User();
    user.id = 12345;

    channelInvitationService = jasmine.createSpyObj(
      'ChannelInvitationService',
      [
        'listAllForUser',
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
        InvitationListComponent
      ],
      providers: [
        {
          provide: ChannelInvitationService,
          useValue: channelInvitationService
        },
        {
          provide: UserService,
          useValue: userService
        }
      ],
      imports: [
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
    fixture = TestBed.createComponent(InvitationListComponent);
    component = fixture.componentInstance;
    userService.getCurrentUser.and.returnValue(Observable.of(user));
    channelInvitationService.listAllForUser.and.returnValue(Observable.of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
