import { LOCALE_ID, NgModule } from '@angular/core';
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
import { ViewAllUsersComponent } from './profile/view-all-users/view-all-users.component';
import { ViewCommunityComponent } from './local-community/view-community/view-community.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { ViewUsersForMembersComponent } from './profile/view-users-for-members/view-users-for-members';
import { HelpRequestComponent } from './help-requests/help-request/help-request.component';
import { HelpRequestAddComponent } from './help-requests/help-request-add/help-request-add.component';
import { HelpRequestViewComponent } from './help-requests/help-request-view/help-request-view.component';
import { GiftComponent } from './gifts/gift/gift.component';
import { GiftViewComponent } from './gifts/gift-view/gift-view.component';
import { GiftAddComponent } from './gifts/gift-add/gift-add.component';
import { ReportComponent } from './reports/report/report.component';
import { ReportViewComponent } from './reports/report-view/report-view.component';
import { MessagingComponent } from './chat/messaging/messaging.component';
import { MessagingViewComponent } from './chat/messaging-view/messaging-view.component';
import { NotificationComponent } from './notification/notification.component';


registerLocaleData(localeDe);
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
     EditProfileComponent,
     ViewAllUsersComponent,
     ViewCommunityComponent,
     EditLocalCommunity,
     RegisterAdmin,
     CommunityRequestComponent,
     CommunityRequestAddComponent,
     CommunityRequestViewComponent,
     CommunityRequestUpdateComponent,
     ParticipantsComponent,
     RateComponent,
     DiscussionComponent,
     ChatComponent,
     ViewUsersForMembersComponent,
     HelpRequestComponent,
     HelpRequestAddComponent,
     HelpRequestViewComponent,
     GiftComponent,
     GiftViewComponent,
     GiftAddComponent,
     ReportComponent,
     ReportViewComponent,
     MessagingComponent,
     MessagingViewComponent,
     NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule
   
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'de-DE' }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
