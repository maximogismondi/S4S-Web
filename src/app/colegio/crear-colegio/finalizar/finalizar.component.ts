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
import { MercadopagoService } from 'src/app/mercado-pago/service/mercadopago.service';

declare const MercadoPago: any;

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.scss'],
})
export class FinalizarComponent implements OnInit {
  // clickMoreInfoSchool: boolean = false;
  horariosHechos: any = {};
  horariosAulasHechos: any = {};
  materiasProfesoresHechos: any = {};

  constructor(
    public colegioSvc: ColegioService,
    private http: HttpClient,
    private afs: AngularFirestore,
    private _mercadopago: MercadopagoService
  ) {}

  ngOnInit(): void {

    this._mercadopago.createPreference(this.colegioSvc.cursoArray.length,this.colegioSvc.nombreColegio).then(res => {
      const mp = new MercadoPago('TEST-5bd86ed1-ae42-4cf6-a63a-2bcc93bffb2b', {
        locale: 'es-AR'
      });

      // Inicializa el checkout
      mp.checkout({
          preference: {
              id: res.id
          },
          render: {
                container: '.cho-container', // Indica el nombre de la clase donde se mostrará el botón de pago
                label: 'Pagar', // Cambia el texto del botón de pago (opcional)
          }
      });
    })

    
  }

  // _______________________________________FINALIZAR____________________________________________________________
  botonPresionado: boolean = false;
  async finalizar() {
    this.http
      .get(
        'https://s4s-algoritmo.herokuapp.com/algoritmo?idColegio=' +
          this.colegioSvc.nombreColegio,
        { responseType: 'text' }
      )
      .subscribe((fecha) => {
        this.afs
          .doc(
            'horariosHechos/' +
              this.colegioSvc.nombreColegio +
              '/horarios/' +
              fecha
          )
          .snapshotChanges()
          .pipe(
            map((horariosReady) => {
              if (horariosReady.payload.exists) {
                // console.log('ejecuta el obvserver');
                this.colegioSvc.horarioGenerado = true;
                let horariosHechos = horariosReady.payload.get('horarios');
                let horariosAulasHechos =
                  horariosReady.payload.get('horariosAulas');
                let materiasProfesoresHechos =
                  horariosReady.payload.get('materiasProfesores');

                this.colegioSvc.cursoArray.forEach((curso) => {
                  this.horariosHechos[curso.nombre] = {};
                  this.colegioSvc.dias.forEach((dia) => {
                    this.horariosHechos[curso.nombre][dia] = {};
                    this.colegioSvc.turnoArray.forEach((turno) => {
                      this.horariosHechos[curso.nombre][dia][
                        turno.turno
                      ] = [];
                      turno.modulos.forEach((modulo) => {
                        if (
                          horariosHechos[curso.nombre][dia][turno.turno][
                            turno.modulos.indexOf(modulo) + 1
                          ].split('-')[0] == 'Hueco'
                        ) {
                          this.horariosHechos[curso.nombre][dia][
                            turno.turno
                          ].push('');
                        } else {
                          this.horariosHechos[curso.nombre][dia][
                            turno.turno
                          ].push(
                            horariosHechos[curso.nombre][dia][turno.turno][
                              turno.modulos.indexOf(modulo) + 1
                            ].split('-')[0]
                          );
                        }
                      });
                    });
                  });
                });

                this.colegioSvc.cursoArray.forEach((curso) => {
                  this.horariosAulasHechos[curso.nombre] = {};
                  this.colegioSvc.dias.forEach((dia) => {
                    this.horariosAulasHechos[curso.nombre][dia] = {};
                    this.colegioSvc.turnoArray.forEach((turno) => {
                      this.horariosAulasHechos[curso.nombre][dia][
                        turno.turno
                      ] = [];
                      turno.modulos.forEach((modulo) => {
                        if (
                          horariosAulasHechos[curso.nombre][dia][turno.turno][
                            turno.modulos.indexOf(modulo) + 1
                          ] == 'Hueco'
                        ) {
                          this.horariosAulasHechos[curso.nombre][
                            dia
                          ][turno.turno].push('');
                        } else {
                          this.horariosAulasHechos[curso.nombre][
                            dia
                          ][turno.turno].push(
                            horariosAulasHechos[curso.nombre][dia][turno.turno][
                              turno.modulos.indexOf(modulo) + 1
                            ]
                          );
                        }
                      });
                    });
                  });
                });

                this.colegioSvc.materiaArray.forEach((materia) => {
                  this.materiasProfesoresHechos[materia.nombre+"-"+materia.curso] =
                    materiasProfesoresHechos[materia.nombre+"-"+materia.curso];
                });
                // console.table(materiasProfesoresHechos)
                this.colegioSvc.horarioGenerado = true;
              }
            })
          )
          .subscribe();
      });
    this.colegioSvc.botonPresionado = true;
  }

}
