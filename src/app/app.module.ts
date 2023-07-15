import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './home/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrarUsuarioComponent } from './home/usuarios/registrar-usuario/registrar-usuario.component';
import { ConsultarUsuarioComponent } from './home/usuarios/consultar-usuario/consultar-usuario.component';
import { EditarUsuarioComponent } from './home/usuarios/editar-usuario/editar-usuario.component';
import { RestablecerContraseniaComponent } from './home/usuarios/restablecer-contrasenia/restablecer-contrasenia.component';
import { RestablecerTokenComponent } from './home/usuarios/restablecer-token/restablecer-token.component';
import { RegistrarEquipoComponent } from './home/equipos/registrar-equipo/registrar-equipo.component';
import { EditarEquipoComponent } from './home/equipos/editar-equipo/editar-equipo.component';
import { ConsultarEquipoComponent } from './home/equipos/consultar-equipo/consultar-equipo.component';
import { RegistrarRefaccionComponent } from './home/refacciones/registrar-refaccion/registrar-refaccion.component';
import { EditarRefaccionComponent } from './home/refacciones/editar-refaccion/editar-refaccion.component';
import { ConsutarRefaccionComponent } from './home/refacciones/consutar-refaccion/consutar-refaccion.component';
import { ControlHorasComponent } from './home/control-horas/control-horas.component';
import { RegistrarMantenimientoComponent } from './home/programa-mantenimiento/registrar-mantenimiento/registrar-mantenimiento.component';
import { ConsultarMantenimientoComponent } from './home/programa-mantenimiento/consultar-mantenimiento/consultar-mantenimiento.component';
import { EditarMantenimientoComponent } from './home/programa-mantenimiento/editar-mantenimiento/editar-mantenimiento.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    RegistrarUsuarioComponent,
    ConsultarUsuarioComponent,
    EditarUsuarioComponent,
    RestablecerContraseniaComponent,
    RestablecerTokenComponent,
    RegistrarEquipoComponent,
    EditarEquipoComponent,
    ConsultarEquipoComponent,
    RegistrarRefaccionComponent,
    EditarRefaccionComponent,
    ConsutarRefaccionComponent,
    ControlHorasComponent,
    RegistrarMantenimientoComponent,
    ConsultarMantenimientoComponent,
    EditarMantenimientoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
