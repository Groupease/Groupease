import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelMemberRoutingModule } from './channel-member-routing.module';
import { ChannelMemberDirectoryComponent } from './channel-member-directory/channel-member-directory.component';
import { MatExpansionModule, MatIconModule, MatListModule, MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ChannelMemberRoutingModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule
  ],
  declarations: [ChannelMemberDirectoryComponent]
})
export class ChannelMemberModule { }
