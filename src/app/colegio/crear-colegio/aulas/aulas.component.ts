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
  styleUrls: ['./aulas.component.scss']
})
export class AulasComponent implements OnInit {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private http: HttpClient
  ){}

  ngOnInit(): void {
  }

  // _________________________________________AULAS____________________________________________________________

  async updateDBAula() {
    this.colegioSvc.selectedAula = new Aula();
    let aulaArrayDiccionario: Array<any> = [];
    this.colegioSvc.aulaArray.forEach((aula) => {
      aulaArrayDiccionario.push({
        // id: aula.id,
        nombre: aula.nombre,
        tipo: aula.tipo,
        otro: aula.otro,
      });
    });

    this.afs.collection('schools').doc(this.colegioSvc.nombreDocumento).update({
      aulas: aulaArrayDiccionario,
    });
  }

  openForEditAula(aula: Aula) {
    this.colegioSvc.selectedAula = aula;
  }

  addOrEditAula() {
    if (
      this.colegioSvc.selectedAula.nombre != '' &&
      this.colegioSvc.selectedAula.nombre.length <= 30 &&
      this.colegioSvc.selectedAula.tipo != ''
    ) {
      if (this.colegioSvc.selectedAula.id == 0) {
        if (
          !this.colegioSvc.chequearRepeticionEnSubidaDatos(
            this.colegioSvc.selectedAula,
            this.colegioSvc.aulaArray
          )
        ) {
          this.colegioSvc.selectedAula.id = this.colegioSvc.aulaArray.length + 1;
          this.colegioSvc.aulaArray.push(this.colegioSvc.selectedAula);
        }
      }
      if (this.colegioSvc.selectedAula.tipo == 'normal') {
        this.colegioSvc.selectedAula.otro = 'normal';
      }
      this.updateDBAula();
    } else {
      if (this.colegioSvc.selectedAula.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  deleteAula() {
    if (confirm('¿Estas seguro/a que quieres eliminar este aula?')) {
      this.colegioSvc.aulaArray = this.colegioSvc.aulaArray.filter((x) => x != this.colegioSvc.selectedAula);
      this.updateDBAula();
    }
  }

  async goFormCurso() {
    this.colegioSvc.botonesCrearColegio = 3;
    if (this.colegioSvc.botonesCrearColegioProgreso < 3) {
      this.colegioSvc.botonesCrearColegioProgreso = 3;
      this.afs.collection('schools').doc(this.colegioSvc.nombreDocumento).update({
        botonesCrearColegioProgreso: 3,
        botonesCrearColegio: 3,
      });
    }
  }
}
