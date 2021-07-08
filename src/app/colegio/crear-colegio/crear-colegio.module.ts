import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearColegioRoutingModule } from './crear-colegio-routing.module';
import { CrearColegioComponent } from './crear-colegio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CrearColegioComponent
  ],
  imports: [
    CommonModule,
    CrearColegioRoutingModule,
    FormsModule,
    ReactiveFormsModule    
  ]
})
export class CrearColegioModule { }
