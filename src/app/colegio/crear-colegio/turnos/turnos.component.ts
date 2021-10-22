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

  ingresoDuracion: boolean = false;
  habilitoManana: boolean = false;
  habilitoTarde: boolean = false;
  habilitoNoche: boolean = false;
  // ingresoDuracion: boolean = false;
  // ingresoDuracion: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  turnosForm: FormGroup;

  ngOnInit(): void {
    this.turnosForm = this.fb.group({
      duracionModulo: ['', Validators.required],
    });
  }

  // _______________________________________TURNOS______________________________________________________________
  async onTurno() {
    const {
      duracionModulo,

    } = this.turnosForm.value;

  }

  habilitarTurno(turno: string){
    if(turno == "manana"){
      this.habilitoManana = !this.habilitoManana;
    }
    else if(turno == "tarde"){
      this.habilitoTarde = !this.habilitoTarde;
    }
    else{
      this.habilitoNoche = !this.habilitoNoche;
    }
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
      turnoArrayDiccionario.push({
        turno: turno.turno,
        modulos: modulosTurno,
      });
    });
    this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
      turnos: turnoArrayDiccionario,
    });
  }

  moduloValido(horaInicial: string, horaFinal: string): string {
    //fuera de horario
    if (horaInicial < this.colegioSvc.inicioHorario) {
      return 'Fuera de Horario';
    }
    if (horaFinal > this.colegioSvc.finalizacionHorario) {
      return 'Fuera de Horario';
    }

    //fuera de turno
    if (this.colegioSvc.turnoSeleccionado == 'manana') {
      if (horaFinal > '12:00') {
        return 'Fuera de Turno';
      }
    } else if (this.colegioSvc.turnoSeleccionado == 'tarde') {
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
      this.colegioSvc.turnoArray[
        this.colegioSvc.turnoSeleccionado == 'manana'
          ? 0
          : this.colegioSvc.turnoSeleccionado == 'tarde'
          ? 1
          : 2
      ].modulos.length;
      iModulos++
    ) {
      let modulo: Modulo =
        this.colegioSvc.turnoArray[
          this.colegioSvc.turnoSeleccionado == 'manana'
            ? 0
            : this.colegioSvc.turnoSeleccionado == 'tarde'
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
      this.colegioSvc.turnoArray[0].modulos.length +
        this.colegioSvc.turnoArray[1].modulos.length +
        this.colegioSvc.turnoArray[2].modulos.length ==
      0
    ) {
      alert(
        'Los modulos creados son para las clases, de lo contrario se consideraran como recreos/horas de almuerzo'
      );
    }
    this.colegioSvc.turnoSeleccionado = turnoSeleccionado;
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
    let minutosAux: number = Number(minutosInicial) + this.colegioSvc.duracionModulo;

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
      this.colegioSvc.profesorArray.forEach(profesor => {
        this.colegioSvc.dias.forEach(dia => {
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
    this.colegioSvc.profesorArray.forEach(profesor => {
      this.colegioSvc.dias.forEach(dia => {
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

  ingresoDuracionModulo(){
    this.ingresoDuracion = !this.ingresoDuracion;
  }

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
  //   if (this.colegioSvc.botonesCrearColegioProgreso < 2) {
  //     this.colegioSvc.botonesCrearColegioProgreso = 2;
  //     this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
  //       botonesCrearColegioProgreso: 2,
  //       botonesCrearColegio: 2,
  //     });
  //   }
  // }
}
