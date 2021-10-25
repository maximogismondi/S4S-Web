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
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.scss'],
})
export class AulasComponent implements OnInit {
  objectKeys = Object.keys;
  selectedAula = new Aula();
  temporalAula = new Aula();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // _________________________________________AULAS____________________________________________________________

  async updateDBAula() {
    this.selectedAula = new Aula();
    let aulaArrayDiccionario: Array<any> = [];
    this.colegioSvc.aulaArray.forEach((aula) => {
      aulaArrayDiccionario.push({
        // id: aula.id,
        nombre: aula.nombre,
        tipo: aula.tipo,
        otro: aula.otro,
      });
    });

    this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
      aulas: aulaArrayDiccionario,
    });
  }

  executeUsecase() {
    let isClicked: boolean = false;
    isClicked = true;
  }

  openForEditAula(aula: Aula) {
    this.selectedAula = aula;
    Object.assign(this.temporalAula, aula);
  }

  addOrEditAula() {
    if (
      this.selectedAula.nombre != '' &&
      this.selectedAula.nombre.length <= 30 &&
      this.selectedAula.tipo != ''
    ) {
      if (
        !this.colegioSvc.chequearRepeticionEnSubidaDatos(
          this.selectedAula,
          this.colegioSvc.aulaArray
        )
      ) {
        if (this.selectedAula.id == 0) {
          this.selectedAula.id = this.colegioSvc.aulaArray.length + 1;
          this.colegioSvc.aulaArray.push(this.selectedAula);
        } else {
          this.colegioSvc.materiaArray.forEach((materia) => {
            materia.aulasMateria[this.selectedAula.nombre] =
              materia.aulasMateria[this.temporalAula.nombre];
          });
        }
        if (this.selectedAula.tipo == 'normal') {
          this.selectedAula.otro = 'normal';
        }
        this.colegioSvc.updateDBMateria();
        this.updateDBAula();
      }
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
      this.colegioSvc.aulaArray = this.colegioSvc.aulaArray.filter(
        (x) => x != this.selectedAula
      );
      this.colegioSvc.updateDBMateria();
      this.updateDBAula();
    }
  }

  // async goFormCurso() {
  //   this.colegioSvc.botonesCrearColegio = 3;
  //   if (this.colegioSvc.botonesCrearColegio < 3) {
  //     this.colegioSvc.botonesCrearColegio = 3;
  //     this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
  //       botonesCrearColegio: 3,
  //       botonesCrearColegio: 3,
  //     });
  //   }
  // }
}
