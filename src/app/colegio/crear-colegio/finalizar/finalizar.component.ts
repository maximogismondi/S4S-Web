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
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.scss']
})
export class FinalizarComponent implements OnInit {
  constructor(
    public colegioSvc: ColegioService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
  }

    // _______________________________________FINALIZAR____________________________________________________________
    botonPresionado: boolean = false;
    async finalizar() {
      this.http
      .get(
        'https://127.0.0.1:5000/algoritmo?idColegio=' +
          this.colegioSvc.nombreColegio,
        { responseType: 'text' }
      )
      .subscribe((fecha) => {
        this.afs
          .doc('horariosHechos/' + this.colegioSvc.nombreColegio + '/horarios/' + fecha)
          .snapshotChanges()
          .pipe(
            map((horariosReady) => {
              if (horariosReady.payload.exists) {
                console.log('ejecuta el obvserver');
                this.colegioSvc.horarioGenerado = true;
                let horariosHechos = horariosReady.payload.get('horarios');
                let horariosAulasHechos =
                  horariosReady.payload.get('horariosAulas');
                let materiasProfesoresHechos =
                  horariosReady.payload.get('materiasProfesores');

                this.colegioSvc.cursoArray.forEach((curso) => {
                  this.colegioSvc.horariosHechos[curso.nombre] = {};
                  this.colegioSvc.dias.forEach((dia) => {
                    this.colegioSvc.horariosHechos[curso.nombre][dia] = {};
                    this.colegioSvc.turnoArray.forEach((turno) => {
                      this.colegioSvc.horariosHechos[curso.nombre][dia][turno.turno] = [];
                      turno.modulos.forEach((modulo) => {
                        if (
                          horariosHechos[curso.nombre][dia][turno.turno][
                            turno.modulos.indexOf(modulo) + 1
                          ].split('-')[0] == 'Hueco'
                        ) {
                          this.colegioSvc.horariosHechos[curso.nombre][dia][
                            turno.turno
                          ].push('');
                        } else {
                          this.colegioSvc.horariosHechos[curso.nombre][dia][
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
                  this.colegioSvc.horariosAulasHechos[curso.nombre] = {};
                  this.colegioSvc.dias.forEach((dia) => {
                    this.colegioSvc.horariosAulasHechos[curso.nombre][dia] = {};
                    this.colegioSvc.turnoArray.forEach((turno) => {
                      this.colegioSvc.horariosAulasHechos[curso.nombre][dia][turno.turno] =
                        [];
                      turno.modulos.forEach((modulo) => {
                        if (
                          horariosAulasHechos[curso.nombre][dia][turno.turno][
                            turno.modulos.indexOf(modulo) + 1
                          ] == 'Hueco'
                        ) {
                          this.colegioSvc.horariosAulasHechos[curso.nombre][dia][
                            turno.turno
                          ].push('');
                        } else {
                          this.colegioSvc.horariosAulasHechos[curso.nombre][dia][
                            turno.turno
                          ].push(
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
                  this.colegioSvc.materiasProfesoresHechos[materia.nombre] =
                    materiasProfesoresHechos[materia.nombre];
                });
                this.colegioSvc.horarioGenerado = true;
              }
            })
          ).subscribe();
      });
    this.colegioSvc.botonPresionado = true;
    }
}
