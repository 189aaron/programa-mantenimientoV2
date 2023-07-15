import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { SessionDataService } from '../home/session-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  constructor(private router: Router, private loginService: AuthServiceService, private sessionData: SessionDataService) { }

  async onLogin(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      //this.router.navigateByUrl('home');

      const email = form['email'].value;
      const password = form['password'].value;
      
      await this.loginService.login(email, password);
      this.sessionData.getSessionData();


    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');
  }


}
