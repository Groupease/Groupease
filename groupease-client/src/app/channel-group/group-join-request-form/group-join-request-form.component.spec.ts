import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupJoinRequestFormComponent } from './group-join-request-form.component';
import { GroupJoinRequestService } from '../../core/group-join-request.service';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GroupJoinRequestFormComponent', () => {
  let component: GroupJoinRequestFormComponent;
  let fixture: ComponentFixture<GroupJoinRequestFormComponent>;
  let groupJoinRequestService: jasmine.SpyObj<GroupJoinRequestService>;

  beforeEach(async(() => {

    groupJoinRequestService = jasmine.createSpyObj(
      'GroupJoinRequestService',
      [
        'createRequest'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        GroupJoinRequestFormComponent
      ],
      providers: [
        {
          provide: GroupJoinRequestService,
          useValue: groupJoinRequestService
        }
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupJoinRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
