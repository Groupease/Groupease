import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRequestListComponent } from './join-request-list.component';
import { MatExpansionModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { ChannelJoinRequestService } from '../../core/channel-join-request.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Channel } from '../../core/channel';
import { of } from 'rxjs/observable/of';

describe('JoinRequestListComponent', () => {
  let component: JoinRequestListComponent;
  let fixture: ComponentFixture<JoinRequestListComponent>;
  let channel: Channel;
  let channelJoinRequestService: jasmine.SpyObj<ChannelJoinRequestService>;

  beforeEach(async(() => {

    channel = new Channel();
    channel.id = 123;
    channel.name = 'channel name';
    channel.description = 'channel description';
    channel.lastUpdatedOn = 1523198394721;

    channelJoinRequestService = jasmine.createSpyObj(
      'ChannelJoinRequestService',
      [
        'listAllForChannel'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        JoinRequestListComponent
      ],
      providers: [
        {
          provide: ChannelJoinRequestService,
          useValue: channelJoinRequestService
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
    fixture = TestBed.createComponent(JoinRequestListComponent);
    component = fixture.componentInstance;
    channelJoinRequestService.listAllForChannel.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch requests for channel', () => {
    expect(channelJoinRequestService.listAllForChannel).toHaveBeenCalledWith(channel.id);
  });

});
