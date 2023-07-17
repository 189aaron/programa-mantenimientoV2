import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SessionDataService } from '../../session-data.service';
import { EquipmentServiceService } from 'src/app/services/equipment-service.service';

@Component({
  selector: 'app-consultar-equipo',
  templateUrl: './consultar-equipo.component.html'
})
export class ConsultarEquipoComponent {

  conData: string = '';
  whit_data: boolean = false;
  equipment_array: any[] = [];

  serial_number: string = '';//Para borrar el equipo
  equipmentDeleted: boolean = false;
  errorDelete: string = '';//Para borrar el equipo

  //para los modal de hora y mes
  modalEliminarEquipo: any;

  selectedOption: string = 'name';

  constructor(
    private router: Router,
    private http: HttpClient,
    private equipmentService: EquipmentServiceService,
    public sessionData: SessionDataService,
    private loginService: AuthServiceService) { }

  ngOnInit(): void {
    let session = this.sessionData.position;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.get_equipment();
      this.modalEliminarEquipo = new Modal(document.getElementById('eliminarEquipo')!);//saco el modal para borrar
    }
  }

  search_equipment(form: HTMLFormElement, event: Event) {
    if (form.checkValidity()) {
      // Si el formulario es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento

      this.equipment_array = [];//borrando la data para el nuevo arreglo

      const selectSearch = form['selectSearch'].value;
      const inputSearch = form['inputSearch'].value;

        if(selectSearch == 'disabled') {
        this.get_list_disabled();
      } else if (selectSearch == 'name') {
        this.get_list_name(inputSearch);
      } else if (selectSearch == 'number') {
        this.get_list_num_inv(inputSearch);
      } else if (selectSearch == 'model') {
        this.get_list_model(inputSearch);
      } else if (selectSearch == 'trademark') {
        this.get_list_trademark(inputSearch);
      }


    } else {
      // Si el formulario no es válido
      event.preventDefault(); // Evita la recarga de la página
      event.stopPropagation(); // Evita la propagación del evento
    }
    form.classList.add('was-validated');
  }

  onSelectChange() {
    const selectSearch = document.getElementById("selectSearch") as HTMLSelectElement;
    const inputSearch = document.getElementById("inputSearchLabel") as HTMLInputElement;

    inputSearch.value = "";//Borro el valor del input en cambio de seleccion
    if (selectSearch.value == "disabled") {
      inputSearch.disabled = true;
    } else {
      inputSearch.disabled = false;
    }
  }



  async get_equipment() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      })
    };

    this.http.get(this.loginService.path + 'equipment/', httpOptions).subscribe({
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
      this.conData = ``;
    } else {
      //no trae data
      this.conData =
        `<h3 class="text-center py-3">
          No tenemos datos que mostrarte
        </h3>
        `;
      this.whit_data = false;
    }
  }

  async get_list_disabled() {
    try {
      const response = await this.equipmentService.get_equipment_list_disabled();
      console.log('get_list_disabled local');
      console.log(response)
      // Hacer algo con la respuesta
      this.get_list_equiptment(response);
    } catch (error) {
      // Manejar el error
    }
  }

  async get_list_name(listName: string) {
    try {
      const response = await this.equipmentService.get_equipment_list_name(listName);
      console.log('get_list_name local');
      console.log(response)
      // Hacer algo con la respuesta
      this.get_list_equiptment(response);
    } catch (error) {
      // Manejar el error
    }
  }

  async get_list_num_inv(unam_number: string) {
    try {
      const response = await this.equipmentService.get_equipment_list_num_inv(unam_number);
      console.log('get_list_num_inv local');
      console.log(response)
      // Hacer algo con la respuesta
      this.get_list_equiptment(response);
    } catch (error) {
      // Manejar el error
    }
  }

  async get_list_model(model: string) {
    try {
      const response = await this.equipmentService.get_equipment_list_model(model);
      console.log('get_list_model local');
      console.log(response)
      // Hacer algo con la respuesta
      this.get_list_equiptment(response);
    } catch (error) {
      // Manejar el error
    }
  }

  async get_list_trademark(model: string) {
    try {
      const response = await this.equipmentService.get_equipment_list_trademark(model);
      console.log('get_list_trademark local');
      console.log(response)
      // Hacer algo con la respuesta
      this.get_list_equiptment(response);
    } catch (error) {
      // Manejar el error
    }
  }

  addSparePart(equipo: any) {
    window.location.href =
      '#/home/refacciones/registrar?serial_number=' + equipo.serial_number +
      '&equipment_id=' + equipo.id;
  }

  updateEquipment(equipo: any) {
    window.location.href =
      '#/home/equipos/editar-equipo?serial_number=' + equipo.serial_number +
      '&group_no=' + equipo.group_no +
      '&name=' + equipo.name +
      '&location=' + equipo.location +
      '&part_ship=' + equipo.part_ship +
      '&trademark=' + equipo.trademark +
      '&model=' + equipo.model +
      '&type=' + equipo.type +
      '&power=' + equipo.power +
      '&calibration_date=' + equipo.calibration_date +
      '&observations=' + equipo.observations +
      '&ship=' + equipo.ship +
      '&department_or_base=' + equipo.department_or_base;
  }

  getSparePart(equipo: any) {
    window.location.href =
      '#/home/refacciones/consultar?serial_number=' + equipo.serial_number;
  }

  async deleteEquipment() {
    try {
      const result = await this.equipmentService.delete_equipment(this.serial_number);
      //console.log(result); // true
    } catch (error) {
      //console.log(error); // false
    } finally {
      window.location.reload();
      //this.modalEliminarEquipo.hide();//Cierro modal

    }
  }

  pasarEquipo(equipo: any) {
    //borro algun valor anterior
    this.serial_number = '';
    //seteo nuevos valores
    this.serial_number = equipo.serial_number;
  }
}


