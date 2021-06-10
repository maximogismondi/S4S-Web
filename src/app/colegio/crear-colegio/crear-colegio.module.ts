import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearColegioRoutingModule } from './crear-colegio-routing.module';
import { CrearColegioComponent } from './crear-colegio.component';


@NgModule({
  declarations: [
    CrearColegioComponent
  ],
  imports: [
    CommonModule,
    CrearColegioRoutingModule
  ]
})
export class CrearColegioModule { }
