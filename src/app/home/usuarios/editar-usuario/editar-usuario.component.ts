import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SessionDataService } from '../../session-data.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html'
})
export class EditarUsuarioComponent {
  whit_data: boolean = false;
  equipment_array: any;
  conData: string = '';


  email_id: string = '';
  nameUser: string = '';
  departamento: string = '';
  buque: string = '';
  cargo: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private loginService: AuthServiceService,
    private route: ActivatedRoute,
    public sessionData: SessionDataService
  ) { }

  ngOnInit(): void {
    this.email_id = this.route.snapshot.queryParams['id'];
    this.nameUser = this.route.snapshot.queryParams['name'];
    this.departamento = this.route.snapshot.queryParams['department_or_base'];
    this.buque = this.route.snapshot.queryParams['ship'];
    this.cargo = this.route.snapshot.queryParams['position'];
  }

  async updateUser(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      const name = form['nameUser'].value;
      const department_or_base = form['departamento'].value;
      const ship = form['buque'].value ;
      const position = form['cargo'].value;

      //this.loginService.registerUser(name, email, password, department_or_base, ship, position);
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        }),
        params: {
          'email': this.email_id,
        }
      };
  
      const body = {
        'name': name,
        'department_or_base': department_or_base,
        'ship': ship,
        'position': position
      };

      this.http.put(this.loginService.path + 'auth/configure_users/', body, httpOptions).subscribe({
        next: (response: any) => {
          alert('Usuario actualizado con exito');
          this.router.navigate(['/home/usuarios/consultar']);
        },
        error: (error: any) => {
          console.log(error)
          if (error.error.code == 'token_not_valid') {
            alert('Caducó la sesión, por favor ingresa de nuevo');
            this.loginService.logout();
          } else if (error.status == '400') {
            alert(error.error.non_field_errors);
          } else if (error.status == '403') {
            alert(error.error.detail);
            this.router.navigate(['/home']);
          } else if (error.status == '404') {
            alert('Usuario no encontrado');
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

  get_list_equiptment(data: any) {
    //veo si tengo que mostrar
    if (data.length != 0) {
      //si tiene data
      this.whit_data = true;
      this.equipment_array = data;
    } else {
      //no trae data
      this.conData = `<h3 class="text-center py-5">Aun no tenemos datos que mostrarte <br> <a href="#/register">Registrar un equipo</a></h3>`;
      this.whit_data = false;
    }
  }
}
