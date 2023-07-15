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

  equipment_id: string = '';
  id: string = '';
  description_of_work: string = '';
  intervals: string = '';
  hours: string = '';
  alertPropertie: string = '';
  maintenance: string = '';
  observations: string = '';

  ngOnInit(): void {
    this.equipment_id = this.route.snapshot.queryParams['equipment_id'];
    this.id = this.route.snapshot.queryParams['id'];
    this.description_of_work = this.route.snapshot.queryParams['description_of_work'];
    this.intervals = this.route.snapshot.queryParams['intervals'];
    this.hours = this.route.snapshot.queryParams['hours'];
    this.alertPropertie = this.route.snapshot.queryParams['alertPropertie']
    this.maintenance = this.route.snapshot.queryParams['maintenance'];
    this.observations = this.route.snapshot.queryParams['observations'];

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
      const hours = form['hours'].value;
      const alertPropertie = form['alertPropertie'].value;
      const maintenance = form['maintenance'].value;
      const observations = form['observations'].value;

      this.maintenanceService.updateMaintenance(this.id, this.equipment_id, description_of_work, parseInt(intervals), parseInt(hours), observations, parseInt(alertPropertie), maintenance);

    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');
  }
}
