import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { ServiceSpinnerService } from './shared/loading-spinner/service-spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'proyectoS4S';

  constructor(public spinnerSvc: ServiceSpinnerService) {}
}
