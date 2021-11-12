import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ExcelService } from './services/excel.service';

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
import { MercadopagoService } from 'src/app/mercado-pago/service/mercadopago.service';

declare const MercadoPago: any;

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.scss'],
})
export class FinalizarComponent implements OnInit {
  // clickMoreInfoSchool: boolean = false;
  progresoSeccion: number = 0;
  progresoTotal: number = 0;
  indiceProgreso: number = 1;

  cursoActual: string = '';
  horariosHechos: any = {};
  horariosAulasHechos: any = {};
  materiasProfesoresHechos: any = {};

  botonPresionado: boolean = false;
  horarioGenerado: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    public colegioSvc: ColegioService,
    private http: HttpClient,
    private afs: AngularFirestore,
    private _mercadopago: MercadopagoService,
    private excelService: ExcelService
  ) {
    if (this.colegioSvc.cursoArray.length > 0) {
      this.cursoActual = this.colegioSvc.cursoArray[0].nombre;
    }
  }

  ngOnInit(): void {
    console.log(
      this.colegioSvc.materiasArrayValidas.length,
      this.colegioSvc.materiaArray.length
    );

    // this._mercadopago
    //   .createPreference(
    //     this.colegioSvc.cursoArray.length,
    //     this.colegioSvc.nombreColegio
    //   )
    //   .then((res) => {
    //     const mp = new MercadoPago(
    //       'APP_USR-0cdb1915-b8d1-4dd1-8e25-90db91a59232',
    //       {
    //         locale: 'es-AR',
    //       }
    //     );
    //     // Inicializa el checkout
    //     mp.checkout({
    //       preference: {
    //         id: res.id,
    //       },
    //       render: {
    //         container: '.mercadoPagoBoton', // Indica el nombre de la clase donde se mostrará el botón de pago
    //         label: 'Pagar', // Cambia el texto del botón de pago (opcional)
    //       },
    //     });
    //   });
  }

  // _______________________________________FINALIZAR____________________________________________________________
  async finalizar() {
    this.botonPresionado = true;
    const token: any = (
      await this.afs.firestore.collection('secrets').doc('token').get()
    ).data();
    let res: any = await this.http
      .post(
        'https://s4s-algoritmo.herokuapp.com/algoritmo?nombreColegio=' +
          this.colegioSvc.nombreColegio,
        { token: token['token'] },
        { responseType: 'text' }
      )
      .toPromise()
      .then();
    // let res = '2021-11-01 16:05:00';
    if (res) {
      this.afs
        .collection('schools')
        .doc(this.colegioSvc.nombreColegio)
        .collection('horarios')
        .doc(res)
        .snapshotChanges()
        .pipe(
          map((generacionHorario) => {
            let progreso = generacionHorario.payload.get('progreso');
            if (progreso && progreso.length > 0) {
              this.indiceProgreso = progreso.length;

              // console.log(this.indiceProgreso);
              switch (this.indiceProgreso) {
                case 1:
                  this.progresoSeccion = Math.round(
                    (progreso[this.indiceProgreso - 1] * 100) / 5
                  );
                  break;
                case 2:
                  this.progresoSeccion = Math.round(
                    (progreso[this.indiceProgreso - 1] * 100) / 5
                  );
                  break;
                case 3:
                  this.progresoSeccion = Math.round(
                    (progreso[this.indiceProgreso - 1] * 100) / 25
                  );
                  break;
                case 4:
                  this.progresoSeccion = Math.round(
                    (progreso[this.indiceProgreso - 1] * 100) / 10
                  );
                  break;
                case 5:
                  this.progresoSeccion = Math.round(
                    (progreso[this.indiceProgreso - 1] * 100) / 5
                  );
                  break;
                case 6:
                  this.progresoSeccion = Math.round(
                    (progreso[this.indiceProgreso - 1] * 100) / 30
                  );
                  break;
                case 7:
                  this.progresoSeccion = Math.round(
                    (progreso[this.indiceProgreso - 1] * 100) / 20
                  );
                  break;
              }

              this.progresoTotal = 0;
              progreso.forEach((seccion: number) => {
                this.progresoTotal += seccion;
              });
            }
            if (this.progresoTotal >= 100) {
              this.afs
                .doc(
                  'schools/' +
                    this.colegioSvc.nombreColegio +
                    '/horarios/' +
                    res
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
                    let horariosAulasHechos =
                      horariosReady.get('horariosAulas');
                    let materiasProfesoresHechos =
                      horariosReady.get('materiasProfesores');

                    this.colegioSvc.cursoArray.forEach((curso) => {
                      this.horariosHechos[curso.nombre] = {};
                      this.colegioSvc.dias.forEach((dia) => {
                        this.horariosHechos[curso.nombre][dia] = {};
                        this.colegioSvc.turnoArray.forEach((turno) => {
                          if (turno.habilitado == true) {
                            this.horariosHechos[curso.nombre][dia][
                              turno.turno
                            ] = {};
                            turno.modulos.forEach((modulo) => {
                              if (
                                horariosHechos[curso.nombre][dia][turno.turno][
                                  turno.modulos.indexOf(modulo) + 1
                                ].split('-')[0] == 'Hueco'
                              ) {
                                this.horariosHechos[curso.nombre][dia][
                                  turno.turno
                                ][modulo.inicio] = '';
                              } else {
                                this.horariosHechos[curso.nombre][dia][
                                  turno.turno
                                ][modulo.inicio] =
                                  horariosHechos[curso.nombre][dia][
                                    turno.turno
                                  ][turno.modulos.indexOf(modulo) + 1].split(
                                    '-'
                                  )[0];
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
                            this.horariosAulasHechos[curso.nombre][dia][
                              turno.turno
                            ] = {};
                            turno.modulos.forEach((modulo) => {
                              if (
                                horariosAulasHechos[curso.nombre][dia][
                                  turno.turno
                                ][turno.modulos.indexOf(modulo) + 1] == 'Hueco'
                              ) {
                                this.horariosAulasHechos[curso.nombre][dia][
                                  turno.turno
                                ][modulo.inicio] = '';
                              } else {
                                this.horariosAulasHechos[curso.nombre][dia][
                                  turno.turno
                                ][modulo.inicio] =
                                  horariosAulasHechos[curso.nombre][dia][
                                    turno.turno
                                  ][turno.modulos.indexOf(modulo) + 1];
                              }
                            });
                          }
                        });
                      });
                    });

                    this.colegioSvc.materiaArray.forEach((materia) => {
                      this.materiasProfesoresHechos[
                        materia.nombre + '-' + materia.curso
                      ] =
                        materiasProfesoresHechos[
                          materia.nombre + '-' + materia.curso
                        ];
                    });

                    this.horarioGenerado = true;
                  }
                });
            }
          })
        )
        .subscribe();
    }

    // console.log(res);
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
