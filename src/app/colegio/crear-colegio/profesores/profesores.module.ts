import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfesoresRoutingModule } from './profesores-routing.module';
import { ProfesoresComponent } from './profesores.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfesoresComponent
  ],
  imports: [
    CommonModule,
    ProfesoresRoutingModule,
    FormsModule,
    ReactiveFormsModule   
  ]
})
export class ProfesoresModule { }
