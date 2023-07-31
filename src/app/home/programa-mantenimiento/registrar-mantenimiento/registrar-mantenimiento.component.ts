import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MaintenanceServiceService } from 'src/app/services/maintenance-service.service';
import { SparepartServiceService } from 'src/app/services/sparepart-service.service';

@Component({
  selector: 'app-registrar-mantenimiento',
  templateUrl: './registrar-mantenimiento.component.html'
})
export class RegistrarMantenimientoComponent {

  serial_number: string = '';
  equipment_name: string = '';

  selectedOption: string = 'name';


  horasForm: boolean = false;
  diasForm: boolean = false;
  fechaForm: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private loginService: AuthServiceService,
    private maintenancetService: MaintenanceServiceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let session = this.loginService.getIdToken;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.serial_number = this.route.snapshot.queryParams['serial_number'];
      this.equipment_name = this.route.snapshot.queryParams['equipment_name'];
      console.log(this.serial_number)
    }
  }

  add_maintenance(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      const description_of_work = form['description_of_work'].value;
      const intervals = form['intervals'].value;//enteros
      const hours_days = form['hours_days'].value;//enteros
      const observations = form['observations'].value;
      const alert = form['alert'].value;

      this.maintenancetService.register_maintenance(this.serial_number, description_of_work, parseInt(intervals), parseInt(hours_days), observations, alert);
    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');
  }

  onSelectChange() {
    const timeLabel = document.getElementById("timeLabel") as HTMLSelectElement;

    if (timeLabel.value == 'HORAS') {
      this.horasForm = true;
      this.diasForm = false;
      this.fechaForm = false;
    } else if (timeLabel.value == 'DIAS') {
      this.diasForm = true;
      this.horasForm = false;
      this.fechaForm = false;
    } else if (timeLabel.value == 'FECHA') {
      this.fechaForm = true;
      this.horasForm = false;
      this.diasForm = false;
    }
  }

}
