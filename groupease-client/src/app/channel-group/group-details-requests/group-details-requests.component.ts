import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Group } from '../../core/group';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-details-requests',
  templateUrl: './group-details-requests.component.html',
  styleUrls: ['./group-details-requests.component.scss']
})
export class GroupDetailsRequestsComponent implements OnInit {

  /* Apply CSS class to the component element. */
  @HostBinding('class.groupease-view') true;

  public groupObservable: Observable<Group>;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.groupObservable = this.route.parent.data.switchMap(
      (data: { group: Group }) => {
        return Observable.of(data.group);
      }
    );
  }

}
