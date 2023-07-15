import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { HoursServiceService } from 'src/app/services/hours-service.service';
import { SessionDataService } from '../session-data.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-control-horas',
  templateUrl: './control-horas.component.html'
})
export class ControlHorasComponent {

  //Para los errores de las consultas vacias
  conData: string = '';
  conDataList: string = '';
  errorMes: string = '';//Para el modal del mes
  errorHoras: string = '';//Para el modal del mes
  existeMes: string = '';//para informar si hay registro de mes

  //para listar los equipos que se tienen registrados
  whit_data: boolean = false;
  whit_dataHours: boolean = false;
  equipment_array: any[] = [];

  //para listar los equipos del mes de consulta
  hours_array: any[] = [];


  intentoButton: number = 1;//para los intentos del boton
  equipmentName: string = '';//para mostrar nombre del equipo al que pertenece
  mesConsulta: string = '';//Para setear el mes de consulta
  anioConsulta: string = '';//Para setear el mes de consulta


  //Para el registro de mes
  equipment_id: string = '';//para setear en el post
  current: string = '';
  month: string = '';
  year: string = '';

  //para los modal de hora y mes
  modalHours: any;
  modalMoth: any;

  monthDate: any;
  updateEquipoHoras: any;
  borrarMes = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    public sessionData: SessionDataService,
    private loginService: AuthServiceService,
    private hoursService: HoursServiceService) { }

  ngOnInit(): void {
    let session = this.sessionData.position;
    if (session == null || session == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.get_equipment();//traigo los equipos

      //Seteo los modales para ocupar
      this.modalHours = new Modal(document.getElementById('modalHours')!);
      this.modalMoth = new Modal(document.getElementById('modalMonth')!);
    }
  }

  //consulta de equipos
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
    } else {
      //no trae data
      //console.log(this.userAdministrador)
      this.conData =
        `<h3 class="text-center py-3">
          Aun no tenemos datos que mostrarte
        </h3>
        `;
      this.whit_data = false;
    }
  }

  //para registrar horas a un determinado equipo
  async register_hour(form: NgForm) {
    this.errorHoras = ``;

    if (this.intentoButton == 1) {
      this.current = form.value.current;
      //console.log(typeof this.current)
      if (this.current == '' || this.current === null || this.current === undefined) {
        this.errorHoras = `<p class="text-danger">Debes ingresar un valor </p>`;
      } else if (this.current < '0') {
        this.errorHoras = `<p class="text-danger">El valor no puede ser negativo</p>`;
      } else if (this.current == '0') {
        this.errorHoras = `<p class="text-danger">El valor no puede ser cero</p>`;
      } else if (this.current > '0') {
        this.errorHoras = ``;

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
          }),
          params: {
            'equipment_id': this.updateEquipoHoras.equipment_id,
            'id': this.updateEquipoHoras.id
          }
        };

        const body = {
          "current": this.current
        }

        this.http.put(this.loginService.path + 'hours_counter/', body, httpOptions).subscribe({
          next: (response: any) => {
            //console.log('Se agrego la hora correctamente')
            this.errorHoras = `<p class="text-success">Se agrego la hora correctamente <br>Para ver la actualización da "clic" en el botón "Buscar"</p>`;
          },
          error: (error: any) => {
            console.log(error)
            //if (error.status == '400')
          }
        })

      }

    } else {
      alert('Solo puede agregar el valor 1 vez por intento');
    }
  }

  //para registrar horas a un determinado mes de equipo
  async register_month(form: NgForm) {
    if (this.intentoButton == 1) {

      this.monthDate = form.value.month;
      if (this.monthDate == '') {
        this.errorMes = `<p class="text-danger">Debes ingresar una fecha para el registro</p>`;
      } else {
        //proceso porque si viene fecha
        this.month = this.obtenerMes(this.monthDate);
        let yearAux = this.monthDate.split("-");

        this.year = yearAux[0];

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('id_token'),
          }),
          params: {
            'equipment_id': this.equipment_id,
          }
        };

        const body = {
          "current": 0,
          "month": this.month,
          "year": this.year
        };

        this.http.post(this.loginService.path + 'hours_counter/', body, httpOptions).subscribe({
          next: () => {
            //El mes no se habia registrado
            //this.modalHours.show();
            //this.modalMoth.hide();
            this.errorMes = `<p class="text-success text-end">Mes registrado con exito</p>`;
          },
          error: (error: any) => {
            if (error.status == '400') {
              if (error.error.non_field_errors == 'Ya existen horas registradas a este equipo con este mes') {
                //this.modalHours.show();
                //this.modalMoth.hide();
                //this.existeMes = `<p class="text-danger">Ya existe el registro de este mes</p>`;
                this.errorMes = `<p class="text-warning text-end">Ya existen horas registradas a este equipo con este mes</p>`;
              }
              //this.router.navigate(['/login']);
            }
          }
        })
      }

    } else {
      alert('Solo puede agregar el valor 1 vez por intento');
    }


  }

  deleteMonth() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
      }),
      params: {
        'equipment_id': this.updateEquipoHoras.equipment_id,
        'id': this.updateEquipoHoras.id
      }
    };

    this.http.delete(this.loginService.path + 'hours_counter/', httpOptions).subscribe({
      next: () => {
        
        this.borrarMes = `<p class="text-success text-center">Mes borrado con éxito <br>Para ver la actualización da "clic" en el botón "Buscar"</p>`
      },
      error: () => {
        console.log('error a la hora de borrar');

      }
    })
  }

  //setear valores al modal
  pasarDatos(equipo: any) {
    //console.log(equipo)
    this.intentoButton = 1; // seteo el valor en 1 para el nuevo intento del boton
    this.equipmentName = '';
    this.equipment_id = '';
    this.errorHoras = '';
    this.errorMes = '';
    this.existeMes = '';

    this.equipmentName = equipo.name;
    this.equipment_id = equipo.id;
  }

  //setear valores al modal
  pasarDatosHoras(equipo: any) {
    this.updateEquipoHoras = '';//quito cualquier valor
    this.updateEquipoHoras = equipo; //seteo nuevo valor
    console.log(this.updateEquipoHoras)
    this.intentoButton = 1; // seteo el valor en 1 para el nuevo intento del boton
    this.equipmentName = '';
    this.equipment_id = '';
    this.errorHoras = '';
    this.errorMes = '';
    this.existeMes = '';
    this.borrarMes = '';

    this.equipmentName = equipo.equipment;
    this.equipment_id = equipo.id;
  }

  //Para detonar la consulta por mes
  list_hour(form: NgForm) {
    this.monthDate = form.value.month;

    if (this.monthDate == '') {
      //No colocaron mes y año
      alert('Introduce un Mes y Año');
    } else {
      //Si traigo datos
      this.mesConsulta = this.obtenerMes(this.monthDate);
      let yearAux = this.monthDate.split("-");

      this.anioConsulta = yearAux[0];

      this.getHours(this.mesConsulta, this.anioConsulta);
    }
  }

  //para consultar equipos con horas de determinado mes
  getHours(month: string, year: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('id_token'),
      }),
      params: {
        'month': month,
        'year': year
      }
    };

    return this.http.get(this.loginService.path + 'hours_counter/', httpOptions).subscribe({
      next: (response: any) => {
        this.conDataList = '';
        this.get_list_hours(response);
        //this.router.navigate(['/login']);
      },
      error: (error: any) => {
        //console.error(error.error);
        if (error.error.code == 'token_not_valid') {
          alert('Caducó la sesión, por favor ingresa de nuevo');
          this.loginService.logout();
        } else if (error.status == '400') {
          alert(error.error);
        } else if (error.status == '403') {
          alert(error.error.detail);
          //this.router.navigate(['/login']);
        } else if (error.status == '404') {
          alert(error.error);
        } else {
          alert(error.error);
          this.router.navigate(['/login']);
        }
      }
    });

  }

  get_list_hours(data: any) {
    //veo si tengo que mostrar
    if (data.length != 0) {
      //si tiene data
      this.whit_dataHours = true;
      this.hours_array = data;
    } else {
      //no trae data
      this.conDataList =
        `<h3 class="text-center pt-3">
          No hay equipos con horas registradas en este mes
        </h3>`;
      this.whit_dataHours = false;
      this.hours_array = [];
    }
  }

  obtenerMes(fechaString: string) {
    const fechaArray = fechaString.split("-");
    const mesNumero = parseInt(fechaArray[1]);

    let mesString = '';

    if (mesNumero == 1) {
      mesString = 'ENERO'
    } else if (mesNumero == 2) {
      mesString = 'FEBRERO'
    } else if (mesNumero == 3) {
      mesString = 'MARZO'
    } else if (mesNumero == 4) {
      mesString = 'ABRIL'
    } else if (mesNumero == 5) {
      mesString = 'MAYO'
    } else if (mesNumero == 6) {
      mesString = 'JUNIO'
    } else if (mesNumero == 7) {
      mesString = 'JULIO'
    } else if (mesNumero == 8) {
      mesString = 'AGOSTO'
    } else if (mesNumero == 9) {
      mesString = 'SEPTIEMBRE'
    } else if (mesNumero == 10) {
      mesString = 'OCTUBRE'
    } else if (mesNumero == 11) {
      mesString = 'NOVIEMBRE'
    } else if (mesNumero == 12) {
      mesString = 'DICIEMBRE'
    }

    return mesString;
  }

  closeModalHours() {
    this.modalHours.hide();
    this.modalMoth.hide();
  }

  reistrarMantenimiento(equipo: any) {
    window.location.href =
      '#/home/programa-mantenimiento/registrar?serial_number=' + equipo.serial_number +
      '&equipment_name=' + equipo.name;
  }
}