import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EleccionRoutingModule } from './eleccion-routing.module';
import { EleccionComponent } from './eleccion.component';


@NgModule({
  declarations: [
    EleccionComponent
  ],
  imports: [
    CommonModule,
    EleccionRoutingModule
  ]
})
export class EleccionModule { }
