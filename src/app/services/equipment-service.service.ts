import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentServiceService {

  constructor(
    private router: Router,
    private loginService: AuthServiceService,
    private http: HttpClient) { }

  add_equipment(group_no: string, name: string, location: string, part_ship: string, trademark: string, model: string, type: string, ship: string, serial_number: string, power: string, calibration_date: string, observations: string, department_or_base: string) {
    let httpOptions = {
      headers: new HttpHeaders({

        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      })
    };

    const body = {
      'group_no': group_no,
      'name': name,
      'location': location,
      'part_ship': part_ship,
      'trademark': trademark,
      'model': model,
      'type': type,
      'ship': ship,
      'serial_number': serial_number,
      'power': power,
      'calibration_date': calibration_date,
      'observations': observations,
      'department_or_base': department_or_base
    };

    return this.http.post(this.loginService.path + 'equipment/', body, httpOptions).subscribe({
      next: (response: any) => {
        alert('Equipo registrado correctamente');
        this.router.navigate(['/home/equipos/consultar']);
      },
      error: (error: any) => {
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else if (error.status == '400') {
          alert(JSON.stringify(error.error, null, 2));
        } else if (error.status == '401') {
          alert(error.error.detail);
          this.router.navigate(['/home']);
        } else if (error.status == '500') {
          alert('Error del servidor');
        }

      }
    });

  };

  async delete_equipment(serial_number: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        }),
        params: {
          'serial_number': serial_number + '1',
        }
      };

      this.http.delete(this.loginService.path + 'configure_equipments/', httpOptions).subscribe({
        next: () => {
          //implementar exito
          alert('Equipo borrado con éxito');
          this.router.navigate(['/home/equipos/consultar']);
          resolve(true);
        },
        error: (error: any) => {
          if (error.error.code == 'token_not_valid') {
            alert('Caducó la sesión, por favor ingresa de nuevo');
            this.loginService.logout();
          } else {
            alert(error.error.detail);
          }
          reject(false);
        }
      })

    });
  }

  async updateEquipment(serial_number: any, group_no: any, nameEquipo: any, location: any, part_ship: any, ship: any, department_or_base: any, trademark: any, model: any, type: any, power: any, calibration_date: any, observations: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      }),
      params: {
        'serial_number': serial_number,
      }
    };

    const body = {
      'group_no': group_no,
      'name': nameEquipo,
      'location': location,
      'part_ship': part_ship,
      'ship': ship,
      'department_or_base': department_or_base,
      'trademark': trademark,
      'model': model,
      'type': type,
      'power': power,
      'serial_number': serial_number,
      'calibration_date': calibration_date,
      'observations': observations
    };

    this.http.put(this.loginService.path + 'configure_equipments/?serial_number=' + serial_number, body, httpOptions).subscribe({
      next: (response: any) => {
        alert('Equipo actualizado con éxito');
        this.router.navigate(['/home/equipos/consultar']);
      },
      error: (error: any) => {
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else if (error.status == '400') {
          alert(error.error.detail);
        } else if (error.status == '404') {
          alert('Usuario no encontrado');
        } else if (error.status == '500') {
          alert('Error del servidor');
        }
      }
    })

  }
}

