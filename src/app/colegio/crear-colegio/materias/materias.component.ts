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
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss'],
})
export class MateriasComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // _______________________________________MATERIAS____________________________________________________________

  async updateDBMateria() {
    this.colegioSvc.selectedMateria = new Materia(
      this.colegioSvc.profesorArray,
      this.colegioSvc.aulaArray
    );
    let materiaArrayDiccionario: Array<any> = [];
    this.colegioSvc.materiaArray.forEach((materia) => {
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
    this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
      materias: materiaArrayDiccionario,
    });
  }

  openForEditMateria(materia: Materia) {
    this.colegioSvc.selectedMateria = materia;
  }

  addOrEditMateria() {
    if (
      this.colegioSvc.selectedMateria.nombre != '' &&
      this.colegioSvc.selectedMateria.cantidadDeModulosTotal != '' &&
      this.colegioSvc.selectedMateria.curso != '' &&
      this.colegioSvc.selectedMateria.cantidadMaximaDeModulosPorDia != '' &&
      this.colegioSvc.selectedMateria.nombre.length <= 30
    ) {
      if (
        !this.colegioSvc.chequearRepeticionEnSubidaDatos(
          this.colegioSvc.selectedMateria,
          this.colegioSvc.materiaArray
        )
      ) {
        if (this.colegioSvc.selectedMateria.id == 0) {
          let existeProfesorCapacitado: boolean = false;

          this.colegioSvc.profesorArray.forEach((profesor) => {
            if (
              this.colegioSvc.selectedMateria.profesoresCapacitados[
                profesor.nombre + ' ' + profesor.apellido
              ]
            ) {
              existeProfesorCapacitado = true;
            }
          });

          if (existeProfesorCapacitado) {
            let existeAula: boolean = false;

            this.colegioSvc.aulaArray.forEach((aula) => {
              if (this.colegioSvc.selectedMateria.aulasMateria[aula.nombre]) {
                existeAula = true;
              }
            });

            if (existeAula) {
              this.colegioSvc.selectedMateria.id =
                this.colegioSvc.materiaArray.length + 1;
              this.colegioSvc.materiaArray.push(
                this.colegioSvc.selectedMateria
              );
            } else {
              alert('Coloque por lo menos un aula para la materia creada');
            }
          } else {
            alert('Coloque por lo menos un profesor para la materia creada');
          }
        }
        this.updateDBMateria();
      }
    } else {
      if (this.colegioSvc.selectedMateria.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  clickFormCheckMateriaProfesor(nombre: string) {
    this.colegioSvc.selectedMateria.profesoresCapacitados[nombre] =
      !this.colegioSvc.selectedMateria.profesoresCapacitados[nombre];
  }

  clickFormCheckMateriaAula(nombre: string) {
    this.colegioSvc.selectedMateria.aulasMateria[nombre] =
      !this.colegioSvc.selectedMateria.aulasMateria[nombre];
  }

  deleteMateria() {
    if (confirm('¿Estas seguro/a que quieres eliminar esta materia?')) {
      this.colegioSvc.materiaArray = this.colegioSvc.materiaArray.filter(
        (x) => x != this.colegioSvc.selectedMateria
      );
      this.updateDBMateria();
    }
  }

  async goFormFinalizar() {
    this.colegioSvc.botonesCrearColegio = 6;
    if (this.colegioSvc.botonesCrearColegioProgreso < 6) {
      this.colegioSvc.botonesCrearColegioProgreso = 6;
      this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
        botonesCrearColegioProgreso: 6,
        botonesCrearColegio: 6,
      });
    }
  }
}
