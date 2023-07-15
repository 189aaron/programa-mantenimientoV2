import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/home/session-data.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(public gs: SessionDataService,
    private loginService: AuthServiceService) { }

  ngOnInit(): void {
  
  }

  logoutHeader() {
    return this.loginService.logout();
  }
}
