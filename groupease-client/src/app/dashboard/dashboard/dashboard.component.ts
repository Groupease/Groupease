import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  /* Apply groupease-view CSS class to the component element. */
  @HostBinding('class.groupease-view') true;

}
