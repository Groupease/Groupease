import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelListComponent } from './channel-list.component';
import { MatIconModule, MatListModule, MatProgressBarModule } from '@angular/material';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { ChannelService } from '../../core/channel.service';

describe('ChannelListComponent', () => {
  let component: ChannelListComponent;
  let fixture: ComponentFixture<ChannelListComponent>;
  let channelService: jasmine.SpyObj<ChannelService>;

  beforeEach(async(() => {

    channelService = jasmine.createSpyObj(
      'ChannelService',
      [
        'listWhereMember'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        ChannelListComponent
      ],
      providers: [
        {
          provide: ChannelService,
          useValue: channelService
        }
      ],
      imports: [
        MatIconModule,
        MatListModule,
        MatProgressBarModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelListComponent);
    component = fixture.componentInstance;
    channelService.listWhereMember.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
