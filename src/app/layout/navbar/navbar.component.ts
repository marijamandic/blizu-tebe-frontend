import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() isSidebarOpen: boolean = false;
  @Output() menuClick = new EventEmitter<void>();

  constructor(private router: Router, private authService: AuthService) {}
  

  goToHomePage() {
  this.router.navigate(['/home']);
  }

  openSidebar(){
    this.isSidebarOpen = true;
  }

  closeSidebar(){
    this.isSidebarOpen = false;
  }

}
