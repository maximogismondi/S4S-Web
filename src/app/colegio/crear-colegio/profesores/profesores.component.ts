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
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.scss'],
})
export class ProfesoresComponent implements OnInit {
  temporalProfesor = new Profesor(this.colegioSvc.turnoArray);

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
    Object.assign(this.temporalProfesor, profesor)
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
          if (this.colegioSvc.selectedProfesor.dni == dniProfe.dni) {
            existeDni = true;
            alert(
              'El dni ya esta utilizado, edite el elemento creado o cree uno con distinto dni'
            );
          }
        });
        if (!existeDni) {
          if (this.colegioSvc.selectedProfesor.id == 0) {
            let existeProfesorDisponible: boolean = false;
            const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
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
            this.colegioSvc.materiaArray.forEach(materia => {
              materia.profesoresCapacitados[this.colegioSvc.selectedProfesor.nombre+" "+this.colegioSvc.selectedProfesor.apellido] = false;
            });
          }
          else {
            this.colegioSvc.materiaArray.forEach(materia => {
              materia.profesoresCapacitados[this.colegioSvc.selectedProfesor.nombre+" "+this.colegioSvc.selectedProfesor.apellido] = materia.profesoresCapacitados[this.temporalProfesor.nombre + " "+this.temporalProfesor.apellido];
              delete materia.profesoresCapacitados[this.temporalProfesor.nombre + " "+this.temporalProfesor.apellido];
            });
          }
          this.colegioSvc.updateDBMateria();
          this.colegioSvc.updateDBProfesor();
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
      this.colegioSvc.profesorArray = this.colegioSvc.profesorArray.filter(
        (x) => x != this.colegioSvc.selectedProfesor
      );
      this.colegioSvc.materiaArray.forEach(materia => {
        delete materia.profesoresCapacitados[this.colegioSvc.selectedProfesor.nombre+" "+this.colegioSvc.selectedProfesor.apellido]
      });
      this.colegioSvc.updateDBMateria();
      this.colegioSvc.updateDBProfesor();
    }
  }

  availabilityProfesor() {
    if (!this.colegioSvc.disponibilidadProfesor) {
      this.colegioSvc.disponibilidadProfesor = true;
    } else {
      this.colegioSvc.disponibilidadProfesor = false;
    }
  }

  clickFormCheck(dia: string, turno: string, modulo: string) {
    this.colegioSvc.selectedProfesor.disponibilidad[dia][turno][modulo] =
      !this.colegioSvc.selectedProfesor.disponibilidad[dia][turno][modulo];
  }

  async goFormMateria() {
    this.colegioSvc.botonesCrearColegio = 5;
    if (this.colegioSvc.botonesCrearColegioProgreso < 5) {
      this.colegioSvc.botonesCrearColegioProgreso = 5;
      this.afs.collection('schools').doc(this.colegioSvc.nombreColegio).update({
        botonesCrearColegioProgreso: 5,
        botonesCrearColegio: 5,
      });
    }
  }
}
