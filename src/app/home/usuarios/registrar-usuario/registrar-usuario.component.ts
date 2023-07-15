import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SessionDataService } from '../../session-data.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html'
})
export class RegistrarUsuarioComponent  {

  constructor(
    private loginService: AuthServiceService,
    public sessionData: SessionDataService) { }


  async registerUser(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      const name = form['nameUser'].value;
      const email = form['email'].value;
      const password = form['password'].value;
      const department_or_base = form['departamento'].value;
      const ship = form['buque'].value ;
      const position = form['cargo'].value;

      this.loginService.registerUser(name, email, password, department_or_base, ship, position);

    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');
  }

}
