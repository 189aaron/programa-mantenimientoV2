import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SessionDataService } from '../../session-data.service';

@Component({
  selector: 'app-consultar-usuario',
  templateUrl: './consultar-usuario.component.html',
  styles: [
  ]
})
export class ConsultarUsuarioComponent implements OnInit {

  conData: string = '';
  whit_data: boolean = false;
  users_array: any[] = [];
  errorDelete: string = '';

  userEmail: string = '';//para setear el correo del usuario a borrar
  userDeleted: boolean = false;//para eliminar un usuario

  constructor(
    private router: Router,
    private http: HttpClient,
    public sessionData: SessionDataService,
    private loginService: AuthServiceService) { }

  ngOnInit(): void {
    let session = this.sessionData.position;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.get_users();
    }
  }

  async get_users() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      })
    };

    this.http.get(this.loginService.path + 'auth/list_users/', httpOptions).subscribe({
      next: (response: any) => {
        this.get_list_users(response);
      },
      error: (error: any) => {
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else if (error.status == '400') {
          alert(error.error.detail);
        } else if (error.status == '403') {
          alert(error.error.detail);
          this.router.navigate(['/home']);
        } else {
          alert(JSON.stringify(error.error, null, 2));
        }
      }
    })
  }

  get_list_users(data: any) {
    //veo si tengo que mostrar
    if (data.length != 0) {
      //si tiene data
      this.whit_data = true;
      this.users_array = data;
    } else {
      //no trae data
      this.conData =
        `<h3 class="text-center py-3">
        Aun no hay usuarios registrados <br>
        ¿Deseas registrar un nuevo usuario?<br>
       Haz click en el siguiente enlace<br>
       <a href="#/register">Registrar Usuario</a>
       </h3>`;
      this.whit_data = false;
    }
  }

  editarUsuario(usuario: any) {
    window.location.href =
      '#/home/usuarios/editar-usuario?id=' + usuario.email +
      '&name=' + usuario.name +
      '&department_or_base=' + usuario.department_or_base +
      '&ship=' + usuario.ship +
      '&position=' + usuario.position;
  }

  pasarUser(user: any) {
    //borro algun valor anterior
    this.userDeleted = false;
    this.userEmail = '';
    this.errorDelete = '';
    //eteo nuevos valores
    this.userEmail = user.email;
    this.userDeleted = user.status_delete;
  }

  async borrarUsuario() {
    this.errorDelete = '';
    if (this.userDeleted) {
      this.errorDelete = `<p class="text-danger fw-bold pt-3">No puede borrar un usuario que ya fue eliminado</p>`;
    } else {
      this.errorDelete = '';
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        }),
        params: {
          'email': this.userEmail,
        }
      };
      this.http.delete(this.loginService.path + 'auth/configure_users/', httpOptions).subscribe({
        next: () => {
          //implementar exito
          alert('Usuario borrado con Exito\n Volverá a la pantalla inicial');
          this.router.navigate(['/home']);
        },
        error: (error: any) => {
          if (error.error.code == 'token_not_valid') {
            alert('Caducó la sesión, por favor ingresa de nuevo');
            this.loginService.logout();
          } else if (error.status == '400') {
            alert(error.error.detail);
          } else if (error.status == '404') {
            alert('Usuario no encontrado');
          }
        }
      });
    }





  }

}
