import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  Aula,
  Colegio,
  Curso,
  Materia,
  Modulo,
  Profesor,
  Turno,
} from 'src/app/shared/interface/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { ColegioService } from '../../services/colegio.service';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.scss'],
})
export class AulasComponent implements OnInit {
  nombreColegio: string;
  nombreDocumento: string;
  duracionModulo: number;
  inicioHorario: string;
  finalizacionHorario: string;
  turnos: number;
  aulas: number;
  materias: number;
  cursos: number;
  profesores: number;
  turnoSeleccionado: string;
  horaInicial: number;
  horaFinal: number;
  botonesCrearColegio: number = 1;
  botonesCrearColegioProgreso: number;
  disponibilidadProfesor: boolean = false;
  disponibilidadProfesorSemana: Array<Array<Array<boolean>>> = [];
  turnoArray: Array<Turno> = [
    new Turno('manana'),
    new Turno('tarde'),
    new Turno('noche'),
  ];
  inicioModuloSeleccionado: Array<string> = [];
  profesorArray: Profesor[] = [];
  selectedProfesor: Profesor;
  aulaArray: Aula[] = [];
  selectedAula: Aula = new Aula();
  cursoArray: Curso[] = [];
  selectedCurso: Curso = new Curso();
  materiaArray: Materia[] = [];
  selectedMateria: Materia;

  constructor(
    public afAuth: AngularFireAuth,
    private colegioSvc: ColegioService,
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // _________________________________________AULAS____________________________________________________________

  async updateDBAula() {
    this.selectedAula = new Aula();
    let aulaArrayDiccionario: Array<any> = [];
    this.aulaArray.forEach((aula) => {
      aulaArrayDiccionario.push({
        // id: aula.id,
        nombre: aula.nombre,
        tipo: aula.tipo,
        otro: aula.otro,
      });
    });

    this.afs.collection('schools').doc(this.nombreDocumento).update({
      aulas: aulaArrayDiccionario,
    });
  }

  openForEditAula(aula: Aula) {
    this.selectedAula = aula;
  }

  addOrEditAula() {
    if (
      this.selectedAula.nombre != '' &&
      this.selectedAula.nombre.length <= 30 &&
      this.selectedAula.tipo != ''
    ) {
      if (this.selectedAula.id == 0) {
        if (
          !this.colegioSvc.chequearRepeticionEnSubidaDatos(
            this.selectedAula,
            this.aulaArray
          )
        ) {
          this.selectedAula.id = this.aulaArray.length + 1;
          this.aulaArray.push(this.selectedAula);
        }
      }
      if (this.selectedAula.tipo == 'normal') {
        this.selectedAula.otro = 'normal';
      }
      this.updateDBAula();
    } else {
      if (this.selectedAula.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  deleteAula() {
    if (confirm('¿Estas seguro/a que quieres eliminar este aula?')) {
      this.aulaArray = this.aulaArray.filter((x) => x != this.selectedAula);
      this.updateDBAula();
    }
  }

  async goFormCurso() {
    this.botonesCrearColegio = 3;
    if (this.botonesCrearColegioProgreso < 3) {
      this.botonesCrearColegioProgreso = 3;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 3,
        botonesCrearColegio: 3,
      });
    }
  }
}
