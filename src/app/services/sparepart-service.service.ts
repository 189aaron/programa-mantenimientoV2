import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class SparepartServiceService {

  constructor(
    private router: Router,
    private loginService: AuthServiceService,
    private http: HttpClient) { }

    add_sparepart(serial_number: string, equipment_id: string, amount: string, description: string, position: string, num_part: string, num_ref: string, sheet_diagram: string, item: string, plano: string,model: string,observations: string) {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
        }),
        params: {
          'serial_number': serial_number,
        }
      };
  
      const body = {
        'equipment_id': equipment_id,
        'amount': amount,
        'description': description,
        'position': position,
        'num_part': num_part,
        'num_ref': num_ref,
        'sheet_diagram': sheet_diagram,
        'item': item,
        'plano': plano,
        'model': model,
        'observations': observations
      };
  
      return this.http.post(this.loginService.path + 'spare_parts/', body, httpOptions).subscribe({
        next: (response: any) => {
          alert('Refacción registrada correctamente');
          this.router.navigate(['/home/equipos/consultar']);
        },
        error: (error: any) => {
          if (error.error.code == 'token_not_valid'){
            alert('Caducó la sesión, por favor ingresa de nuevo');
            this.loginService.logout();
          }else if (error.status == '401') {
            alert(error.error.detail);
          } else if (error.status == '400') {
            alert(JSON.stringify(error.error, null, 2));
          }
          
        }
      });
  
    }
}
