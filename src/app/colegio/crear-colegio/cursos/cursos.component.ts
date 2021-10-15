import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  // ProfesorReducido,
  // HorarioModulo,
  // MateriaReducido,
} from 'src/app/shared/interface/user.interface';
import { ColegioService } from '../../services/colegio.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
})
export class CursosComponent implements OnInit {
  selectedCurso = new Curso();
  temporalCurso = new Curso();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // _______________________________________CURSOS______________________________________________________________

  async updateDBCurso() {
    this.selectedCurso = new Curso();
    let CursoArrayDiccionario: Array<any> = [];
    this.colegioSvc.cursoArray.forEach((curso) => {
      CursoArrayDiccionario.push({
        nombre: curso.nombre,
        turnoPreferido: curso.turnoPreferido,
        cantAlumnos: curso.cantAlumnos,
        // id: curso.id,
        // materiasCurso: curso.materiasCurso,
      });
    });
    this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
      cursos: CursoArrayDiccionario,
    });
  }

  openForEditCurso(curso: Curso) {
    this.selectedCurso = curso;
    Object.assign(this.temporalCurso, curso);
  }

  addOrEditCurso() {
    if (
      this.selectedCurso.nombre != '' &&
      this.selectedCurso.turnoPreferido != '' &&
      this.selectedCurso.cantAlumnos != '' &&
      this.selectedCurso.nombre.length <= 30
    ) {
      if (
        !this.colegioSvc.chequearRepeticionEnSubidaDatos(
          this.selectedCurso,
          this.colegioSvc.cursoArray
        )
      ) {
        if (this.selectedCurso.id == 0) {
          this.selectedCurso.id = this.colegioSvc.cursoArray.length + 1;
          this.colegioSvc.cursoArray.push(this.selectedCurso);
        } else {
          this.colegioSvc.materiaArray.forEach((materia) => {
            if (materia.curso == this.temporalCurso.nombre) {
              materia.curso = this.selectedCurso.nombre;
            }
          });
          this.colegioSvc.updateDBMateria();
        }
        this.updateDBCurso();
      }
    } else {
      if (this.selectedCurso.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  deleteCurso() {
    if (confirm('¿Estas seguro/a que quieres eliminar este curso?')) {
      this.colegioSvc.cursoArray = this.colegioSvc.cursoArray.filter(
        (x) => x != this.selectedCurso
      );
      this.colegioSvc.updateDBMateria();
      this.updateDBCurso();
    }
  }

  async goFormProfesor() {
    this.colegioSvc.botonesCrearColegio = 4;
    if (this.colegioSvc.botonesCrearColegioProgreso < 4) {
      this.colegioSvc.botonesCrearColegioProgreso = 4;
      this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
        botonesCrearColegioProgreso: 4,
        botonesCrearColegio: 4,
      });
    }
  }
}
