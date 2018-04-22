import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelGroupDirectoryComponent } from './channel-group-directory/channel-group-directory.component';
import { GroupCreatorComponent } from './group-creator/group-creator.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupResolverService } from './group-resolver.service';
import { GroupDetailsHomeComponent } from './group-details-home/group-details-home.component';
import { GroupDetailsRequestsComponent } from './group-details-requests/group-details-requests.component';
import { GroupDetailsInvitationsComponent } from './group-details-invitations/group-details-invitations.component';
import { LeaveGroupComponent } from './leave-group/leave-group.component';

const channelGroupRoutes: Routes = [
  {
    path: 'directory',
    component: ChannelGroupDirectoryComponent
  },
  {
    path: 'create',
    component: GroupCreatorComponent
  },
  {
    path: ':groupId',
    component: GroupDetailsComponent,
    resolve: {
      group: GroupResolverService
    },
    children: [
      {
        path: 'home',
        component: GroupDetailsHomeComponent
      },
      {
        path: 'requests',
        component: GroupDetailsRequestsComponent
      },
      {
        path: 'invitations',
        component: GroupDetailsInvitationsComponent
      },
      {
        path: 'leave',
        component: LeaveGroupComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'directory',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(channelGroupRoutes)],
  exports: [RouterModule]
})
export class ChannelGroupRoutingModule { }
