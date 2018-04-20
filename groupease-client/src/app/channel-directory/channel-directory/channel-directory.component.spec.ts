import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDirectoryComponent } from './channel-directory.component';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { of } from 'rxjs/observable/of';
import { ChannelService } from '../../core/channel.service';
import { FormsModule } from '@angular/forms';
import { ChannelJoinRequestService } from '../../core/channel-join-request.service';

describe('ChannelDirectoryComponent', () => {
  let component: ChannelDirectoryComponent;
  let fixture: ComponentFixture<ChannelDirectoryComponent>;
  let channelService: jasmine.SpyObj<ChannelService>;
  let channelJoinRequestService: jasmine.SpyObj<ChannelJoinRequestService>;

  beforeEach(async(() => {

    channelService = jasmine.createSpyObj(
      'ChannelService',
      [
        'listAll'
      ]
    );

    channelJoinRequestService = jasmine.createSpyObj(
      'ChannelJoinRequestService',
      [
        'createRequest'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        ChannelDirectoryComponent
      ],
      providers: [
        {
          provide: ChannelService,
          useValue: channelService
        },
        {
          provide: ChannelJoinRequestService,
          useValue: channelJoinRequestService
        }
      ],
      imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCardModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatTooltipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelDirectoryComponent);
    component = fixture.componentInstance;
    channelService.listAll.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
