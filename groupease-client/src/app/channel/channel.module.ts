import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelComponent } from './channel/channel.component';
import { MatCardModule, MatIconModule, MatListModule, MatProgressBarModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { ChannelNavigationComponent } from './channel-navigation/channel-navigation.component';
import { ChannelHomeComponent } from './channel-home/channel-home.component';

@NgModule({
  imports: [
    CommonModule,
    ChannelRoutingModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  declarations: [
    ChannelComponent,
    ChannelHomeComponent,
    ChannelNavigationComponent
  ]
})
export class ChannelModule { }
