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
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss'],
})
export class MateriasComponent implements OnInit {
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
  // _______________________________________MATERIAS____________________________________________________________

  async updateDBMateria() {
    this.selectedMateria = new Materia(this.profesorArray, this.aulaArray);
    let materiaArrayDiccionario: Array<any> = [];
    this.materiaArray.forEach((materia) => {
      materiaArrayDiccionario.push({
        nombre: materia.nombre,
        cantidadDeModulosTotal: materia.cantidadDeModulosTotal,
        curso: materia.curso,
        profesoresCapacitados: materia.profesoresCapacitados,
        aulasMateria: materia.aulasMateria,
        cantidadMaximaDeModulosPorDia: materia.cantidadMaximaDeModulosPorDia,
        // id: materia.id,
        // cantProfesores: materia.cantProfesores,
        // espacioEntreDias: materia.espacioEntreDias,
        // tipoAula: materia.tipo,
        // otro: materia.otro,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      materias: materiaArrayDiccionario,
    });
  }

  openForEditMateria(materia: Materia) {
    this.selectedMateria = materia;
  }

  addOrEditMateria() {
    if (
      this.selectedMateria.nombre != '' &&
      this.selectedMateria.cantidadDeModulosTotal != '' &&
      this.selectedMateria.curso != '' &&
      this.selectedMateria.cantidadMaximaDeModulosPorDia != '' &&
      this.selectedMateria.nombre.length <= 30
    ) {
      if (this.selectedMateria.id == 0) {
        if (
          !this.colegioSvc.chequearRepeticionEnSubidaDatos(
            this.selectedMateria,
            this.materiaArray
          )
        ) {
          let existeProfesorCapacitado: boolean = false;

          this.profesorArray.forEach((profesor) => {
            if (
              this.selectedMateria.profesoresCapacitados[
                profesor.nombre + ' ' + profesor.apellido
              ]
            ) {
              existeProfesorCapacitado = true;
            }
          });

          if (existeProfesorCapacitado) {
            let existeAula: boolean = false;

            this.aulaArray.forEach((aula) => {
              if (this.selectedMateria.aulasMateria[aula.nombre]) {
                existeAula = true;
              }
            });

            if (existeAula) {
              this.selectedMateria.id = this.materiaArray.length + 1;
              this.materiaArray.push(this.selectedMateria);
            } else {
              alert('Coloque por lo menos un aula para la materia creada');
            }
          } else {
            alert('Coloque por lo menos un profesor para la materia creada');
          }

          // this.profesoresArrayMaterias.forEach((profesor) => {
          //   if (profesor.valor == true) {
          //     this.selectedMateria.profesoresCapacitados.push(profesor.nombre);
          //   }
          // });
        }
      }

      this.updateDBMateria();
    } else {
      if (this.selectedMateria.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  // clicked(nombreProfesor: string) {
  //   for (let i = 0; i < this.profesoresArrayMaterias.length; i++) {
  //     if (
  //       this.profesoresArrayMaterias[i].nombre == nombreProfesor &&
  //       this.profesoresArrayMaterias[i].valor == false
  //     ) {
  //       this.profesoresArrayMaterias[i].valor = true;
  //     } else if (
  //       this.profesoresArrayMaterias[i].nombre == nombreProfesor &&
  //       this.profesoresArrayMaterias[i].valor == true
  //     ) {
  //       this.profesoresArrayMaterias[i].valor = false;
  //     }
  //   }
  // }

  clickFormCheckMateriaProfesor(nombre: string) {
    this.selectedMateria.profesoresCapacitados[nombre] =
      !this.selectedMateria.profesoresCapacitados[nombre];
  }

  clickFormCheckMateriaAula(nombre: string) {
    this.selectedMateria.aulasMateria[nombre] =
      !this.selectedMateria.aulasMateria[nombre];
  }

  deleteMateria() {
    if (confirm('¿Estas seguro/a que quieres eliminar esta materia?')) {
      this.materiaArray = this.materiaArray.filter(
        (x) => x != this.selectedMateria
      );
      this.updateDBMateria();
    }
  }

  async goFormFinalizar() {
    this.botonesCrearColegio = 6;
    if (this.botonesCrearColegioProgreso < 6) {
      this.botonesCrearColegioProgreso = 6;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 6,
        botonesCrearColegio: 6,
      });
    }
  }
}
