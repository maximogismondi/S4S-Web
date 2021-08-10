import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
} from 'src/app/shared/interface/user.interface';

@Component({
  selector: 'app-crear-colegio',
  templateUrl: './crear-colegio.component.html',
  styleUrls: ['./crear-colegio.component.scss'],
  providers: [AuthService],
})
export class CrearColegioComponent implements OnInit {
  nombreColegio: string;
  nombreDocumento: string;
  duracionModulo: number;
  minutos: number;
  horas: number;
  horarioFinalizacionModulo: string = '';
  modulos: number;
  aulas: number;
  materias: number;
  cursos: number;
  profes: number;
  materiasArray: Array<string> = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore
  ) {
    authSvc.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs
          .collection('schools', (ref) =>
            ref.where('userAdmin', '==', user.uid)
          )
          .snapshotChanges()
          .pipe(
            map((schools) => {
              const school = schools[0].payload.doc.data() as Colegio;
              this.nombreColegio = school.nombre;
              this.nombreDocumento = school.id;
              this.duracionModulo = school.duracionModulo;
              this.modulos = school.modulos.length;
              this.aulas = school.aulas.length;
              this.materias = school.materias.length;
              this.cursos = school.cursos.length;
              this.profes = school.profes.length;
              for (let i = 0; i < school.materias.length; i++) {
                this.materiasArray.push(school.materias[i].nombre);
              }
            })
          )
          .subscribe();
      }
    });
  }

  ngOnInit(): void {}

  // _______________________________________MODULOS______________________________________________________________

  moduloArray: Modulo[] = [];

  selectedModulo: Modulo = new Modulo();

  openForEditModulo(modulo: Modulo) {
    this.selectedModulo = modulo;
  }

  addOrEditModulo() {
    this.horarioFinalizacionModulo = String(this.selectedModulo.inicio);
    this.horas = Number(this.horarioFinalizacionModulo.split(':')[0]);
    this.minutos =
      Number(this.horarioFinalizacionModulo.split(':')[1]) +
      this.duracionModulo;

    while (this.minutos >= 60) {
      this.minutos = this.minutos - 60;
      this.horas = this.horas + 1;
      if (this.horas == 24) {
        this.horas = 0;
      }
    }

    this.horarioFinalizacionModulo =
      String(this.horas) + ':' + String(this.minutos);
    if (this.selectedModulo.id == 0) {
      this.selectedModulo.id = this.moduloArray.length + 1;
      this.moduloArray.push(this.selectedModulo);

      // console.log(this.horarioFinalizacionModulo);
    }
    this.selectedModulo = new Modulo();
  }

  deleteModulo() {
    if (confirm('¿Estas seguro/a que quieres eliminar este modulo?')) {
      this.moduloArray = this.moduloArray.filter(
        (x) => x != this.selectedModulo
      );
      this.selectedModulo = new Modulo();
    }
  }

  async goFormAula() {
    let moduloArrayDiccionario: Array<any> = [];
    this.moduloArray.forEach((modulo) => {
      moduloArrayDiccionario.push({
        id: modulo.id,
        dia: modulo.dia,
        inicio: modulo.inicio,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      modulos: moduloArrayDiccionario,
    });
  }

  // _________________________________________AULAS____________________________________________________________

  aulaArray: Aula[] = [];

  selectedAula: Aula = new Aula();

  openForEditAula(aula: Aula) {
    this.selectedAula = aula;
  }

  addOrEditAula() {
    if (this.selectedAula.id == 0) {
      this.selectedAula.id = this.aulaArray.length + 1;
      this.aulaArray.push(this.selectedAula);
    }
    this.selectedAula = new Aula();
  }

  deleteAula() {
    if (confirm('¿Estas seguro/a que quieres eliminar este aula?')) {
      this.aulaArray = this.aulaArray.filter((x) => x != this.selectedAula);
      this.selectedAula = new Aula();
    }
  }

  async goFormMateria() {
    let aulaArrayDiccionario: Array<any> = [];
    this.aulaArray.forEach((aula) => {
      aulaArrayDiccionario.push({
        id: aula.id,
        nombre: aula.nombre,
        tipo: aula.tipo,
        otro: aula.otro,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      aulas: aulaArrayDiccionario,
    });
  }

  // _______________________________________MATERIAS____________________________________________________________

  materiaArray: Materia[] = [];

  selectedMateria: Materia = new Materia();

  openForEditMateria(materia: Materia) {
    this.selectedMateria = materia;
  }

  addOrEditMateria() {
    if (this.selectedMateria.id == 0) {
      this.selectedMateria.id = this.materiaArray.length + 1;
      this.materiaArray.push(this.selectedMateria);
    }
    this.selectedMateria = new Materia();
  }

  deleteMateria() {
    if (confirm('¿Estas seguro/a que quieres eliminar esta materia?')) {
      this.materiaArray = this.materiaArray.filter(
        (x) => x != this.selectedMateria
      );
      this.selectedMateria = new Materia();
    }
  }

  async goFormCurso() {
    let materiaArrayDiccionario: Array<any> = [];
    this.materiaArray.forEach((materia) => {
      materiaArrayDiccionario.push({
        id: materia.id,
        nombre: materia.nombre,
        cantModulos: materia.cantModulos,
        cantProfesores: materia.cantProfesores,
        espacioEntreDias: materia.espacioEntreDias,
        tipoAula: materia.tipo,
        otro: materia.otro,
        cantidadModulosContinuos: materia.cantidadModulosContinuos,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      materias: materiaArrayDiccionario,
    });
  }

  // _______________________________________CURSOS______________________________________________________________

  cursoArray: Curso[] = [];

  selectedCurso: Curso = new Curso();

  openForEditCurso(curso: Curso) {
    this.selectedCurso = curso;
  }

  addOrEditCurso() {
    if (this.selectedCurso.id == 0) {
      this.selectedCurso.id = this.cursoArray.length + 1;
      this.cursoArray.push(this.selectedCurso);
    }
    this.selectedCurso = new Curso();
    for (let i = 0; i < this.materiaArray.length; i++) {
      console.log(this.materiasArray[i]);
    }
  }

  deleteCurso() {
    if (confirm('¿Estas seguro/a que quieres eliminar este curso?')) {
      this.cursoArray = this.cursoArray.filter((x) => x != this.selectedCurso);
      this.selectedCurso = new Curso();
    }
  }

  async goFormProfesor() {
    let CursoArrayDiccionario: Array<any> = [];
    this.cursoArray.forEach((curso) => {
      CursoArrayDiccionario.push({
        id: curso.id,
        nombre: curso.nombre,
        turnoPreferido: curso.turnoPreferido,
        cantAlumnos: curso.cantAlumnos,
        materiasCurso: curso.materiasCurso,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      modulos: CursoArrayDiccionario,
    });
  }

  // _______________________________________PROFES______________________________________________________________

  profesorArray: Profesor[] = [];

  selectedProfesor: Profesor = new Profesor();

  openForEditProfesor(profesor: Profesor) {
    this.selectedProfesor = profesor;
  }

  addOrEditProfesor() {
    if (this.selectedProfesor.id == 0) {
      this.selectedProfesor.id = this.profesorArray.length + 1;
      this.profesorArray.push(this.selectedProfesor);
    }
    this.selectedProfesor = new Profesor();
  }

  deleteProfesor() {
    if (confirm('¿Estas seguro/a que quieres eliminar este profesor/a?')) {
      this.profesorArray = this.profesorArray.filter(
        (x) => x != this.selectedProfesor
      );
      this.selectedProfesor = new Profesor();
    }
  }

  async goFormFinalizar() {
    let ProfesorArrayDiccionario: Array<any> = [];
    this.profesorArray.forEach((profesor) => {
      ProfesorArrayDiccionario.push({
        id: profesor.id,
        nombre: profesor.nombre,
        dni: profesor.dni,
        'materias capacitado': profesor.materiasCapacitado,
        turnoPreferido: profesor.turnoPreferido,
        condiciones: profesor.condiciones,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      modulos: ProfesorArrayDiccionario,
    });
  }
}
