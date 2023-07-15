import { Component, OnInit } from '@angular/core';
import { SessionDataService } from '../session-data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
  ]
})
export class MenuComponent implements OnInit {

  constructor(public sessionData: SessionDataService) { }
  ngOnInit(): void {
    this.sessionData.getSessionData();
  }

  
  
}
