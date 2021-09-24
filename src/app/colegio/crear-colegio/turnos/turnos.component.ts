import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ColegioService } from '../../services/colegio.service';
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

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss'],
})
export class TurnosComponent implements OnInit {
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

  // _______________________________________TURNOS______________________________________________________________

  updateDBTurnos() {
    let turnoArrayDiccionario: Array<any> = [];
    this.turnoArray.forEach((turno) => {
      let modulosTurno: Array<any> = [];
      turno.modulos.forEach((modulo) => {
        modulosTurno.push({
          inicio: modulo.inicio,
          final: modulo.final,
        });
      });
      turnoArrayDiccionario.push({
        turno: turno.turno,
        modulos: modulosTurno,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      turnos: turnoArrayDiccionario,
    });
  }

  moduloValido(horaInicial: string, horaFinal: string): string {
    //fuera de horario
    if (horaInicial < this.inicioHorario) {
      return 'Fuera de Horario';
    }
    if (horaFinal > this.finalizacionHorario) {
      return 'Fuera de Horario';
    }

    //fuera de turno
    if (this.turnoSeleccionado == 'manana') {
      if (horaFinal > '12:00') {
        return 'Fuera de Turno';
      }
    } else if (this.turnoSeleccionado == 'tarde') {
      if (horaInicial < '12:00') {
        return 'Fuera de Turno';
      }
      if (horaFinal > '18:00') {
        return 'Fuera de Turno';
      }
    } else {
      if (horaInicial < '18:00') {
        return 'Fuera de Turno';
      }
    }

    //modulos superpuestos
    for (
      let iModulos = 0;
      iModulos <
      this.turnoArray[
        this.turnoSeleccionado == 'manana'
          ? 0
          : this.turnoSeleccionado == 'tarde'
          ? 1
          : 2
      ].modulos.length;
      iModulos++
    ) {
      let modulo: Modulo =
        this.turnoArray[
          this.turnoSeleccionado == 'manana'
            ? 0
            : this.turnoSeleccionado == 'tarde'
            ? 1
            : 2
        ].modulos[iModulos];
      if (modulo.inicio <= horaInicial && modulo.final > horaInicial) {
        return 'Modulos Superpuestos';
      }
      if (modulo.inicio < horaFinal && modulo.final >= horaFinal) {
        return 'Modulos Superpuestos';
      }
    }

    //valido
    return 'valido';
  }

  addModulo(turnoSeleccionado: string) {
    if (
      this.turnoArray[0].modulos.length +
        this.turnoArray[1].modulos.length +
        this.turnoArray[2].modulos.length ==
      0
    ) {
      alert(
        'Los modulos creados son para las clases, de lo contrario se consideraran como recreos/horas de almuerzo'
      );
    }
    this.turnoSeleccionado = turnoSeleccionado;
    let horaInicial: string = String(
      this.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ]
    ).split(':')[0];
    let minutosInicial: string = String(
      this.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ]
    ).split(':')[1];

    let horasAux: number = Number(horaInicial);
    let minutosAux: number = Number(minutosInicial) + this.duracionModulo;

    while (minutosAux >= 60) {
      minutosAux = minutosAux - 60;
      horasAux++;
      if (horasAux == 24) {
        horasAux = 0;
      }
    }

    let horaFinal: string = String(horasAux);
    let minutoFinal: string = String(minutosAux);

    if (horaFinal.length == 1) horaFinal = '0' + horaFinal;
    if (minutoFinal.length == 1) minutoFinal = '0' + minutoFinal;

    let inicio = horaInicial + ':' + minutosInicial;
    let fin = horaFinal + ':' + minutoFinal;

    if (this.moduloValido(inicio, fin) == 'valido') {
      this.turnoArray[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ].modulos.push(new Modulo(inicio, fin));
      this.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ] = horaFinal + ':' + minutoFinal;
      this.turnoArray[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ].modulos.sort((a, b) =>
        Number(a.inicio.split(':')[0]) * 60 + Number(a.inicio.split(':')[1]) >
        Number(b.inicio.split(':')[0]) * 60 + Number(b.inicio.split(':')[1])
          ? 1
          : -1
      );
      this.updateDBTurnos();
    } else {
      alert(this.moduloValido(inicio, fin));
    }
  }

  deleteModulo(turnoSeleccionado: string, turno: Modulo) {
    // console.log(turno);
    if (turnoSeleccionado == 'manana') {
      this.turnoArray[0].modulos.splice(
        this.turnoArray[0].modulos.indexOf(turno),
        1
      );
    } else if (turnoSeleccionado == 'tarde') {
      this.turnoArray[1].modulos.splice(
        this.turnoArray[1].modulos.indexOf(turno),
        1
      );
    } else {
      this.turnoArray[2].modulos.splice(
        this.turnoArray[2].modulos.indexOf(turno),
        1
      );
    }

    this.updateDBTurnos();
  }

  // turnoActual(turno: string) {
  //   this.turnoSeleccionado = turno;
  // }

  async goFormAula() {
    this.botonesCrearColegio = 2;
    if (this.botonesCrearColegioProgreso < 2) {
      this.botonesCrearColegioProgreso = 2;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 2,
        botonesCrearColegio: 2,
      });
    }
  }
}
