import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class SessionDataService {

  userAdministrador: boolean = false;//Solo para administradores
  superUsuario: boolean = false;//exclusivo superUsuario, no admins
  ambosBuques: boolean = false;//exclusivo los que ven ambos buques

  position: string = '';//String para la posicion del usuario
  ship: string = '';//String para el buque del usuario
  id_token: boolean = false;//boolean para saber si hay un token activo

  constructor(private router: Router, public loginService: AuthServiceService,) { }

  getSessionData() {
    //reseteo los campos por si entran en el mismo navegador
    this.userAdministrador = false;
    this.superUsuario = false;
    this.ambosBuques = false;

    let sessionActive = sessionStorage.getItem('id_token');
    if (sessionActive == null || sessionActive == undefined) {
      this.router.navigate(['/login']);
    } else {
      //para el valor del header de posicion
      let positionAux = sessionStorage.getItem('position');
      if (positionAux != null || positionAux != undefined) {
        if (positionAux == 'SUPERUSUARIO') {
          this.superUsuario = true;
        } else if (positionAux == 'CAPITAN' || positionAux == 'JEFE DE MAQUINAS') {
          this.userAdministrador = true;
        }
        this.position = positionAux;//Paso la posición para el header
      }
      //para el valor del header de nave
      let shipAux = sessionStorage.getItem('ship');
      if (shipAux != null) {
        if (shipAux == 'AMBOS') {
          this.ambosBuques = true;
          shipAux = 'AMBOS BUQUES';
        }
        this.ship = shipAux;
      }
    }

  }
}
