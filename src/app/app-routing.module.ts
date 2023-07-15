import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './home/menu/menu.component';
import { RegistrarUsuarioComponent } from './home/usuarios/registrar-usuario/registrar-usuario.component';
import { ConsultarUsuarioComponent } from './home/usuarios/consultar-usuario/consultar-usuario.component';
import { EditarUsuarioComponent } from './home/usuarios/editar-usuario/editar-usuario.component';
import { RestablecerContraseniaComponent } from './home/usuarios/restablecer-contrasenia/restablecer-contrasenia.component';
import { RestablecerTokenComponent } from './home/usuarios/restablecer-token/restablecer-token.component';
import { RegistrarEquipoComponent } from './home/equipos/registrar-equipo/registrar-equipo.component';
import { ConsultarEquipoComponent } from './home/equipos/consultar-equipo/consultar-equipo.component';
import { EditarEquipoComponent } from './home/equipos/editar-equipo/editar-equipo.component';
import { RegistrarRefaccionComponent } from './home/refacciones/registrar-refaccion/registrar-refaccion.component';
import { ConsutarRefaccionComponent } from './home/refacciones/consutar-refaccion/consutar-refaccion.component';
import { EditarRefaccionComponent } from './home/refacciones/editar-refaccion/editar-refaccion.component';
import { ControlHorasComponent } from './home/control-horas/control-horas.component';
import { RegistrarMantenimientoComponent } from './home/programa-mantenimiento/registrar-mantenimiento/registrar-mantenimiento.component';
import { EditarMantenimientoComponent } from './home/programa-mantenimiento/editar-mantenimiento/editar-mantenimiento.component';
import { ConsultarMantenimientoComponent } from './home/programa-mantenimiento/consultar-mantenimiento/consultar-mantenimiento.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, children: [{
      path: '', children: [
        { path: '', redirectTo: 'menu', pathMatch: 'full' },
        { path: 'menu', component: MenuComponent },
        { path: 'usuarios/registrar', component: RegistrarUsuarioComponent },
        { path: 'usuarios/consultar', component: ConsultarUsuarioComponent },
        { path: 'usuarios/editar-usuario', component: EditarUsuarioComponent },
        { path: 'usuarios/restablecer_contrasenia', component: RestablecerContraseniaComponent },
        { path: 'usuarios/renviar_token', component: RestablecerTokenComponent },
        { path: 'equipos/registrar', component: RegistrarEquipoComponent },
        { path: 'equipos/consultar', component: ConsultarEquipoComponent },
        { path: 'equipos/editar-equipo', component: EditarEquipoComponent },
        { path: 'refacciones/registrar', component: RegistrarRefaccionComponent },
        { path: 'refacciones/consultar', component: ConsutarRefaccionComponent },
        { path: 'refacciones/editar-refaccion', component: EditarRefaccionComponent },
        { path: 'programa-mantenimiento/consulta', component: ConsultarMantenimientoComponent},
        { path: 'programa-mantenimiento/registrar', component: RegistrarMantenimientoComponent},
        { path: 'programa-mantenimiento/editar-mantenimiento', component: EditarMantenimientoComponent},
        { path: 'control_horas', component: ControlHorasComponent}
      ]
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
