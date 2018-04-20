import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFormComponent } from './profile-form.component';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../core/member.service';
import { Member } from '../../core/member';
import { Channel } from '../../core/channel';
import { User } from '../../core/user';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let memberService: jasmine.SpyObj<MemberService>;
  let channel: Channel;
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

    memberService = jasmine.createSpyObj(
      'MemberService',
      [
        'getMemberForCurrentUser',
        'updateMember'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        ProfileFormComponent
      ],
      providers: [
        {
          provide: MemberService,
          useValue: memberService
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
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    memberService.getMemberForCurrentUser.and.returnValue(Observable.of(member));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
