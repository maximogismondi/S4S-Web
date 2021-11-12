import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorariosGeneradosRoutingModule } from './horarios-generados-routing.module';
import { HorariosGeneradosComponent } from './horarios-generados.component';


@NgModule({
  declarations: [
    HorariosGeneradosComponent
  ],
  imports: [
    CommonModule,
    HorariosGeneradosRoutingModule
  ]
})
export class HorariosGeneradosModule { }
