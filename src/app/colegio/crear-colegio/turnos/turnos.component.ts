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
  // ingresoDuracion: boolean = false;
  // habilitoManana: boolean = false;
  // habilitoTarde: boolean = false;
  // habilitoNoche: boolean = false;
  // ingresoDuracion: boolean = false;
  // ingresoDuracion: boolean = false;
  turnoSeleccionado: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // _______________________________________TURNOS______________________________________________________________

  cambiarDuracionModulo() {
    if (
      this.colegioSvc.duracionModulo > 60 ||
      this.colegioSvc.duracionModulo < 20
    ) {
      alert(
        'La duracion de cada modulo debe estar entre 20 a 60 min (incluidos los extremos)'
      );
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
    if (
      String(this.colegioSvc.turnoArray[nTurno].inicio) >=
      String(this.colegioSvc.turnoArray[nTurno].finalizacion)
    ) {
      alert(
        'El inicio del turno mañana no puede ser mayor que la finalizacion del mismo.'
      );

      Object.assign(
        this.colegioSvc.turnoArray[nTurno],
        this.colegioSvc.school.turnos[nTurno]
      );
      
      // console.log(this.colegioSvc.turnoArray[nTurno].inicio);
    } else {
      let arregloTemporalModulos: Modulo[] = [];
      this.colegioSvc.turnoArray[nTurno].modulos.forEach((modulo) => {
        if (
          this.colegioSvc.turnoArray[nTurno].inicio <= modulo.inicio &&
          this.colegioSvc.turnoArray[nTurno].finalizacion >= modulo.final
        ) {
          arregloTemporalModulos.push(modulo);
        }
      });
      this.colegioSvc.turnoArray[nTurno].modulos = arregloTemporalModulos;

      this.updateDBTurnos();

      this.colegioSvc.inicioModuloSeleccionado[nTurno] =
        this.colegioSvc.turnoArray[nTurno].inicio;
    }
  }

  habilitarODeshabilitarTurno(turno: string) {
    if (turno == 'manana') {
      this.colegioSvc.turnoArray[0].habilitado =
        !this.colegioSvc.turnoArray[0].habilitado;
    } else if (turno == 'tarde') {
      this.colegioSvc.turnoArray[1].habilitado =
        !this.colegioSvc.turnoArray[1].habilitado;
    } else if (turno == 'noche') {
      this.colegioSvc.turnoArray[2].habilitado =
        !this.colegioSvc.turnoArray[2].habilitado;
    }
    this.updateDBTurnos();
  }

  updateDBTurnos() {
    let turnoArrayDiccionario: Array<any> = [];
    this.colegioSvc.turnoArray.forEach((turno) => {
      let modulosTurno: Array<any> = [];
      turno.modulos.forEach((modulo) => {
        modulosTurno.push({
          inicio: modulo.inicio,
          final: modulo.final,
        });
      });

      if (turno.turno == 'manana') {
        turnoArrayDiccionario.push({
          turno: turno.turno,
          inicio: turno.inicio,
          finalizacion: turno.finalizacion,
          habilitado: turno.habilitado,
          modulos: modulosTurno,
        });
      } else if (turno.turno == 'tarde') {
        turnoArrayDiccionario.push({
          turno: turno.turno,
          inicio: turno.inicio,
          finalizacion: turno.finalizacion,
          habilitado: turno.habilitado,
          modulos: modulosTurno,
        });
      } else if (turno.turno == 'noche') {
        turnoArrayDiccionario.push({
          turno: turno.turno,
          inicio: turno.inicio,
          finalizacion: turno.finalizacion,
          habilitado: turno.habilitado,
          modulos: modulosTurno,
        });
      }
    });
    this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
      turnos: turnoArrayDiccionario,
    });
  }

  moduloValido(horaInicial: string, horaFinal: string): string {
    //fuera de turno
    if (this.turnoSeleccionado == 'manana') {
      if (horaInicial < this.colegioSvc.turnoArray[0].inicio) {
        return 'Fuera de Turno';
      }
      if (horaFinal > this.colegioSvc.turnoArray[0].finalizacion) {
        return 'Fuera de Turno';
      }
    } else if (this.turnoSeleccionado == 'tarde') {
      if (horaInicial < this.colegioSvc.turnoArray[1].inicio) {
        return 'Fuera de Turno';
      }
      if (horaFinal > this.colegioSvc.turnoArray[1].finalizacion) {
        return 'Fuera de Turno';
      }
    } else if (this.turnoSeleccionado == 'noche') {
      if (horaInicial < this.colegioSvc.turnoArray[2].inicio) {
        return 'Fuera de Turno';
      }
      if (horaFinal > this.colegioSvc.turnoArray[2].finalizacion) {
        return 'Fuera de Turno';
      }
    }

    //modulos superpuestos
    for (
      let iModulos = 0;
      iModulos <
      this.colegioSvc.turnoArray[
        this.turnoSeleccionado == 'manana'
          ? 0
          : this.turnoSeleccionado == 'tarde'
          ? 1
          : 2
      ].modulos.length;
      iModulos++
    ) {
      let modulo: Modulo =
        this.colegioSvc.turnoArray[
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
    this.turnoSeleccionado = turnoSeleccionado;
    let horaInicial: string = String(
      this.colegioSvc.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ]
    ).split(':')[0];
    let minutosInicial: string = String(
      this.colegioSvc.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ]
    ).split(':')[1];

    let horasAux: number = Number(horaInicial);
    let minutosAux: number =
      Number(minutosInicial) + this.colegioSvc.duracionModulo;

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
      this.colegioSvc.turnoArray[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ].modulos.push(new Modulo(inicio, fin));
      this.colegioSvc.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ] = horaFinal + ':' + minutoFinal;
      this.colegioSvc.turnoArray[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ].modulos.sort((a, b) =>
        Number(a.inicio.split(':')[0]) * 60 + Number(a.inicio.split(':')[1]) >
        Number(b.inicio.split(':')[0]) * 60 + Number(b.inicio.split(':')[1])
          ? 1
          : -1
      );
      this.colegioSvc.profesorArray.forEach((profesor) => {
        this.colegioSvc.dias.forEach((dia) => {
          profesor.disponibilidad[dia][turnoSeleccionado][inicio] = false;
        });
      });
      this.colegioSvc.updateDBProfesor();
      this.updateDBTurnos();
    } else {
      alert(this.moduloValido(inicio, fin));
    }
  }

  deleteModulo(turnoSeleccionado: string, modulo: Modulo) {
    // console.log(turno);
    this.colegioSvc.profesorArray.forEach((profesor) => {
      this.colegioSvc.dias.forEach((dia) => {
        delete profesor.disponibilidad[dia][turnoSeleccionado][modulo.inicio];
      });
    });
    this.colegioSvc.updateDBProfesor();

    if (turnoSeleccionado == 'manana') {
      this.colegioSvc.turnoArray[0].modulos.splice(
        this.colegioSvc.turnoArray[0].modulos.indexOf(modulo),
        1
      );
    } else if (turnoSeleccionado == 'tarde') {
      this.colegioSvc.turnoArray[1].modulos.splice(
        this.colegioSvc.turnoArray[1].modulos.indexOf(modulo),
        1
      );
    } else {
      this.colegioSvc.turnoArray[2].modulos.splice(
        this.colegioSvc.turnoArray[2].modulos.indexOf(modulo),
        1
      );
    }

    this.updateDBTurnos();
  }

  // ingresoDuracionModulo() {
  //   this.ingresoDuracion = !this.ingresoDuracion;
  // }

  // seleccionaColegio(colegio: string) {
  //   this.turnosForm = this.fb.group({
  //     idColegio: ['', Validators.required]
  //   });
  //   this.colegioElegido = colegio;
  //   this.seleccionoColegio = true;
  // }

  // turnoActual(turno: string) {
  //   this.turnoSeleccionado = turno;
  // }

  // async goFormAula() {
  //   this.colegioSvc.botonesCrearColegio = 2;
  //   if (this.colegioSvc.botonesCrearColegio < 2) {
  //     this.colegioSvc.botonesCrearColegio = 2;
  //     this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
  //       botonesCrearColegio: 2,
  //       botonesCrearColegio: 2,
  //     });
  //   }
  // }
}
