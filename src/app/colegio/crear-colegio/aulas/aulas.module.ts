import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AulasRoutingModule } from './aulas-routing.module';
import { AulasComponent } from './aulas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AulasComponent
  ],
  imports: [
    CommonModule,
    AulasRoutingModule,
    FormsModule,
    ReactiveFormsModule   
  ]
})
export class AulasModule { }
