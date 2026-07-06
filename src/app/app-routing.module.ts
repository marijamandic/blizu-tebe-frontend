import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeLoggedComponent } from './home/home-logged/home-logged.component';
import { LoginComponent } from './login/login.component';
import { AnnouncementComponent } from './announcements/announcement/announcement.component';
import { AnnouncementViewComponent } from './announcements/announcement-view/announcement-view.component';
import { AnnouncementAddComponent } from './announcements/announcement-add/announcement-add.component';
import { AnnouncementUpdateComponent } from './announcements/announcement-update/announcement-update.component';
import { LocalCommunityAdminComponent } from './local-community/local-community-admin/local-community-admin.component';
import { ViewAllLocalCommunityComponent } from './local-community/view-all-local-community/view-all-local-community.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { ViewAllUsersComponent } from './profile/view-all-users/view-all-users.component';
import { ViewCommunityComponent } from './local-community/view-community/view-community.component';
import { EditLocalCommunity } from './local-community/edit-local-community/edit-local-community';
import { RegisterAdmin } from './profile/register-admin/register-admin';
import { CommunityRequestComponent } from './community-requests/community-request/community-request.component';
import { CommunityRequestAddComponent } from './community-requests/community-request-add.component/community-request-add.component';
import { CommunityRequestViewComponent } from './community-requests/community-request-view.component/community-request-view.component';
import { CommunityRequestUpdateComponent } from './community-requests/community-request-update.component/community-request-update.component';
import { ParticipantsComponent } from './profile/participants/participants';
import { RateComponent } from './profile/rate/rate';
import { DiscussionComponent } from './discussions/discussion.component/discussion.component';
import { ChatComponent } from './discussions/chat.component/chat.component';
import { ViewUsersForMembersComponent } from './profile/view-users-for-members/view-users-for-members';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { HelpRequestComponent } from './help-requests/help-request/help-request.component';
import { HelpRequestAddComponent } from './help-requests/help-request-add/help-request-add.component';
import { HelpRequestViewComponent } from './help-requests/help-request-view/help-request-view.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component:HomeLoggedComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'registerAdmin', component: RegisterAdmin, canActivate: [AdminGuard]},
  {path: 'announcement', component: AnnouncementComponent, canActivate: [AuthGuard]},
  { path: 'announcement/add', component: AnnouncementAddComponent , canActivate: [AdminGuard]},
  { path: 'announcement/edit/:id', component: AnnouncementUpdateComponent, canActivate: [AdminGuard] },
  { path: 'announcement/:id', component: AnnouncementViewComponent , canActivate: [AuthGuard]},
  { path: 'community/add', component: LocalCommunityAdminComponent, canActivate: [AdminGuard]},
  {path: 'community/all', component:ViewAllLocalCommunityComponent, canActivate: [AdminGuard]},
  { path: 'view-user/:id', component: UserProfileComponent , canActivate: [AuthGuard]},
  { path: 'edit-user/:id', component: EditProfileComponent , canActivate: [AuthGuard]},
  { path: 'view-all-users', component: ViewAllUsersComponent , canActivate: [AdminGuard]},
  { path: 'view-all-users-for-members', component: ViewUsersForMembersComponent, canActivate: [AuthGuard] },
  { path: 'view-community/:id', component: ViewCommunityComponent , canActivate: [AuthGuard]},
  { path: 'edit-community/:id', component: EditLocalCommunity , canActivate: [AdminGuard]},
  { path: 'community-request', component: CommunityRequestComponent, canActivate: [AuthGuard]},
  { path: 'community-request/add', component: CommunityRequestAddComponent , canActivate: [AdminGuard]},
  { path: 'community-request/edit/:id', component: CommunityRequestUpdateComponent , canActivate: [AdminGuard]},
  { path: 'community-request/:id', component: CommunityRequestViewComponent , canActivate: [AuthGuard]},
  { path: 'community-request-participants/:id', component: ParticipantsComponent, canActivate: [AuthGuard] },
  { path: 'rate/:userId', component: RateComponent , canActivate: [AdminGuard]},
  { path: 'discussion', component: DiscussionComponent, canActivate: [AuthGuard]},
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard]},
  { path: 'helpRequests', component: HelpRequestComponent, canActivate: [AuthGuard],  data: { mode: 'all' }},
  { path: 'myHelpRequests', component: HelpRequestComponent, canActivate: [AuthGuard],  data: { mode: 'mine' }},
  { path: 'helpRequest/add', component: HelpRequestAddComponent, canActivate: [AuthGuard]},
  { path: 'helpRequest/edit/:id', component: HelpRequestAddComponent, canActivate: [AuthGuard]},
  { path: 'helpRequest/:id', component: HelpRequestViewComponent, canActivate: [AuthGuard]},
  
  { path: 'helpOffers', component: HelpRequestComponent, canActivate: [AuthGuard],  data: { mode: 'all' }},
  { path: 'myHelpOffers', component: HelpRequestComponent, canActivate: [AuthGuard],  data: { mode: 'mine' }},
  { path: 'helpOffer/add', component: HelpRequestAddComponent, canActivate: [AuthGuard]},
  { path: 'helpOffer/edit/:id', component: HelpRequestAddComponent, canActivate: [AuthGuard]},
  { path: 'helpOffer/:id', component: HelpRequestViewComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
