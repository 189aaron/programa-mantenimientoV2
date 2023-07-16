import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SparepartServiceService } from 'src/app/services/sparepart-service.service';
import { SessionDataService } from '../../session-data.service';

@Component({
  selector: 'app-consutar-refaccion',
  templateUrl: './consutar-refaccion.component.html',
  styles: [
  ]
})
export class ConsutarRefaccionComponent implements OnInit {

  path: string = this.loginService.path;
  conData: string = '';
  whit_data: boolean = false;
  sparepart_array: any[] = [];
  serial_numberAux = '';
  vistaPrincipal: boolean = false;
  errorDelete: string = '';

  id_sparepart: string = '';
  id_sparepart_equipmentId: string = '';

  constructor(
    private router: Router,
    private loginService: AuthServiceService,
    public sessionData: SessionDataService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    let session = this.sessionData.position;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.serial_numberAux = this.route.snapshot.queryParams['serial_number'];
      this.get_sparepart(this.serial_numberAux);
    }
  }

  async get_sparepart(serial_number: string) {
    let httpOptions: any;
    console.log(serial_number)
    if (serial_number == null || serial_number == undefined) {
      this.path = this.path + 'spare_parts/'
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        })
      };
    } else {
      this.path = this.path + 'spare_parts_list/'
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
        this.get_list_sparepart(response);
      },
      error: (error: any) => {
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else if (error.status == '400') {
          alert(error.error.detail);
        }
      }
    })
  }

  get_list_sparepart(data: any) {
    //veo si tengo que mostrar
    if (data.length != 0) {
      //si tiene data
      this.whit_data = true;
      this.sparepart_array = data;
    } else {
      //no trae data
      this.conData =
        `<h3 class="text-center pt-3">
          Aun no tenemos datos que mostrarte
        </h3>`;
      this.whit_data = false;
    }
  }

  updateSparePart(sparepart: any) {
    window.location.href =
      '#/home/refacciones/editar-refaccion?serial_number=' + sparepart.equipment_id.serial_number +
      '&amount=' + sparepart.amount +
      '&description=' + sparepart.description +
      '&position=' + sparepart.position +
      '&num_part=' + sparepart.num_part +
      '&num_ref=' + sparepart.num_ref +
      '&item=' + sparepart.item +
      '&sheet_diagram=' + sparepart.sheet_diagram +
      '&plano=' + sparepart.plano +
      '&model=' + sparepart.model +
      '&observations=' + sparepart.observations +
      '&id=' + sparepart.id;
  }

  async deleteSparePart() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      }),
      params: {
        'id': this.id_sparepart,
      },
      body: {
        "serial_number": this.id_sparepart_equipmentId
      }
    };

    this.http.delete(this.loginService.path + 'configure_spareparts/', httpOptions).subscribe({
      next: () => {
        //implementar exito
        alert('Refacción borrada con éxito');
        window.location.reload();
      },
      error: (error: any) => {
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else {
          alert(error.error.detail);
        }
      }
    })

  }

  pasarEquipo(sparepart: any) {
    //borro algun valor anterior
    this.id_sparepart = '';
    this, this.id_sparepart_equipmentId = '';
    //seteo nuevos valores
    this.id_sparepart = sparepart.id;
    this.id_sparepart_equipmentId = sparepart.equipment_id.serial_number;
  }
}
