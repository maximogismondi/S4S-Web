import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  Aula,
  Colegio,
  Curso,
  Materia,
  Profesor,
  Turno,
  Modulo,
} from 'src/app/shared/interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ColegioService {
  nombreColegio: any;
  // nombreColegio: string;
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
  // usuariosExtensionesArray: string[] = [];
  aulaArray: Aula[] = [];
  cursoArray: Curso[] = [];
  materiaArray: Materia[] = [];
  selectedMateria: Materia;
  horariosFinal: Array<string> = [];
  nombreMateria: string;
  aulaMateria: string;
  cursoActual: string;
  dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  botonPresionado: boolean = false;
  horarioGenerado: boolean = false;
  cursoMateriaArray: Curso[];
  tiposAulas: Array<Aula[]> = new Array();
  pagoFinalizado: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    authSvc.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs.collection("schools")
          .doc(this.nombreColegio)
          .snapshotChanges()
          .subscribe((colegio) => {
            const school = colegio.payload.data() as Colegio;
            
            this.duracionModulo = school.duracionModulo;
            this.inicioHorario = school.inicioHorario;
            this.finalizacionHorario = school.finalizacionHorario;
            if (this.inicioModuloSeleccionado.length == 0) {
              this.inicioModuloSeleccionado.push('05:00', '12:00', '18:00');
              if (school.inicioHorario < '12:00') {
                this.inicioModuloSeleccionado[0] = school.inicioHorario;
              } else if (school.inicioHorario < '18:00') {
                this.inicioModuloSeleccionado[1] = school.inicioHorario;
              } else {
                this.inicioModuloSeleccionado[2] = school.inicioHorario;
              }
            }

            this.horaInicial = Number(String(this.inicioHorario).split(':')[0]);

            this.horaFinal = Number(
              String(this.finalizacionHorario).split(':')[0]
            );
            this.turnos =
              school.turnos[0].modulos.length +
              school.turnos[1].modulos.length +
              school.turnos[2].modulos.length;
            this.aulas = school.aulas.length;
            this.materias = school.materias.length;
            this.cursos = school.cursos.length;
            this.profesores = school.profesores.length;

            this.botonesCrearColegioProgreso =
              school.botonesCrearColegioProgreso;

            this.turnoArray = school.turnos;

            this.aulaArray = school.aulas;

            this.cursoArray = school.cursos;

            this.profesorArray = school.profesores;

            this.materiaArray = school.materias;

            // this.usuariosExtensionesArray = school.usuariosExtensiones;

            this.cursoArray.forEach((curso) => {
              curso.materias = [];
              this.materiaArray.forEach((materia) => {
                if (materia.curso == curso.nombre) {
                  curso.materias.push(materia.nombre);
                }
              });
            });
            this.cursoMateriaArray = this.cursoArray.filter(
              (curso) => curso.materias.length > 0
            );

            if (!this.selectedProfesor) {
              this.selectedProfesor = new Profesor(this.turnoArray);
            }
            if (!this.selectedMateria) {
              this.selectedMateria = new Materia(
                this.profesorArray,
                this.aulaArray
              );
            }
            if (this.cursoArray.length > 0) {
              this.cursoActual = this.cursoArray[0].nombre;
            }

            this.botonPresionado = false;
            this.horarioGenerado = false;

            this.tiposAulas = [];

            this.aulaArray.forEach((aula) => {
              let agregado: boolean = false;
              this.tiposAulas.forEach((tipoAulas) => {
                if (tipoAulas.length > 0 && aula.otro == tipoAulas[0].otro) {
                  agregado = true;
                  tipoAulas.push(aula);
                }
              });
              if (!agregado) {
                this.tiposAulas.push([aula]);
              }
            });
            // console.table(this.tiposAulas)
          });
      }
    });
  }

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
    this.afs.collection('schools').doc(this.nombreColegio).update({
      materias: materiaArrayDiccionario,
    });
  }

  async updateDBProfesor() {
    this.selectedProfesor = new Profesor(this.turnoArray);
    let ProfesorArrayDiccionario: Array<any> = [];
    this.profesorArray.forEach((profesor) => {
      ProfesorArrayDiccionario.push({
        nombre: profesor.nombre,
        apellido: profesor.apellido,
        dni: profesor.dni,
        disponibilidad: profesor.disponibilidad,
        // id: profesor.id,
        // 'materias capacitado': profesor.materiasCapacitado,
        //  turnoPreferido: profesor.turnoPreferido,
        // condiciones: profesor.condiciones,
      });
    });
    this.afs.collection('schools').doc(this.nombreColegio).update({
      profesores: ProfesorArrayDiccionario,
    });
  }

  chequearRepeticionEnSubidaDatos(selected: any, arreglo: Array<any>): boolean {
    let existeDato: boolean = false;
    if ('apellido' in selected) {
      arreglo.forEach((dato) => {
        if (
          selected.nombre + selected.apellido == dato.nombre + dato.apellido &&
          selected != dato
        ) {
          existeDato = true;
          alert(
            'El nombre ya esta utilizado, edite el elemento creado o cree uno con distinto nombre y/o apellido.'
          );
        }
      });
    } else if ('curso' in selected) {
      arreglo.forEach((dato) => {
        if (
          selected.nombre + selected.curso == dato.nombre + dato.curso &&
          selected != dato
        ) {
          existeDato = true;
          alert(
            'El nombre ya esta utilizado en este curso, edite el elemento creado o cree uno con distinto nombre.'
          );
        }
      });
    } else {
      arreglo.forEach((dato) => {
        if (selected.nombre == dato.nombre && selected != dato) {
          existeDato = true;
          alert(
            'El nombre ya esta utilizado, edite el elemento creado o cree uno con distinto nombre.'
          );
        }
      });
    }
    return existeDato;
  }
}
