import { Component } from '@angular/core';
import { SessionDataService } from '../../session-data.service';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EquipmentServiceService } from 'src/app/services/equipment-service.service';

@Component({
  selector: 'app-registrar-equipo',
  templateUrl: './registrar-equipo.component.html'
})
export class RegistrarEquipoComponent {
  constructor(
    public sessionData: SessionDataService,
    private equipmentService: EquipmentServiceService) { }

  add_equipment(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      let calibration_date = '';
      const group_no = form['group_no'].value;
      const name = form['nameEquipment'].value;
      const location = form['location'].value;
      const part_ship = form['part_ship'].value;
      const trademark = form['trademark'].value;
      const model = form['model'].value;
      const type = form['type'].value;
      const ship = form['ship'].value;
      const serial_number = form['serial_number'].value;
      const power = form['power'].value;
      const calibration_date_date = form['calibration_date_date'].value;
      const calibration_date_time = form['calibration_date_time'].value;
      const observations = form['observations'].value;
      const department_or_base = form['department_or_base'].value;
      if (calibration_date_date == '' || calibration_date_time == '') {
        calibration_date = '1900-01-01T00:00'; //para no enviar vacio al backend
      } else {
        calibration_date = calibration_date_date + 'T' + calibration_date_time;
      }
      
      this.equipmentService.add_equipment(group_no, name, location, part_ship, trademark, model, type, ship, serial_number, power, calibration_date, observations, department_or_base);

    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');


  }
}
