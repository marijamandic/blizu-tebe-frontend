import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomeLoggedComponent } from './home/home-logged/home-logged.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnnouncementComponent } from './announcements/announcement/announcement.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { AnnouncementAddComponent } from './announcements/announcement-add/announcement-add.component';
import { AnnouncementViewComponent } from './announcements/announcement-view/announcement-view.component';
import { AnnouncementUpdateComponent } from './announcements/announcement-update/announcement-update.component';
import { LocalCommunityAdminComponent } from './local-community/local-community-admin/local-community-admin.component';
import { ViewAllLocalCommunityComponent } from './local-community/view-all-local-community/view-all-local-community.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
     HomeComponent,
     HomeLoggedComponent,
     LoginComponent,
     AnnouncementComponent,
     SidebarComponent,
     NavbarComponent,
     AnnouncementAddComponent,
     AnnouncementViewComponent,
     AnnouncementUpdateComponent,
     LocalCommunityAdminComponent,
     ViewAllLocalCommunityComponent,
     RegisterComponent,
     UserProfileComponent,
     EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
   
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
