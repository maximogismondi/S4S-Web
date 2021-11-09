import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { ExcelService } from '../crear-colegio/finalizar/services/excel.service';
import { ColegioService } from '../services/colegio.service';

@Component({
  selector: 'app-horarios-generados',
  templateUrl: './horarios-generados.component.html',
  styleUrls: ['./horarios-generados.component.scss'],
})
export class HorariosGeneradosComponent implements OnInit {
  documentos: Array<string> = [];

  documentoActual: string = '';
  cursoActual: any = '';
  test = false;
  horariosHechos: any = {};
  horariosAulasHechos: any = {};
  materiasProfesoresHechos: any = {};

  constructor(
    public colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ) {
    this.colegioSvc.nombreColegio = this.activatedRoute.snapshot.paramMap.get(
      'nombreColegio'
    ) as string;

    this.afs
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
          this.cambiarDocumento();
        }
      });
  }
  ngOnInit(): void {}

  cambiarDocumento() {
    this.cursoActual = ''
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
          let horariosHechos = horariosReady.get('horarios');
          let horariosAulasHechos = horariosReady.get('horariosAulas');
          let materiasProfesoresHechos =
            horariosReady.get('materiasProfesores');

          this.colegioSvc.cursoArray.forEach((curso) => {
            this.horariosHechos[curso.nombre] = {};
            this.colegioSvc.dias.forEach((dia) => {
              this.horariosHechos[curso.nombre][dia] = {};
              this.colegioSvc.turnoArray.forEach((turno) => {
                if (turno.habilitado == true) {
                  this.horariosHechos[curso.nombre][dia][turno.turno] = {};
                  turno.modulos.forEach((modulo) => {
                    if (
                      horariosHechos[curso.nombre][dia][turno.turno][
                        turno.modulos.indexOf(modulo) + 1
                      ].split('-')[0] == 'Hueco'
                    ) {
                      this.horariosHechos[curso.nombre][dia][turno.turno][
                        modulo.inicio
                      ] = '';
                    } else {
                      this.horariosHechos[curso.nombre][dia][turno.turno][
                        modulo.inicio
                      ] =
                        horariosHechos[curso.nombre][dia][turno.turno][
                          turno.modulos.indexOf(modulo) + 1
                        ].split('-')[0];
                    }
                  });
                }
              });
            });
          });

          this.colegioSvc.cursoArray.forEach((curso) => {
            this.horariosAulasHechos[curso.nombre] = {};
            this.colegioSvc.dias.forEach((dia) => {
              this.horariosAulasHechos[curso.nombre][dia] = {};
              this.colegioSvc.turnoArray.forEach((turno) => {
                if (turno.habilitado == true) {
                  this.horariosAulasHechos[curso.nombre][dia][turno.turno] = {};
                  turno.modulos.forEach((modulo) => {
                    if (
                      horariosAulasHechos[curso.nombre][dia][turno.turno][
                        turno.modulos.indexOf(modulo) + 1
                      ] == 'Hueco'
                    ) {
                      this.horariosAulasHechos[curso.nombre][dia][turno.turno][
                        modulo.inicio
                      ] = '';
                    } else {
                      this.horariosAulasHechos[curso.nombre][dia][turno.turno][
                        modulo.inicio
                      ] =
                        horariosAulasHechos[curso.nombre][dia][turno.turno][
                          turno.modulos.indexOf(modulo) + 1
                        ];
                    }
                  });
                }
              });
            });
          });

          this.colegioSvc.materiaArray.forEach((materia) => {
            this.materiasProfesoresHechos[
              materia.nombre + '-' + materia.curso
            ] = materiasProfesoresHechos[materia.nombre + '-' + materia.curso];
          });
        }
        if (this.colegioSvc.cursoArray.length > 0) {
          this.cursoActual = this.colegioSvc.cursoArray[0].nombre;
        }
      });
  }

  exportAsExcelFile() {
    let jsonMaterias: any = [];
    this.colegioSvc.cursoArray.forEach((curso) => {
      this.colegioSvc.turnoArray.forEach((turno) => {
        if (turno.habilitado == true) {
          if (turno.modulos.length > 0) {
            jsonMaterias.push({
              Curso: curso.nombre,
              Modulo: turno.turno,
            });
          }
          turno.modulos.forEach((modulo) => {
            jsonMaterias.push({
              Modulo: modulo.inicio + ' - ' + modulo.final,
            });

            this.colegioSvc.dias.forEach((dia) => {
              jsonMaterias[jsonMaterias.length - 1][dia] =
                this.horariosHechos[curso.nombre][dia][turno.turno][
                  modulo.inicio
                ];
            });
          });
          if (turno.modulos.length > 0) {
            jsonMaterias.push({});
          }
        }
      });
      jsonMaterias.push({});
    });
    this.excelService.exportAsExcelFile(jsonMaterias, 'export-to-excel');
  }
}
