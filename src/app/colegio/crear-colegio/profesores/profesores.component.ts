import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.scss'],
})
export class ProfesoresComponent implements OnInit {
  temporalProfesor = new Profesor(this.colegioSvc.turnoArray);
  disponibilidadTotal = false;
  disponibilidadDiaria: any = {
    Lunes: false,
    Martes: false,
    Miercoles: false,
    Jueves: false,
    Viernes: false,
  };
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public colegioSvc: ColegioService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  // _______________________________________PROFESORES__________________________________________________________

  openForEditProfesor(profesor: Profesor) {
    this.colegioSvc.selectedProfesor = profesor;
    Object.assign(this.temporalProfesor, profesor);
    this.disponibilidadTotal = true;
    this.colegioSvc.dias.forEach((dia) => {
      this.disponibilidadDiaria[dia] = true;
      this.colegioSvc.turnoArray.forEach((turno) => {
        turno.modulos.forEach((modulo) => {
          if (
            !this.colegioSvc.selectedProfesor.disponibilidad[dia][turno.turno][
              modulo.inicio
            ]
          ) {
            this.disponibilidadTotal = false;
            this.disponibilidadDiaria[dia] = false;
          }
        });
      });
    });
  }

  addOrEditProfesor() {
    if (
      this.colegioSvc.selectedProfesor.nombre != '' &&
      this.colegioSvc.selectedProfesor.apellido != '' &&
      this.colegioSvc.selectedProfesor.dni != '' &&
      this.colegioSvc.selectedProfesor.dni >= '1000000' &&
      this.colegioSvc.selectedProfesor.nombre.length <= 30
    ) {
      if (
        !this.colegioSvc.chequearRepeticionEnSubidaDatos(
          this.colegioSvc.selectedProfesor,
          this.colegioSvc.profesorArray
        )
      ) {
        let existeDni: boolean = false;
        this.colegioSvc.profesorArray.forEach((dniProfe) => {
          if (
            this.colegioSvc.selectedProfesor.dni == dniProfe.dni &&
            this.colegioSvc.selectedProfesor != dniProfe
          ) {
            existeDni = true;
            alert(
              'El dni ya esta utilizado, edite el elemento creado o cree uno con distinto dni'
            );
          }
        });
        if (!existeDni) {
          if (this.colegioSvc.selectedProfesor.id == 0) {
            let existeProfesorDisponible: boolean = false;
            const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
            dias.forEach((dia) => {
              this.colegioSvc.turnoArray.forEach((turno) => {
                turno.modulos.forEach((modulo) => {
                  if (
                    this.colegioSvc.selectedProfesor.disponibilidad[dia][
                      turno.turno
                    ][modulo.inicio]
                  ) {
                    existeProfesorDisponible = true;
                  }
                });
              });
            });
            if (existeProfesorDisponible) {
              this.colegioSvc.selectedProfesor.id =
                this.colegioSvc.profesorArray.length + 1;
              this.colegioSvc.profesorArray.push(
                this.colegioSvc.selectedProfesor
              );
            } else {
              alert('Coloque por lo menos un horario para el profesor/a');
            }
          } else {
            this.colegioSvc.materiaArray.forEach((materia) => {
              if (
                materia.profesoresCapacitados.includes(
                  this.temporalProfesor.nombre +
                    ' ' +
                    this.temporalProfesor.apellido
                )
              ) {
                materia.profesoresCapacitados.splice(
                  materia.profesoresCapacitados.indexOf(
                    this.temporalProfesor.nombre +
                      ' ' +
                      this.temporalProfesor.apellido
                  ),
                  1
                );
                materia.profesoresCapacitados.push(
                  this.colegioSvc.selectedProfesor.nombre +
                    ' ' +
                    this.colegioSvc.selectedProfesor.apellido
                );
              }
            });
          }
          this.colegioSvc.updateDBMateria();
          this.colegioSvc.updateDBProfesor();

          this.disponibilidadTotal = false;
          this.colegioSvc.dias.forEach((dia) => {
            this.disponibilidadDiaria[dia] = false;
          });
        }
      }
    } else {
      if (this.colegioSvc.selectedProfesor.dni < '1000000') {
        alert('Ingrese un dni valido');
      } else {
        if (this.colegioSvc.selectedProfesor.nombre.length > 30) {
          alert('Pone un nombre menor a los 30 caracteres');
        } else {
          alert('Complete los campos vacios');
        }
      }
    }
  }

  deleteProfesor() {
    if (confirm('¿Estas seguro/a que quieres eliminar este profesor/a?')) {
      this.colegioSvc.materiaArray.forEach((materia) => {
        if (
          materia.profesoresCapacitados.includes(
            this.colegioSvc.selectedProfesor.nombre +
              ' ' +
              this.colegioSvc.selectedProfesor.apellido
          )
        ) {
          materia.profesoresCapacitados.splice(
            materia.profesoresCapacitados.indexOf(
              this.colegioSvc.selectedProfesor.nombre +
                ' ' +
                this.colegioSvc.selectedProfesor.apellido
            ),
            1
          );
        }
      });
      this.colegioSvc.profesorArray = this.colegioSvc.profesorArray.filter(
        (x) => x != this.colegioSvc.selectedProfesor
      );
      this.colegioSvc.updateDBMateria();
      this.colegioSvc.updateDBProfesor();
    }
  }

  availabilityProfesor() {
    this.colegioSvc.disponibilidadProfesor =
      !this.colegioSvc.disponibilidadProfesor;
  }

  clickDisponibilidadCheck(dia: any, turno: string, modulo: any) {
    if (dia != null) {
      if (modulo != null) {
        this.colegioSvc.selectedProfesor.disponibilidad[dia][turno][modulo] =
          !this.colegioSvc.selectedProfesor.disponibilidad[dia][turno][modulo];
      } else {
        this.disponibilidadDiaria[dia] = !this.disponibilidadDiaria[dia];
        this.colegioSvc.turnoArray.forEach((turno) => {
          turno.modulos.forEach((modulo) => {
            this.colegioSvc.selectedProfesor.disponibilidad[dia][turno.turno][
              modulo.inicio
            ] = this.disponibilidadDiaria[dia];
          });
        });
      }
    } else {
      this.disponibilidadTotal = !this.disponibilidadTotal;
      this.colegioSvc.dias.forEach((dia) => {
        this.colegioSvc.turnoArray.forEach((turno) => {
          turno.modulos.forEach((modulo) => {
            this.colegioSvc.selectedProfesor.disponibilidad[dia][turno.turno][
              modulo.inicio
            ] = this.disponibilidadTotal;
          });
        });
      });
    }
    this.disponibilidadTotal = true;
    this.colegioSvc.dias.forEach((dia) => {
      this.disponibilidadDiaria[dia] = true;
      this.colegioSvc.turnoArray.forEach((turno) => {
        turno.modulos.forEach((modulo) => {
          if (
            !this.colegioSvc.selectedProfesor.disponibilidad[dia][turno.turno][
              modulo.inicio
            ]
          ) {
            this.disponibilidadTotal = false;
            this.disponibilidadDiaria[dia] = false;
          }
        });
      });
    });
  }
}
