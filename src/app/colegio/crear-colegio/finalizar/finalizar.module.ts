import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinalizarRoutingModule } from './finalizar-routing.module';
import { FinalizarComponent } from './finalizar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FinalizarComponent
  ],
  imports: [
    CommonModule,
    FinalizarRoutingModule,
    FormsModule,
    ReactiveFormsModule   
  ]
})
export class FinalizarModule { }
