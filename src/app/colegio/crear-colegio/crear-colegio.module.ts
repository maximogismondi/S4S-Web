import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearColegioRoutingModule } from './crear-colegio-routing.module';
import { CrearColegioComponent } from './crear-colegio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnosComponent } from './turnos/turnos.component';
import { AulasComponent } from './aulas/aulas.component';
import { CursosComponent } from './cursos/cursos.component';
import { ProfesoresComponent } from './profesores/profesores.component';
import { MateriasComponent } from './materias/materias.component';
import { FinalizarComponent } from './finalizar/finalizar.component';
import { DinosaurioComponent } from 'src/app/dinosaurio/dinosaurio.component';


@NgModule({
  declarations: [
    CrearColegioComponent,
    TurnosComponent,
    AulasComponent,
    CursosComponent,
    ProfesoresComponent,
    MateriasComponent,
    FinalizarComponent,
    DinosaurioComponent
  ],
  imports: [
    CommonModule,
    CrearColegioRoutingModule,
    FormsModule,
    ReactiveFormsModule    
  ]
})
export class CrearColegioModule { }
