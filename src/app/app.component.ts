import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { ColegioService } from './colegio/services/colegio.service';
import { ServiceSpinnerService } from './shared/loading-spinner/service-spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'proyectoS4S';

  constructor(
    public spinnerSvc: ServiceSpinnerService,
    public colegioSvc: ColegioService
  ) {
    // setInterval(() => {
    //   console.log(this.spinnerSvc.mostrarSpinnerColegio);
    //   console.log(this.spinnerSvc.mostrarSpinnerUser);
    // }, 1000);
  }
}
