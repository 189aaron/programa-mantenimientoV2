import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SessionDataService } from '../../session-data.service';
import { MaintenanceServiceService } from 'src/app/services/maintenance-service.service';

@Component({
  selector: 'app-editar-mantenimiento',
  templateUrl: './editar-mantenimiento.component.html'
})
export class EditarMantenimientoComponent {

  time: string = '';
  hours_days: string = '';
  alert_maintenance: string = '';
  initial_date: Date = new Date('1900-01-01');
  equipment_id: string = '';
  id: string = '';
  description_of_work: string = '';
  intervals: string = '';
  hours: string = '';
  alertPropertie: string = '';
  maintenance: string = '';
  observations: string = '';

  horasForm: boolean = false;
  diasForm: boolean = false;
  fechaForm: boolean = false;

  ngOnInit(): void {
    this.equipment_id = this.route.snapshot.queryParams['equipment_id'];

    this.time = this.route.snapshot.queryParams['time'];
    this.hours_days = this.route.snapshot.queryParams['hours_days'];
    this.alert_maintenance = this.route.snapshot.queryParams['alert_maintenance'];
    this.initial_date = this.route.snapshot.queryParams['initial_date'];
    this.id = this.route.snapshot.queryParams['id'];
    this.description_of_work = this.route.snapshot.queryParams['description_of_work'];
    this.intervals = this.route.snapshot.queryParams['intervals'];
    this.hours = this.route.snapshot.queryParams['hours'];
    this.alertPropertie = this.route.snapshot.queryParams['alertPropertie']
    this.maintenance = this.route.snapshot.queryParams['maintenance'];
    this.observations = this.route.snapshot.queryParams['observations'];

    if (this.time == 'HORAS') {
      this.horasForm = true;
      this.diasForm = false;
      this.fechaForm = false;
    } else if (this.time == 'DIAS') {
      this.diasForm = true;
      this.horasForm = false;
      this.fechaForm = false;
    } else if (this.time == 'FECHA') {
      this.fechaForm = true;
      this.horasForm = false;
      this.diasForm = false;
    }
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private loginService: AuthServiceService,
    public sessionData: SessionDataService,
    private maintenanceService: MaintenanceServiceService,
    private route: ActivatedRoute) { }

  update_maintenance(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      const description_of_work = form['description_of_work'].value;
      const intervals = form['intervals'].value;
      let hours_days = '';
      if(this.time == 'HORAS' || this.time == 'DIAS'){
        hours_days = form['hours_days'].value;
      }
      const alert_days = form['alert_maintenance'].value;
      let initial_date;
      console.log(this.time)
      if(this.time == 'MESES' || this.time == 'FECHA'){
        initial_date = form['initial_date'].value;
      }
      const maintenance = form['maintenance'].value;
      const observations = form['observations'].value;

      this.maintenanceService.updateMaintenance(this.time, this.id, this.equipment_id, description_of_work, parseInt(intervals),  parseInt(hours_days) , parseInt(alert_days), initial_date, maintenance, observations );
    
    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');
  }
}
