import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeLoggedComponent } from './home/home-logged/home-logged.component';
import { LoginComponent } from './login/login.component';
import { AnnouncementComponent } from './announcement/announcement.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component:HomeLoggedComponent},
  { path: 'login', component: LoginComponent},
  {path: 'announcement', component: AnnouncementComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
