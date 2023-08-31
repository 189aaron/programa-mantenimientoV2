import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EquipmentServiceService } from 'src/app/services/equipment-service.service';
import { SessionDataService } from '../../session-data.service';

@Component({
  selector: 'app-editar-equipo',
  templateUrl: './editar-equipo.component.html'
})
export class EditarEquipoComponent implements OnInit {

  serial_number: string = '';
  group_no: string = '';
  nameEquipment: string = '';
  location: string = '';
  equipment_responsible: string = '';
  ship: string = '';
  department_or_base: string = '';
  trademark: string = '';
  model: string = '';
  type: string = '';
  power: string = '';
  calibration_date: string = '';// el valor que leo/recibo
  calibration_date_send: string = '';// el valor que envio
  calibration_date_date: string = '';
  calibration_date_time: string = '';
  observations: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private loginService: AuthServiceService,
    public sessionData: SessionDataService,
    private equipmentService: EquipmentServiceService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Obtiene el valor del parámetro de consulta "serial_number"  
    this.serial_number = this.route.snapshot.queryParams['serial_number'];
    this.group_no = this.route.snapshot.queryParams['group_no'];
    this.nameEquipment = this.route.snapshot.queryParams['name'];
    this.location = this.route.snapshot.queryParams['location'];
    this.equipment_responsible = this.route.snapshot.queryParams['equipment_responsible'];
    this.ship = this.route.snapshot.queryParams['ship'];
    this.department_or_base = this.route.snapshot.queryParams['department_or_base'];
    this.trademark = this.route.snapshot.queryParams['trademark'];
    this.model = this.route.snapshot.queryParams['model'];
    this.type = this.route.snapshot.queryParams['type'];
    this.power = this.route.snapshot.queryParams['power'];
    this.calibration_date = this.route.snapshot.queryParams['calibration_date'];
    this.observations = this.route.snapshot.queryParams['observations'];

    //Extraigo los valores de fecha y hora para setear en los input
    let cadena = this.calibration_date;
    let partes = cadena.split(" ");

    this.calibration_date_date = partes[0];
    this.calibration_date_time = partes[1];


  }


  async updateEquipment(form: HTMLFormElement, event: Event) {
    console.log('updateEquipment')
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      let group_no = form['group_no'].value;
      let nameEquipment = form['nameEquipment'].value;
      let location = form['location'].value;
      let equipment_responsible = form['equipment_responsible'].value;
      let ship = form['ship'].value;
      let department_or_base = form['department_or_base'].value;
      let trademark = form['trademark'].value;
      let model = form['model'].value;
      let type = form['type'].value;
      let power = form['power'].value;
      let serial_number = form['serial_number'].value;
      let calibration_date_date = form['calibration_date_date'].value;
      let calibration_date_time = form['calibration_date_time'].value;
      let observations = form['observations'].value;
      let calibration_date_send = '';

      if (calibration_date_date == null || calibration_date_time == undefined || calibration_date_date == '' || calibration_date_time == '') {
        calibration_date_send = '1900-01-01T00:00'; //para no enviar vacio al backend
      } else {
        calibration_date_send = calibration_date_date + 'T' + calibration_date_time;
      }

      this.equipmentService.updateEquipment(serial_number, group_no, nameEquipment, location, equipment_responsible, ship, department_or_base, trademark, model, type, power, calibration_date_send, observations);
    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');

  }

}
