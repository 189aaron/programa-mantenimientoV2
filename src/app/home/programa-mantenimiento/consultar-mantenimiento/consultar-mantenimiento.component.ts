import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  path: string = this.loginService.path;
  conData_hours: string = '';
  conData_days: string = '';
  conData_months: string = '';
  whit_data_hours: boolean = false;
  whit_data_days: boolean = false;
  whit_data_months: boolean = false;
  equipment_array: any[] = [];
  serial_numberAux = '';

  // Arreglo existente
  equipment_array_hours: any[] = [];
  equipment_array_days: any[] = [];
  equipment_array_months: any[] = [];

  equipmentDeleted: boolean = false;
  errorDelete: string = '';//Para borrar el mantenimiento

  //para los modal eliminar
  eliminarMantenimiento: any;
  equipment_id: string = '';
  id: string = '';

  selectedOption: string = 'novalue';

  constructor(
    private router: Router,
    private http: HttpClient,
    private equipmentService: EquipmentServiceService,
    private maintenancetService: MaintenanceServiceService,
    public sessionData: SessionDataService,
    private route: ActivatedRoute,
    private loginService: AuthServiceService) { }

  ngOnInit(): void {
    let session = this.sessionData.position;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.serial_numberAux = this.route.snapshot.queryParams['serial_number'];
      this.get_equipment(this.serial_numberAux);
      this.eliminarMantenimiento = new Modal(document.getElementById('eliminarMantenimiento')!);//saco el modal para borrar
    }
  }

  async get_equipment(serial_number: string) {
    let httpOptions: any;

    if (serial_number == null || serial_number == undefined) {
      this.path = this.path + 'maintenances/'
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        })
      };
    } else {
      this.path = this.path + 'maintenance_list/equipment/'
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        }),
        params: {
          'serial_number': serial_number,
        }
      };
    }


    this.http.get(this.path, httpOptions).subscribe({
      next: (response: any) => {
        this.get_list_equiptment(response);
        //ver la forma de recorrer la respuesta para filtrar los mantenimientos por horas dias y fechas
      },
      error: (error: any) => {
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else if (error.status == '400') {
          alert(error.error.detail);
        } else if (error.status == '500') {
          alert('Error del servidor \nPor favor contacte al administrador')
        }
      }
    })
  }

  get_list_equiptment(data: any) {
    //veo si tengo que mostrar
    if (data.length != 0) {
      //si tiene data

      //necesito recorrer el arreglo para agregarlo en el espacio que corresponde
      for (var i = 0; i < data.length; i++) {
        var auxTime = data[i].time;
        if (auxTime == 'DIAS') {
          this.equipment_array_days.push(data[i]);
        } else if (auxTime == 'HORAS') {
          this.equipment_array_hours.push(data[i]);
        } else if (auxTime == 'FECHA') {
          this.equipment_array_months.push(data[i]);
        }
      }
    }

    //compruebo datos en cada arreglo

    if (this.equipment_array_days.length == 0) {
      this.whit_data_days = false;
      this.conData_days =
        `<h3 class="text-center py-3">
          No hay datos que mostrar en periodos registrados por dias
        </h3>
        `;
    } else {
      this.whit_data_days = true;
    }

    if (this.equipment_array_hours.length == 0) {
      this.whit_data_hours = false;
      this.conData_hours =
        `<h3 class="text-center py-3">
        No hay datos que mostrar en periodos registrados por horas
        </h3>
        `;
    } else {
      this.whit_data_hours = true;
    }

    if (this.equipment_array_months.length == 0) {
      this.whit_data_months = false;
      this.conData_months =
        `<h3 class="text-center py-3">
        No hay datos que mostrar en periodos registrados por fechas
        </h3>
        `;
    } else {
      this.whit_data_months = true;
    }
  }

  updateMaintenance(equipo: any) {
    console.log(equipo)
    window.location.href =
      '#/home/programa-mantenimiento/editar-mantenimiento?equipment_id=' + equipo.equipment_id +
      '&id=' + equipo.id +
      '&description_of_work=' + equipo.description_of_work +
      '&intervals=' + equipo.intervals +
      '&hours=' + equipo.hours +
      '&alertPropertie=' + equipo.alert +
      '&maintenance=' + equipo.maintenance +
      '&observations=' + equipo.observations +
      '&time=' + equipo.time +
      '&hours_days=' + equipo.hours_days +
      '&alert_maintenance=' + equipo.alert +
      '&initial_date=' + equipo.initial_date 
      ;
  }

  async deleteMaintenance() {
    try {
      const result = await this.maintenancetService.deleteMaintenance(this.equipment_id, this.id)
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

  onSelectChange() {
    const selectSearch = document.getElementById("selectSearch") as HTMLSelectElement;
    console.log(selectSearch.value);

    const statusMaintenance = selectSearch.value;

    this.equipment_array_hours = [];
    this.equipment_array_days = [];
    this.equipment_array_months = [];

    //llamo a la función que me lleva al servicio
    this.get_list_equipment_status(statusMaintenance);
  }

  async get_list_equipment_status(maintenance_status: string) {
    try {
      const response = await this.equipmentService.get_list_maintenance_status(maintenance_status);
      // Hacer algo con la respuesta
      this.get_list_equiptment(response);
    } catch (error) {
      // Manejar el error
      alert('ocurrio un error al cargar los datos')
    }
  }


}
