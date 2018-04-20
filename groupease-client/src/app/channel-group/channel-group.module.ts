import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelGroupRoutingModule } from './channel-group-routing.module';
import { ChannelGroupDirectoryComponent } from './channel-group-directory/channel-group-directory.component';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatProgressBarModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { GroupCreatorComponent } from './group-creator/group-creator.component';
import { FormsModule } from '@angular/forms';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupResolverService } from './group-resolver.service';
import { GroupDetailsHomeComponent } from './group-details-home/group-details-home.component';
import { GroupSummaryComponent } from './group-summary/group-summary.component';
import { GroupMemberListComponent } from './group-member-list/group-member-list.component';
import { GroupDetailsRequestsComponent } from './group-details-requests/group-details-requests.component';
import { GroupDetailsInvitationsComponent } from './group-details-invitations/group-details-invitations.component';
import { GroupJoinRequestListComponent } from './group-join-request-list/group-join-request-list.component';
import { GroupJoinRequestFormComponent } from './group-join-request-form/group-join-request-form.component';

@NgModule({
  imports: [
    CommonModule,
    ChannelGroupRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule
  ],
  declarations: [
    ChannelGroupDirectoryComponent,
    GroupCreatorComponent,
    GroupDetailsComponent,
    GroupDetailsHomeComponent,
    GroupSummaryComponent,
    GroupMemberListComponent,
    GroupDetailsRequestsComponent,
    GroupDetailsInvitationsComponent,
    GroupJoinRequestListComponent,
    GroupJoinRequestFormComponent
  ],
  providers: [GroupResolverService]
})
export class ChannelGroupModule { }
