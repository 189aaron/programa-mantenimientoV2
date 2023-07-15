import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-restablecer-token',
  templateUrl: './restablecer-token.component.html'
})
export class RestablecerTokenComponent {
  constructor(
    private loginService: AuthServiceService) { }

    async refreshToken(form: HTMLFormElement, event: Event) {
      if (form.checkValidity()) {
        // Si el formulario es válido
        event.preventDefault(); // Evita la recarga de la página
        event.stopPropagation(); // Evita la propagación del evento
  
        const email = form['email'].value;
  
        this.loginService.refreshToken(email);
  
      } else {
        // Si el formulario no es válido
        event.preventDefault(); // Evita la recarga de la página
        event.stopPropagation(); // Evita la propagación del evento
      }
      form.classList.add('was-validated');
    }
}
