import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorariosGeneradosRoutingModule } from './horarios-generados-routing.module';
import { HorariosGeneradosComponent } from './horarios-generados.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HorariosGeneradosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HorariosGeneradosRoutingModule,
  ],
})
export class HorariosGeneradosModule {}
