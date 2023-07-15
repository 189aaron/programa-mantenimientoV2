import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SessionDataService } from '../../session-data.service';

@Component({
  selector: 'app-restablecer-contrasenia',
  templateUrl: './restablecer-contrasenia.component.html'
})
export class RestablecerContraseniaComponent {

  constructor(
    private loginService: AuthServiceService,
    public sessionData: SessionDataService) { }


  async updateUser(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      const email = form['email'].value;
      const password = form['password'].value;

      if (email != null && password != null) {
        this.loginService.changePassword(email, password);
      }

    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');
  }

}
