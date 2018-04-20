import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMemberDirectoryComponent } from './channel-member-directory.component';
import { MatExpansionModule, MatIconModule, MatListModule, MatProgressBarModule } from '@angular/material';
import { MemberService } from '../../core/member.service';
import { Member } from '../../core/member';
import { Channel } from '../../core/channel';
import { User } from '../../core/user';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChannelMemberDirectoryComponent', () => {
  let component: ChannelMemberDirectoryComponent;
  let fixture: ComponentFixture<ChannelMemberDirectoryComponent>;
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
        ChannelMemberDirectoryComponent
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
                data: Observable.of(
                  {
                    channel: channel
                  }
                )
              }
            }
          }
        }
      ],
      imports: [
        NoopAnimationsModule,
        MatExpansionModule,
        MatIconModule,
        MatListModule,
        MatProgressBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelMemberDirectoryComponent);
    component = fixture.componentInstance;
    memberService.listAllInChannel.and.returnValue(Observable.of( [ member ] ));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
