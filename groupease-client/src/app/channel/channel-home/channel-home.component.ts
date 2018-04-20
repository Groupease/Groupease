import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Channel } from '../../core/channel';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss']
})
export class ChannelHomeComponent implements OnInit, OnDestroy {

  /* Apply groupease-view CSS class to the component element. */
  @HostBinding('class.groupease-view') true;

  channel: Channel;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.parent.data.subscribe(
      (data: { channel: Channel }) => {
        this.channel = data.channel;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
