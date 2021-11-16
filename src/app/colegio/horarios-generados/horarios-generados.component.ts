import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ColegioService } from '../services/colegio.service';
import { ExcelService } from '../crear-colegio/finalizar/services/excel.service';
@Component({
  selector: 'app-horarios-generados',
  templateUrl: './horarios-generados.component.html',
  styleUrls: ['./horarios-generados.component.scss'],
})
export class HorariosGeneradosComponent implements OnInit {
  documentos: Array<string> = [];

  documentoActual: any = '';
  cursoActual: any = '';

  horariosHechos: any = {};
  horariosAulasHechos: any = {};
  materiasProfesoresHechos: any = {};
  duracionModulosHecho: any;

  keys = Object.keys;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    public colegioSvc: ColegioService,
    private http: HttpClient,
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private excelService: ExcelService
  ) {
    activatedRoute.params.subscribe((params) => {
      this.colegioSvc.nombreColegio = params.nombreColegio;
    });
  }
  async ngOnInit() {
    await this.afs
      .collection('schools')
      .doc(this.colegioSvc.nombreColegio)
      .collection('horarios')
      .get()
      .toPromise()
      .then((documentos) => {
        documentos.forEach((documento) => {
          this.documentos.push(documento.id);
        });

        if (this.documentos.length > 0) {
          this.documentoActual = this.documentos[this.documentos.length - 1];
        }
      });
    this.cambiarDocumento();
  }

  cambiarDocumento() {
    this.afs
      .doc(
        'schools/' +
          this.colegioSvc.nombreColegio +
          '/horarios/' +
          this.documentoActual
      )
      .get()
      .toPromise()
      .then((horariosReady) => {
        if (
          horariosReady.get('horarios') &&
          horariosReady.get('horariosAulas') &&
          horariosReady.get('materiasProfesores')
        ) {
          this.horariosHechos = horariosReady.get('horarios');
          this.horariosAulasHechos = horariosReady.get('horariosAulas');
          this.materiasProfesoresHechos =
            horariosReady.get('materiasProfesores');
          this.duracionModulosHecho = horariosReady.get('duracionModulos');

          this.cursoActual = this.ordenarCursos(
            Object.keys(this.horariosHechos)
          )[0];
        }
      });
  }

  ordenarCursos(cursos: Array<string>) {
    //ordenar string alfabéticamente
    let cursosOrdenados: Array<string> = [];
    cursos.forEach((curso) => {
      cursosOrdenados.push(curso);
    });
    cursosOrdenados.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
    return cursosOrdenados;
  }

  ordenarDias(dias: Array<string>) {
    //ordenar por Lunes, Martes, Miercoles, Jueves, Viernes
    let diasOrdenados: string[] = [];
    dias.forEach((dia) => {
      if (dia === 'Lunes') {
        diasOrdenados.push(dia);
      } else if (dia === 'Martes') {
        diasOrdenados.push(dia);
      } else if (dia === 'Miercoles') {
        diasOrdenados.push(dia);
      } else if (dia === 'Jueves') {
        diasOrdenados.push(dia);
      } else if (dia === 'Viernes') {
        diasOrdenados.push(dia);
      }
    });
    return diasOrdenados;
  }

  ordenarTurnos(turnos: Array<string>) {
    //ordenar por manana, tarde, noche
    let turnosOrdenados: Array<string> = [];
    turnos.forEach((turno) => {
      if (turno == 'manana') {
        turnosOrdenados.push(turno);
      }
    });
    turnos.forEach((turno) => {
      if (turno == 'tarde') {
        turnosOrdenados.push(turno);
      }
    });
    turnos.forEach((turno) => {
      if (turno == 'noche') {
        turnosOrdenados.push(turno);
      }
    });
    return turnosOrdenados;
  }

  odenarModulos(modulos: Array<string>) {
    //ordenar string de menor a mayor
    let modulosOrdenados: Array<string> = [];
    modulos.forEach((modulo) => {
      modulosOrdenados.push(modulo);
    });
    modulosOrdenados.sort((a, b) => {
      return a.localeCompare(b);
    });
    return modulosOrdenados;
  }

  sumarDuracionModulo(modulo: string) {
    let horasAux: number = Number(modulo.split(':')[0]);
    let minutosAux: number =
      Number(modulo.split(':')[1]) + this.duracionModulosHecho;

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

    return horaFinal + ':' + minutoFinal;
  }

  exportAsExcelFile() {
    //   let jsonMaterias: any = [];
    //   this.colegioSvc.cursoArray.forEach((curso) => {
    //     this.colegioSvc.turnoArray.forEach((turno) => {
    //       if (turno.habilitado == true) {
    //         if (turno.modulos.length > 0) {
    //           jsonMaterias.push({
    //             Curso: curso.nombre,
    //             Modulo: turno.turno,
    //           });
    //         }
    //         turno.modulos.forEach((modulo) => {
    //           jsonMaterias.push({
    //             Modulo: modulo.inicio + ' - ' + modulo.final,
    //           });
    //           this.colegioSvc.dias.forEach((dia) => {
    //             jsonMaterias[jsonMaterias.length - 1][dia] =
    //               this.horariosHechos[curso.nombre][dia][turno.turno][
    //                 modulo.inicio
    //               ];
    //           });
    //         });
    //         if (turno.modulos.length > 0) {
    //           jsonMaterias.push({});
    //         }
    //       }
    //     });
    //     jsonMaterias.push({});
    //   });
    //   this.excelService.exportAsExcelFile(jsonMaterias, 'export-to-excel');
  }
}
