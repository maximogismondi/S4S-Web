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
import { ServiceSpinnerService } from 'src/app/shared/loading-spinner/service-spinner.service';

@Injectable({
  providedIn: 'root',
})
export class ColegioService {
  nombreColegio: string;
  color: string;
  duracionModulo: number;
  inicioModuloSeleccionado: Array<string> = [];
  seccion: string = 'turnos';
  disponibilidadProfesor: boolean = false;
  disponibilidadProfesorSemana: Array<Array<Array<boolean>>> = [];
  turnoArray: Array<Turno> = [
    new Turno('manana'),
    new Turno('tarde'),
    new Turno('noche'),
  ];
  profesorArray: Profesor[] = [];
  selectedProfesor: Profesor;
  aulaArray: Aula[] = [];
  cursoArray: Curso[] = [];
  materiaArray: Materia[] = [];
  selectedMateria: Materia;
  horariosFinal: Array<string> = [];
  nombreMateria: string;
  aulaMateria: string;
  dias: Array<string> = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  cursoMateriaArray: Curso[];
  tiposAulas: Array<Aula[]> = new Array();
  pagoFinalizado: boolean = false;
  materiasArrayInValidas: any = {};
  school: Colegio;
  // irAHome: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private spinnerSvc: ServiceSpinnerService
  ) {
    this.spinnerSvc.mostrarSpinnerColegio = true;
    this.spinnerSvc.mostrarSpinnerUser = true;


    authSvc.afAuth.authState.subscribe(async (user) => {
      if (user) {
        let escuelasPerteneceUsuario: Array<string> = [];

        await this.afs.firestore
          .collection('schools')
          .where('userAdmin', '==', user.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              escuelasPerteneceUsuario.push(doc.data().nombre);
            });
          });
        await this.afs.firestore
          .collection('schools')
          .where('usuariosExtensiones', 'array-contains', user.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              escuelasPerteneceUsuario.push(doc.data().nombre);
            });
          });
        // if (this.irAHome) {
        //   this.router.navigate(['/home']);
        // } else && !this.irAHome
        if (!escuelasPerteneceUsuario.includes(this.nombreColegio)) {
          // error solucionar problema de redireccionamiento
          // alert("Usted no esta unido a este colegio, por favor unase para acceder")
          // this.router.navigate(['/menu-principal']);
        } else {
          this.afs
            .collection('schools')
            .doc(this.nombreColegio)
            .snapshotChanges()
            .subscribe((colegio) => {
              this.school = colegio.payload.data() as Colegio;

              this.duracionModulo = this.school.duracionModulo;

              this.color = this.school.color;

              this.turnoArray[0] = Object.assign(
                new Turno('manana'),
                this.school.turnos[0]
              ) as Turno;
              this.turnoArray[1] = Object.assign(
                new Turno('tarde'),
                this.school.turnos[1]
              ) as Turno;
              this.turnoArray[2] = Object.assign(
                new Turno('noche'),
                this.school.turnos[2]
              ) as Turno;

              if (this.inicioModuloSeleccionado.length == 0) {
                this.inicioModuloSeleccionado.push(
                  this.school.turnos[0].inicio,
                  this.school.turnos[1].inicio,
                  this.school.turnos[2].inicio
                );
              }
              this.aulaArray = this.school.aulas;

              this.cursoArray = this.school.cursos;

              this.profesorArray = this.school.profesores;
              //ordenar profesores alfabéticamente
              this.profesorArray.sort((a, b) => {
                if (a.apellido < b.apellido) {
                  return -1;
                }
                if (a.apellido > b.apellido) {
                  return 1;
                }
                if (a.nombre < b.nombre) {
                  return -1;
                }
                if (a.nombre > b.nombre) {
                  return 1;
                }
                return 0;
              });

              this.materiaArray = this.school.materias;

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
                this.selectedMateria = new Materia();
              }

              this.tiposAulas = [];

              this.aulaArray.forEach((aula) => {
                let agregado: boolean = false;
                this.tiposAulas.forEach((tipoAulas) => {
                  if (aula.otro == tipoAulas[0].otro) {
                    agregado = true;
                    tipoAulas.push(aula);
                  }
                });
                if (!agregado) {
                  this.tiposAulas.push([aula]);
                }
              });
              this.cursoArray.forEach((curso) => {
                this.materiasArrayInValidas[curso.nombre] = {};
                this.materiaArray.forEach((materia) => {
                  if (materia.curso == curso.nombre) {
                    this.materiasArrayInValidas[curso.nombre][materia.nombre] =
                      materia.profesoresCapacitados.length > 0 &&
                      materia.aulasMateria.length > 0 &&
                      materia.curso != '';
                  }
                });
              });
            });
        }

        this.spinnerSvc.mostrarSpinnerColegio = false;
      }
    });
  }

  async updateDBMateria() {
    this.selectedMateria = new Materia();
    let materiaArrayDiccionario: Array<any> = [];
    this.materiaArray.forEach((materia) => {
      materiaArrayDiccionario.push({
        nombre: materia.nombre,
        curso: materia.curso,
        profesorSimultaneo: materia.profesorSimultaneo,
        // materiaEspecial: materia.materiaEspecial,
        cantidadDeModulosTotal: materia.cantidadDeModulosTotal,
        cantidadMaximaDeModulosPorDia: materia.cantidadMaximaDeModulosPorDia,
        cantidadMinimaDeModulosPorDia: materia.cantidadMinimaDeModulosPorDia,
        profesoresCapacitados: materia.profesoresCapacitados,
        aulasMateria: materia.aulasMateria,
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
      });
    });
    this.afs.collection('schools').doc(this.nombreColegio).update({
      profesores: ProfesorArrayDiccionario,
    });
  }

  chequearRepeticionEnSubidaDatos(selected: any, arreglo: Array<any>): boolean {
    let existeDato: boolean = false;
    // let arregloAux: Array<any> = [];
    // Object.assign(arregloAux, arreglo);
    // //filter selected of arregloAux
    // arregloAux = arregloAux.filter((dato) => {
    //   return dato.nombre != selected.nombre;
    // });

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
