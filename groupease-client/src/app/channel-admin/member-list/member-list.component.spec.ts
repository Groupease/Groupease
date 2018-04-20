import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListComponent } from './member-list.component';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Channel } from '../../core/channel';
import { MemberService } from '../../core/member.service';
import { Member } from '../../core/member';
import { User } from '../../core/user';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';

describe('MemberListComponent', () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;
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
        'listAllInChannel'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        MemberListComponent
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
    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    memberService.listAllInChannel.and.returnValue(Observable.of( [ member ] ));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
