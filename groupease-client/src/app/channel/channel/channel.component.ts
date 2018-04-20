import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Channel } from '../../core/channel';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {

  /* Apply groupease-root CSS class to the component element. */
  @HostBinding('class.groupease-root') true;

  channel: Channel;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe(
      (data: { channel: Channel }) => {
        this.channel = data.channel;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
