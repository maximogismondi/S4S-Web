import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EleccionRoutingModule } from './eleccion-routing.module';
import { EleccionComponent } from './eleccion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EleccionComponent
  ],
  imports: [
    CommonModule,
    EleccionRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EleccionModule { }
