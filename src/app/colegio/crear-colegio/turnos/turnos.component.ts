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
} from 'src/app/shared/interface/user.interface';
import { ColegioService } from '../../services/colegio.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss'],
})
export class TurnosComponent implements OnInit {
  turnoSeleccionado: string;
  selectedModulo: Modulo;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // _______________________________________TURNOS______________________________________________________________

  editModulo(tipoModulo: string, inicioModulo: string, turno: number) {
    this.colegioSvc.turnoArray[turno].modulos.forEach((modulo) => {
      if (modulo.inicio == inicioModulo) {
        modulo.tipo = tipoModulo;
      }
    });

    this.updateDBTurnos();
  }

  setMyStyles(color: string) {
    let styles = {
      background: color,
    };
    return styles;
  }

  cambiarDuracionModulo() {
    if (
      this.colegioSvc.duracionModulo > 60 ||
      this.colegioSvc.duracionModulo < 20
    ) {
      alert('La duracion de cada modulo debe ser desde 20 min hasta 60 min');
    }
    this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
      duracionModulo: this.colegioSvc.duracionModulo,
    });

    this.colegioSvc.turnoArray[0].modulos = [];
    this.colegioSvc.turnoArray[1].modulos = [];
    this.colegioSvc.turnoArray[2].modulos = [];

    this.updateDBTurnos();
  }

  completarTurnos(nTurno: number) {
    let turnoValido = true;
    if (
      String(this.colegioSvc.turnoArray[nTurno].inicio) == '' ||
      String(this.colegioSvc.turnoArray[nTurno].finalizacion) == ''
    ) {
      turnoValido = false;
    } else if (
      String(this.colegioSvc.turnoArray[nTurno].inicio) >=
      String(this.colegioSvc.turnoArray[nTurno].finalizacion)
    ) {
      alert(
        'El inicio del turno tiene que ser menor a la finalizacion del mismo.'
      );
      turnoValido = false;
    }
    //comprobar que los turnos anteriores no pasen a los siguientes
    if (nTurno == 0) {
      if (
        String(this.colegioSvc.turnoArray[nTurno + 1].inicio) <
          String(this.colegioSvc.turnoArray[nTurno].finalizacion) &&
        this.colegioSvc.turnoArray[nTurno + 1].habilitado == true
      ) {
        alert(
          'El finalizacion del turno mañana tiene que ser menor al inicio del turno tarde.'
        );
        turnoValido = false;
      }
    } else if (nTurno == 1) {
      if (
        String(this.colegioSvc.turnoArray[nTurno - 1].finalizacion) >
          String(this.colegioSvc.turnoArray[nTurno].inicio) &&
        this.colegioSvc.turnoArray[nTurno - 1].habilitado == true
      ) {
        alert(
          'El inicio del turno tarde tiene que ser mayor a la finalizacion del turno mañana.'
        );
        turnoValido = false;
      }
    } else {
      if (
        String(this.colegioSvc.turnoArray[nTurno - 1].finalizacion) >
          String(this.colegioSvc.turnoArray[nTurno].inicio) &&
        this.colegioSvc.turnoArray[nTurno - 1].habilitado == true
      ) {
        alert(
          'El inicio del turno noche tiene que ser mayor a la finalizacion del turno tarde.'
        );
        turnoValido = false;
      }
    }

    if (turnoValido) {
      this.colegioSvc.turnoArray[nTurno].modulos = this.colegioSvc.turnoArray[
        nTurno
      ].modulos.filter((modulo) => {
        return (
          modulo.inicio >= this.colegioSvc.turnoArray[nTurno].inicio &&
          modulo.final <= this.colegioSvc.turnoArray[nTurno].finalizacion
        );
      });

      this.colegioSvc.inicioModuloSeleccionado[nTurno] =
        this.colegioSvc.turnoArray[nTurno].inicio;
      this.updateDBTurnos();
    }
  }

  estadoTurno(turno: string) {
    let nTurno = turno == 'manana' ? 0 : turno == 'tarde' ? 1 : 2;
    this.colegioSvc.turnoArray[nTurno].habilitado =
      !this.colegioSvc.turnoArray[nTurno].habilitado;
    this.updateDBTurnos();
  }

  updateDBTurnos() {
    let arrayTurnos: Array<any> = [];
    this.colegioSvc.turnoArray.forEach((turno) => {
      let arregloModulos: Array<any> = [];
      turno.modulos.forEach((modulo) => {
        arregloModulos.push({
          inicio: modulo.inicio,
          final: modulo.final,
          tipo: modulo.tipo,
        });
      });
      arrayTurnos.push({
        nombre: turno.turno,
        inicio: turno.inicio,
        finalizacion: turno.finalizacion,
        habilitado: turno.habilitado,
        modulos: arregloModulos,
      });
    });

    this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
      turnos: arrayTurnos,
    });
  }

  moduloValido(horaInicial: string, horaFinal: string) {
    //fuera de turno
    let nTurno =
      this.turnoSeleccionado == 'manana'
        ? 0
        : this.turnoSeleccionado == 'tarde'
        ? 1
        : 2;
    if (
      horaInicial < this.colegioSvc.turnoArray[nTurno].inicio ||
      horaFinal > this.colegioSvc.turnoArray[nTurno].finalizacion
    ) {
      alert('Fuera de Turno');
      return false;
    }

    //chequear que lo modulos no esten superpuestos
    let modulos = this.colegioSvc.turnoArray[nTurno].modulos;
    for (let i = 0; i < modulos.length; i++) {
      if (horaInicial >= modulos[i].inicio && horaInicial < modulos[i].final) {
        alert('El modulo se superpone con otro');
        return false;
      } else if (
        horaFinal > modulos[i].inicio &&
        horaFinal <= modulos[i].final
      ) {
        alert('El modulo se superpone con otro');
        return false;
      }
    }
    return true;
  }

  addModulo(turnoSeleccionado: string) {
    this.turnoSeleccionado = turnoSeleccionado;
    let nTurno =
      this.turnoSeleccionado == 'manana'
        ? 0
        : this.turnoSeleccionado == 'tarde'
        ? 1
        : 2;

    let nuevoModulo = new Modulo(
      this.colegioSvc.inicioModuloSeleccionado[nTurno],
      ''
    );

    let horasAux: number = Number(nuevoModulo.inicio.split(':')[0]);
    let minutosAux: number =
      Number(nuevoModulo.inicio.split(':')[1]) + this.colegioSvc.duracionModulo;

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

    nuevoModulo.final = horaFinal + ':' + minutoFinal;
    if (this.moduloValido(nuevoModulo.inicio, nuevoModulo.final)) {
      this.colegioSvc.turnoArray[nTurno].modulos.push(nuevoModulo);
      this.colegioSvc.inicioModuloSeleccionado[nTurno] = nuevoModulo.final;
      //ordenar modulos por inicio
      this.colegioSvc.turnoArray[nTurno].modulos.sort((a, b) => {
        if (a.inicio < b.inicio) {
          return -1;
        }
        if (a.inicio > b.inicio) {
          return 1;
        }
        return 0;
      });
      this.colegioSvc.profesorArray.forEach((profesor) => {
        this.colegioSvc.dias.forEach((dia) => {
          profesor.disponibilidad[dia][turnoSeleccionado][nuevoModulo.inicio] =
            false;
        });
      });
      this.colegioSvc.updateDBProfesor();
      this.updateDBTurnos();
    }
  }

  deleteModulo(turnoSeleccionado: string, moduloBorrar: Modulo) {
    this.turnoSeleccionado = turnoSeleccionado;
    let nTurno =
      this.turnoSeleccionado == 'manana'
        ? 0
        : this.turnoSeleccionado == 'tarde'
        ? 1
        : 2;

    this.colegioSvc.profesorArray.forEach((profesor) => {
      ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'].forEach((dia) => {
        delete profesor.disponibilidad[dia][turnoSeleccionado][
          moduloBorrar.inicio
        ];
      });
    });

    this.colegioSvc.turnoArray[nTurno].modulos = this.colegioSvc.turnoArray[
      nTurno
    ].modulos.filter((modulo) => {
      return modulo.inicio != moduloBorrar.inicio;
    });

    this.colegioSvc.updateDBProfesor();
    this.updateDBTurnos();
  }
}
