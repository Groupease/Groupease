import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailsRequestsComponent } from './group-details-requests.component';
import { Component, Input } from '@angular/core';
import { Group } from '../../core/group';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

/* Test stub. */
@Component({selector: 'app-group-join-request-form', template: ''})
class MockGroupJoinRequestFormComponent {
  @Input()
  group: Group;
}

/* Test stub. */
@Component({selector: 'app-group-join-request-list', template: ''})
class MockGroupJoinRequestListComponent {
  @Input()
  group: Group;
}

describe('GroupDetailsRequestsComponent', () => {
  let component: GroupDetailsRequestsComponent;
  let fixture: ComponentFixture<GroupDetailsRequestsComponent>;
  let group: Group;

  beforeEach(async(() => {

    group = new Group();

    TestBed.configureTestingModule({
      declarations: [
        GroupDetailsRequestsComponent,
        MockGroupJoinRequestFormComponent,
        MockGroupJoinRequestListComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              data: Observable.of(
                {
                  group: group
                }
              )
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
