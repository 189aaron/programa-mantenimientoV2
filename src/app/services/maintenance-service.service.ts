import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceServiceService {

  constructor(
    private router: Router,
    private loginService: AuthServiceService,
    private http: HttpClient) { }

  register_maintenance(serial_number: any, description_of_work: any, intervals: number, hours_days: number, initial_date: Date, observations: any, alertPropertie: any, time: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      }),
      params: {
        'serial_number': serial_number,
      }
    };
    let body: any;

    if (time == 'HORAS' || time == 'DIAS') {
      body = {
        'time': time,
        'description_of_work': description_of_work,
        'intervals': intervals,
        'hours_days': hours_days,//Este valor solo aplica para horas y dias
        'observations': observations,
        'alert': alertPropertie
      };
    } else {
      body = {
        'time': time,
        'description_of_work': description_of_work,
        'intervals': intervals,
        'initial_date': initial_date,//Este valor solo aplica para Fecha
        'observations': observations,
        'alert': alertPropertie
      };
    }

    return this.http.post(this.loginService.path + 'maintenances/', body, httpOptions).subscribe({
      next: (response: any) => {
        console.log(response);
        alert('Mantenimiento registrado correctamente');
        this.router.navigate(['/home/programa-mantenimiento/consulta']);

      },
      error: (error: any) => {
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else if (error.status == '400') {
          alert(JSON.stringify(error.error.non_field_errors, null, 2));
        } else if (error.status == '401') {
          alert(error.error.detail);
          this.router.navigate(['/home']);
        } else if (error.status == '500') {
          alert('Error del servidor');
        }
      }
    });
  }

  updateMaintenance(id: string, equipment_id: string, description_of_work: string, intervals: number, hours: number, observations: string, alertPropertie: number, maintenance: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      }),
      params: {
        'id': id,
        'equipment_id': equipment_id
      }
    };

    const body = {
      'description_of_work': description_of_work,
      'intervals': intervals,
      'hours': hours,
      'observations': observations,
      'alert': alertPropertie,
      'maintenance': maintenance
    };

    return this.http.put(this.loginService.path + 'configure_maintenances/', body, httpOptions).subscribe({
      next: (response: any) => {
        //console.log('Se agrego la hora correctamente')
        alert('Mantenimiento actualizado con exito');
        this.router.navigate(['/home//programa-mantenimiento/consulta']);
      },
      error: (error: any) => {
        console.log(error)
        //TODO: hacer escenarios de error if (error.status == '400')
      }
    });
  }

  async deleteMaintenance(equipment_id: any, id: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        }),
        params: {
          'id': id,
          'equipment_id': equipment_id,
        }
      };

      this.http.delete(this.loginService.path + 'configure_maintenances/', httpOptions).subscribe({
        next: () => {
          //implementar exito
          alert('Mantenimieno borrado con éxito');
          this.router.navigate(['/home/programa-mantenimiento/consulta']);
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

}
