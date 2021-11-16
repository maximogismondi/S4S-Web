import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceSpinnerService {
  mostrarSpinnerUser: boolean = false;
  mostrarSpinnerColegio: boolean = false;

  constructor() {}
}
