import { Component, HostBinding } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent {

  /* Apply CSS class to the component element. */
  @HostBinding('class.groupease-root') true;

}
