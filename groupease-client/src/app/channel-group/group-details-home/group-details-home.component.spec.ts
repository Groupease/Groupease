import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailsHomeComponent } from './group-details-home.component';
import { Component, Input } from '@angular/core';
import { Group } from '../../core/group';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Member } from '../../core/member';
import { MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule } from '@angular/material';

/* Test stub. */
@Component({selector: 'app-group-summary', template: ''})
class MockGroupSummaryComponent {
  @Input()
  group: Group;
}

/* Test stub. */
@Component({selector: 'app-group-member-list', template: ''})
class MockGroupMemberListComponent {
  @Input()
  members: Member[];
}

describe('GroupDetailsHomeComponent', () => {
  let component: GroupDetailsHomeComponent;
  let fixture: ComponentFixture<GroupDetailsHomeComponent>;
  let group: Group;

  beforeEach(async(() => {

    group = new Group();

    TestBed.configureTestingModule({
      declarations: [
        GroupDetailsHomeComponent,
        MockGroupSummaryComponent,
        MockGroupMemberListComponent
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
      ],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTooltipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
