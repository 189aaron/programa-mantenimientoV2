import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SessionDataService } from '../../session-data.service';

@Component({
  selector: 'app-editar-refaccion',
  templateUrl: './editar-refaccion.component.html',
  styles: [
  ]
})
export class EditarRefaccionComponent {

  serial_number = '';
  amount = '';
  description = '';
  position = '';
  num_part = '';
  num_ref = '';
  sheet_diagram = '';
  item = '';
  plano = '';
  model = '';
  observations = '';
  id = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private loginService: AuthServiceService,
    private route: ActivatedRoute,
    public sessionData: SessionDataService
  ) { }

  ngOnInit(): void {
    let session = this.loginService.getIdToken;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      // Obtiene el valor de los parámetros 
      this.serial_number = this.route.snapshot.queryParams['serial_number'];
      this.amount = this.route.snapshot.queryParams['amount'];
      this.description = this.route.snapshot.queryParams['description'];
      this.position = this.route.snapshot.queryParams['position'];
      this.num_part = this.route.snapshot.queryParams['num_part'];
      this.num_ref = this.route.snapshot.queryParams['num_ref'];
      this.sheet_diagram = this.route.snapshot.queryParams['sheet_diagram'];
      this.item = this.route.snapshot.queryParams['item'];
      this.plano = this.route.snapshot.queryParams['plano'];
      this.model = this.route.snapshot.queryParams['model'];
      this.observations = this.route.snapshot.queryParams['observations'];
      this.id = this.route.snapshot.queryParams['id'];
      console.log(session)
    }

  }

  async update_sparepart(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      //this.loginService.registerUser(name, email, password, department_or_base, ship, position);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        }),
        params: {
          'id': this.id,
        }
      };

      let amount = form['amount'].value;
      let description = form['description'].value;
      let position = form['position'].value;
      let num_part = form['num_part'].value;
      let num_ref = form['num_ref'].value;
      let sheet_diagram = form['sheet_diagram'].value;
      let item = form['item'].value;
      let plano = form['plano'].value;
      let model = form['model'].value;
      let observations = form['observations'].value;

      //yoeli Hacks
      if (num_ref == '' || num_ref == null) {
        num_ref = 0;
      }
      if (item == '' || item == null) {
        item = 0;
      }
      if(position=='xxxx'){
        position = '';
      }
      if(num_part=='xxxx'){
        num_part = '';
      }
      if(sheet_diagram=='xxxx'){
        sheet_diagram = '';
      }
      if(plano=='xxxx'){
        plano = '';
      }
      if(model=='xxxx'){
        model = '';
      }

      const body = {
        'serial_number': this.serial_number,
        'amount': amount,
        'description': description,
        'position': position,
        'num_part': num_part,
        'num_ref': num_ref,
        'sheet_diagram': sheet_diagram,
        'item': item,
        'plano': plano,
        'model': model,
        'observations': observations
      };

      this.http.put(this.loginService.path + 'configure_spareparts/', body, httpOptions).subscribe({
        next: (response: any) => {
          //TODO: regresar al inicio
          alert('Refacción actulizada con exito');
          //Regresar una pagina para ver la actualización
          window.history.back();
        },
        error: (error: any) => {
          if (error.error.code == 'token_not_valid') {
            alert('Caducó la sesión, por favor ingresa de nuevo');
            this.loginService.logout();
          } else if (error.status == '400') {
            //TODO revisar porque falta algun campo
            alert(error.error.detail);
          } else if (error.status == '404') {
            alert('Usuario no encontrado');
          } else if (error.status == '500') {
            alert('Error del servidor');
          }
        }
      })

    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');





  }

}
