import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupDirectoryComponent } from './channel-group-directory.component';
import { GroupService } from '../../core/group.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Channel } from '../../core/channel';
import {
  MatButtonModule,
  MatChipsModule,
  MatExpansionModule,
  MatIconModule,
  MatProgressBarModule,
  MatTooltipModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChannelGroupDirectoryComponent', () => {
  let component: ChannelGroupDirectoryComponent;
  let fixture: ComponentFixture<ChannelGroupDirectoryComponent>;
  let groupService: jasmine.SpyObj<GroupService>;
  let channel: Channel;

  beforeEach(async(() => {

    channel = new Channel();
    channel.id = 123;
    channel.name = 'channel name';
    channel.description = 'channel description';
    channel.lastUpdatedOn = 1523198394721;

    groupService = jasmine.createSpyObj(
      'GroupService',
      [
        'listAllInChannel'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        ChannelGroupDirectoryComponent
      ],
      providers: [
        {
          provide: GroupService,
          useValue: groupService
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
              },
              snapshot: {}
            },
            snapshot: {}
          }
        }
      ],
      imports: [
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatIconModule,
        MatProgressBarModule,
        MatTooltipModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupDirectoryComponent);
    component = fixture.componentInstance;
    groupService.listAllInChannel.and.returnValue(Observable.of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
