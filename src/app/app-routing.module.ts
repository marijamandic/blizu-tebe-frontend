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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component:HomeLoggedComponent},
  { path: 'login', component: LoginComponent},
  {path: 'announcement', component: AnnouncementComponent},
  { path: 'announcement/add', component: AnnouncementAddComponent },
  { path: 'announcement/edit/:id', component: AnnouncementUpdateComponent },
  { path: 'announcement/:id', component: AnnouncementViewComponent },
  { path: 'community/add', component: LocalCommunityAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
