import { Component, OnInit } from '@angular/core';
import { SessionDataService } from './session-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  

  constructor(private sessionData: SessionDataService) { }

  ngOnInit(): void {
    this.sessionData.getSessionData();
  }

}
