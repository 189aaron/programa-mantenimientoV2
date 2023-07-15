import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SparepartServiceService } from 'src/app/services/sparepart-service.service';

@Component({
  selector: 'app-registrar-refaccion',
  templateUrl: './registrar-refaccion.component.html'
})
export class RegistrarRefaccionComponent implements OnInit {
  conData: string = '';
  whit_data: boolean = false;
  sparepart_array: any[] = [];
  serial_number = '';
  equipment_id = '';

  constructor(
    private router: Router,
    private loginService: AuthServiceService,
    private sparepartService: SparepartServiceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let session = this.loginService.getIdToken;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.serial_number = this.route.snapshot.queryParams['serial_number'];
      this.equipment_id = this.route.snapshot.queryParams['equipment_id'];
    }
  }

  async add_sparepart(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      const serial_number = this.serial_number;
      const amount = form['amount'].value;
      const description = form['description'].value;
      const position = form['position'].value;
      const num_part = form['num_part'].value;
      let num_ref = form['num_ref'].value;
      if (num_ref == '') {
        num_ref = 0;
      }
      const sheet_diagram = form['sheet_diagram'].value;
      let item = form['item'].value;
      if (item == '') {
        item = 0;
      }
      const plano = form['plano'].value;
      const model = form['model'].value;
      const observations = form['observations'].value;

      const equipment_id = this.equipment_id;
      this.sparepartService.add_sparepart(serial_number, equipment_id, amount, description, position, num_part, num_ref, sheet_diagram, item, plano, model, observations);

    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');
  }

}
