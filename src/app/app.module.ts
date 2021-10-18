import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SendEmailComponent } from './auth/send-email/send-email.component';
// import { AuthGuard } from './shared/guards/auth.guard';
import { AuthService } from './auth/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { TurnosComponent } from './colegio/crear-colegio/turnos/turnos.component';
import { AulasComponent } from './colegio/crear-colegio/aulas/aulas.component';
import { CursosComponent } from './colegio/crear-colegio/cursos/cursos.component';
import { ProfesoresComponent } from './colegio/crear-colegio/profesores/profesores.component';
import { MateriasComponent } from './colegio/crear-colegio/materias/materias.component';
import { FinalizarComponent } from './colegio/crear-colegio/finalizar/finalizar.component';
import { CrearColegioModule } from './colegio/crear-colegio/crear-colegio.module';
import {ExcelService} from './colegio/crear-colegio/finalizar/services/excel.service'
// import { ProcesarPagoComponent } from './mercado-pago/procesar-pago/procesar-pago.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, SendEmailComponent, ],
  // ProcesarPagoComponent
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule
  ],
  providers: [AuthService,ExcelService],

  bootstrap: [AppComponent],
})
export class AppModule {}
