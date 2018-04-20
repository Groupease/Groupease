import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupJoinRequestListComponent } from './group-join-request-list.component';
import { GroupJoinRequestService } from '../../core/group-join-request.service';
import { Observable } from 'rxjs/Observable';
import { MatExpansionModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('GroupJoinRequestListComponent', () => {
  let component: GroupJoinRequestListComponent;
  let fixture: ComponentFixture<GroupJoinRequestListComponent>;
  let groupJoinRequestService: jasmine.SpyObj<GroupJoinRequestService>;

  beforeEach(async(() => {

    groupJoinRequestService = jasmine.createSpyObj(
      'GroupJoinRequestService',
      [
        'listAllForGroup'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        GroupJoinRequestListComponent
      ],
      providers: [
        {
          provide: GroupJoinRequestService,
          useValue: groupJoinRequestService
        }
      ],
      imports: [
        MatExpansionModule,
        MatProgressBarModule,
        MatSnackBarModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupJoinRequestListComponent);
    component = fixture.componentInstance;
    groupJoinRequestService.listAllForGroup.and.returnValue(Observable.of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
