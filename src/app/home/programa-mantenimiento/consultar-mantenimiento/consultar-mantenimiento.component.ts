import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EquipmentServiceService } from 'src/app/services/equipment-service.service';
import { SessionDataService } from '../../session-data.service';
import { MaintenanceServiceService } from 'src/app/services/maintenance-service.service';

@Component({
  selector: 'app-consultar-mantenimiento',
  templateUrl: './consultar-mantenimiento.component.html'
})
export class ConsultarMantenimientoComponent {
  conData: string = '';
  whit_data: boolean = false;
  equipment_array: any[] = [];

  equipmentDeleted: boolean = false;
  errorDelete: string = '';//Para borrar el mantenimiento

  //para los modal eliminar
  eliminarMantenimiento: any;
  equipment_id: string = '';
  id: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private equipmentService: EquipmentServiceService,
    private maintenancetService: MaintenanceServiceService,
    public sessionData: SessionDataService,
    private loginService: AuthServiceService) { }

  ngOnInit(): void {
    let session = this.sessionData.position;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.get_equipment();
      this.eliminarMantenimiento = new Modal(document.getElementById('eliminarMantenimiento')!);//saco el modal para borrar
    }
  }

  async get_equipment() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      })
    };

    this.http.get(this.loginService.path + 'maintenances/', httpOptions).subscribe({
      next: (response: any) => {
        this.get_list_equiptment(response);
      },
      error: (error: any) => {
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else if (error.status == '400') {
          alert(error.error.detail);
        } else {
          //TODO ver el error 404 not found
          alert(error.error.detail);
        }
      }
    })
  }

  get_list_equiptment(data: any) {
    //veo si tengo que mostrar
    if (data.length != 0) {
      //si tiene data
      this.whit_data = true;
      this.equipment_array = data;
    } else {
      //no trae data
      this.conData =
        `<h3 class="text-center py-3">
          Aun no tenemos datos que mostrarte
        </h3>
        `;
      this.whit_data = false;
    }
  }

  updateMaintenance(equipo: any) {
    window.location.href =
      '#/home/programa-mantenimiento/editar-mantenimiento?equipment_id=' + equipo.equipment_id +
      '&id=' + equipo.id +
      '&description_of_work=' + equipo.description_of_work +
      '&intervals=' + equipo.intervals +
      '&hours=' + equipo.hours +
      '&alertPropertie=' + equipo.alert +
      '&maintenance=' + equipo.maintenance +
      '&observations=' + equipo.observations;
  }

  async deleteMaintenance() {
    try {
      const result = await this.maintenancetService.deleteMaintenance(this.equipment_id,this.id)
      console.log(result); // true
    } catch (error) {
      console.log(error); // false
    } finally {
      window.location.reload();
      //this.modalEliminarEquipo.hide();//Cierro modal
    }
  }

  pasarMantenimiento(equipo: any) {
    //borro algun valor anterior
    this.equipment_id = '';
    this.id = '';
    //seteo nuevos valores
    this.equipment_id = equipo.equipment_id;
    this.id = equipo.id;
  }

}
