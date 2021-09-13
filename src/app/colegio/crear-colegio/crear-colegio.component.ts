import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  Aula,
  Colegio,
  Curso,
  // HorarioModulo,
  Materia,
  // MateriaReducido,
  // Modulo,
  Profesor,
  ProfesorReducido,
  Turno,
  Modulo,
} from 'src/app/shared/interface/user.interface';

@Component({
  selector: 'app-crear-colegio',
  templateUrl: './crear-colegio.component.html',
  styleUrls: ['./crear-colegio.component.scss'],
  providers: [AuthService],
})
export class CrearColegioComponent implements OnInit {
  nombreColegio: string;
  nombreDocumento: string;
  duracionModulo: number;
  // minutos: number;
  // horas: number;
  // horarioFinalizacionModulo: string = '';
  // conjuntoDeTurnos : Array<HorarioModulo> = [];
  // modulos: number;
  horarios: Array<string> = [];
  inicioHorario: string;
  finalizacionHorario: string;
  turnos: number;
  aulas: number;
  materias: number;
  cursos: number;
  profesores: number;
  // materiasArrayCursos: Array<MateriaReducido> = [];
  profesoresArrayMaterias: Array<ProfesorReducido> = [];
  cantidadTurnos: Array<Turno> = [];
  totalCursosColegio: Array<string> = [];
  inicioModuloSeleccionado: Array<string> = [];
  // inicioModuloSeleccionado: string;
  turnoSeleccionado: string;
  // horasFinalSeleccionada: string;
  // minutoFinalSeleccionado: string;
  // horaInicialSeleccionada: string;
  // minutosInicialSeleccionado: string;
  horaInicial: number;
  horaFinal: number;
  turnoArray: Array<Turno> = [
    new Turno('manana'),
    new Turno('tarde'),
    new Turno('noche'),
  ];
  botonesCrearColegio: number = 1;
  botonesCrearColegioProgreso: number;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore
  ) {
    authSvc.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs
          .collection('schools', (ref) =>
            ref.where('userAdmin', '==', user.uid)
          )
          .snapshotChanges()
          .pipe(
            map((schools) => {
              const school = schools[0].payload.doc.data() as Colegio;
              this.nombreColegio = school.nombre;
              this.nombreDocumento = school.id;
              this.duracionModulo = school.duracionModulo;
              this.inicioHorario = school.inicioHorario;
              this.finalizacionHorario = school.finalizacionHorario;
              if (this.inicioModuloSeleccionado.length == 0) {
                this.inicioModuloSeleccionado.push('05:00', '12:00', '18:00');
                if (school.inicioHorario < '12:00') {
                  this.inicioModuloSeleccionado[0] = school.inicioHorario;
                } else if (school.inicioHorario < '18:00') {
                  this.inicioModuloSeleccionado[1] = school.inicioHorario;
                } else {
                  this.inicioModuloSeleccionado[2] = school.inicioHorario;
                }
              }

              // this.horarios.push(String(this.inicioHorario));
              this.horaInicial = Number(
                String(this.inicioHorario).split(':')[0]
              );
              this.horaFinal = Number(
                String(this.finalizacionHorario).split(':')[0]
              );
              // this.minutos = Number(String(this.inicioHorario).split(':')[1]);
              // this.modulos = school.modulos.length;
              this.turnos = school.turnos[0].modulos.length + school.turnos[1].modulos.length + school.turnos[2].modulos.length;
              this.aulas = school.aulas.length;
              this.materias = school.materias.length;
              this.cursos = school.cursos.length;
              this.profesores = school.profesores.length;

              this.botonesCrearColegioProgreso =
                school.botonesCrearColegioProgreso;
              // this.botonesCrearColegio = school.botonesCrearColegio;

              this.turnoArray = school.turnos;

              this.aulaArray = school.aulas;

              this.cursoArray = school.cursos;

              this.profesorArray = school.profesores;

              this.materiaArray = school.materias;

              this.profesoresArrayMaterias = [];
              school.profesores.forEach((profesor) => {
                let profesorAux: ProfesorReducido = {
                  nombre: profesor.nombre,
                  valor: false,
                };
                this.profesoresArrayMaterias.push(profesorAux);
              });
              this.totalCursosColegio = [];
              school.cursos.forEach((cursos) => {
                this.totalCursosColegio.push(cursos.nombre);
              });
            })
          )
          .subscribe();
      }
    });
  }

  ngOnInit(): void {}

  async clickeoBotones(boton: string) {
    if (boton == 'turnos' && this.turnos != 0) {
      this.botonesCrearColegio = 1;
    } else if (boton == 'aulas') {
      this.botonesCrearColegio = 2;
    } else if (boton == 'cursos') {
      this.botonesCrearColegio = 3;
    } else if (boton == 'profesores') {
      this.botonesCrearColegio = 4;
    } else if (boton == 'materias') {
      this.botonesCrearColegio = 5;
    } else if (boton == 'finalizar') {
      this.botonesCrearColegio = 6;
    }
  }

  // _______________________________________TURNOS______________________________________________________________

  updateDBTurnos() {
    let turnoArrayDiccionario: Array<any> = [];
    this.turnoArray.forEach((turno) => {
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
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      turnos: turnoArrayDiccionario,
    });
  }

  moduloValido(horaInicial: string, horaFinal: string): string {
    //fuera de horario
    if (horaInicial < this.inicioHorario) {
      return 'Fuera de Horario';
    }
    if (horaFinal > this.finalizacionHorario) {
      return 'Fuera de Horario';
    }

    //fuera de turno
    if (this.turnoSeleccionado == 'manana') {
      if (horaFinal > '12:00') {
        return 'Fuera de Turno';
      }
    } else if (this.turnoSeleccionado == 'tarde') {
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
      this.turnoArray[
        this.turnoSeleccionado == 'manana'
          ? 0
          : this.turnoSeleccionado == 'tarde'
          ? 1
          : 2
      ].modulos.length;
      iModulos++
    ) {
      let modulo: Modulo =
        this.turnoArray[
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
    if(this.turnoArray[0].modulos.length + this.turnoArray[1].modulos.length + this.turnoArray[2].modulos.length == 0){
      alert('Los modulos creados son para las clases, de lo contrario se consideraran como recreos/horas de almuerzo');
    }
    this.turnoSeleccionado = turnoSeleccionado;
    let horaInicial: string = String(
      this.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ]
    ).split(':')[0];
    let minutosInicial: string = String(
      this.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ]
    ).split(':')[1];

    let horasAux: number = Number(horaInicial);
    let minutosAux: number = Number(minutosInicial) + this.duracionModulo;

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
      this.turnoArray[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ].modulos.push(new Modulo(inicio, fin));
      this.inicioModuloSeleccionado[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ] = horaFinal + ':' + minutoFinal;
      this.turnoArray[
        turnoSeleccionado == 'manana' ? 0 : turnoSeleccionado == 'tarde' ? 1 : 2
      ].modulos.sort((a, b) =>
        Number(a.inicio.split(':')[0]) * 60 + Number(a.inicio.split(':')[1]) >
        Number(b.inicio.split(':')[0]) * 60 + Number(b.inicio.split(':')[1])
          ? 1
          : -1
      );
      this.updateDBTurnos();
    } else {
      alert(this.moduloValido(inicio, fin));
    }
  }

  deleteModulo(turnoSeleccionado: string, turno: Modulo) {
    console.log(turno);
    if (turnoSeleccionado == 'manana') {
      this.turnoArray[0].modulos.splice(
        this.turnoArray[0].modulos.indexOf(turno),
        1
      );
    } else if (turnoSeleccionado == 'tarde') {
      this.turnoArray[1].modulos.splice(
        this.turnoArray[1].modulos.indexOf(turno),
        1
      );
    } else {
      this.turnoArray[2].modulos.splice(
        this.turnoArray[2].modulos.indexOf(turno),
        1
      );
    }

    this.updateDBTurnos();
  }

  // turnoActual(turno: string) {
  //   this.turnoSeleccionado = turno;
  // }

  async goFormAula() {
    this.botonesCrearColegio = 2;
    if (this.botonesCrearColegioProgreso < 2) {
      this.botonesCrearColegioProgreso = 2;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 2,
        botonesCrearColegio: 2,
      });
    }
  }

  // _________________________________________AULAS____________________________________________________________

  aulaArray: Aula[] = [];

  selectedAula: Aula = new Aula();

  async updateDBAula() {
    this.selectedAula = new Aula();
    let aulaArrayDiccionario: Array<any> = [];
    this.aulaArray.forEach((aula) => {
      aulaArrayDiccionario.push({
        // id: aula.id,
        nombre: aula.nombre,
        tipo: aula.tipo,
        otro: aula.otro,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      aulas: aulaArrayDiccionario,
    });
  }

  openForEditAula(aula: Aula) {
    this.selectedAula = aula;
  }

  addOrEditAula() {
    if (
      this.selectedAula.nombre != '' &&
      this.selectedAula.tipo != '' &&
      this.selectedAula.nombre.length <= 30
    ) {
      if (this.selectedAula.id == 0) {
        this.selectedAula.id = this.aulaArray.length + 1;
        this.aulaArray.push(this.selectedAula);
      }
      if (this.selectedAula.tipo == 'Normal') {
        this.selectedAula.otro = 'Se selecciono el tipo normal';
      }
      this.updateDBAula();
    } else {
      if (this.selectedAula.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  deleteAula() {
    if (confirm('¿Estas seguro/a que quieres eliminar este aula?')) {
      this.aulaArray = this.aulaArray.filter((x) => x != this.selectedAula);
      this.updateDBAula();
    }
  }

  async goFormCurso() {
    this.botonesCrearColegio = 3;
    if (this.botonesCrearColegioProgreso < 3) {
      this.botonesCrearColegioProgreso = 3;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 3,
        botonesCrearColegio: 3,
      });
    }
  }

  // _______________________________________CURSOS______________________________________________________________

  cursoArray: Curso[] = [];

  selectedCurso: Curso = new Curso();

  async updateDBCurso() {
    this.selectedCurso = new Curso();
    let CursoArrayDiccionario: Array<any> = [];
    this.cursoArray.forEach((curso) => {
      CursoArrayDiccionario.push({
        // id: curso.id,
        nombre: curso.nombre,
        turnoPreferido: curso.turnoPreferido,
        cantAlumnos: curso.cantAlumnos,
        // materiasCurso: curso.materiasCurso,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      cursos: CursoArrayDiccionario,
    });
  }

  openForEditCurso(curso: Curso) {
    this.selectedCurso = curso;
  }

  addOrEditCurso() {
    if (
      this.selectedCurso.nombre != '' &&
      this.selectedCurso.turnoPreferido != '' &&
      this.selectedCurso.cantAlumnos != '' &&
      this.selectedCurso.nombre.length <= 30
    ) {
      if (this.selectedCurso.id == 0) {
        this.selectedCurso.id = this.cursoArray.length + 1;
        this.cursoArray.push(this.selectedCurso);
      }
      this.updateDBCurso();
    } else {
      if (this.selectedCurso.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  deleteCurso() {
    if (confirm('¿Estas seguro/a que quieres eliminar este curso?')) {
      this.cursoArray = this.cursoArray.filter((x) => x != this.selectedCurso);
      this.updateDBCurso();
    }
  }

  async goFormProfesor() {
    this.botonesCrearColegio = 4;
    if (this.botonesCrearColegioProgreso < 4) {
      this.botonesCrearColegioProgreso = 4;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 4,
        botonesCrearColegio: 4,
      });
    }
  }

  // _______________________________________PROFESORES__________________________________________________________

  profesorArray: Profesor[] = [];

  selectedProfesor: Profesor = new Profesor();

  async updateDBProfesor() {
    this.selectedProfesor = new Profesor();
    let ProfesorArrayDiccionario: Array<any> = [];
    this.profesorArray.forEach((profesor) => {
      ProfesorArrayDiccionario.push({
        // id: profesor.id,
        nombre: profesor.nombre,
        apellido: profesor.apellido,
        dni: profesor.dni,
        // 'materias capacitado': profesor.materiasCapacitado,
        //  turnoPreferido: profesor.turnoPreferido,
        // condiciones: profesor.condiciones,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      profesores: ProfesorArrayDiccionario,
    });
  }

  openForEditProfesor(profesor: Profesor) {
    this.selectedProfesor = profesor;
  }

  addOrEditProfesor() {
    if (
      this.selectedProfesor.nombre != '' &&
      this.selectedProfesor.apellido != '' &&
      this.selectedProfesor.dni != '' &&
      this.selectedProfesor.dni >= '1000000' &&
      this.selectedProfesor.nombre.length <= 30
    ) {
      if (this.selectedProfesor.id == 0) {
        this.selectedProfesor.id = this.profesorArray.length + 1;
        this.profesorArray.push(this.selectedProfesor);
      }
      this.updateDBProfesor();
    } else {
      if (this.selectedProfesor.dni < '1000000') {
        alert('Ingrese un dni valido');
      } else {
        if (this.selectedProfesor.nombre.length > 30) {
          alert('Pone un nombre menor a los 30 caracteres');
        } else {
          alert('Complete los campos vacios');
        }
      }
    }
  }

  deleteProfesor() {
    if (confirm('¿Estas seguro/a que quieres eliminar este profesor/a?')) {
      this.profesorArray = this.profesorArray.filter(
        (x) => x != this.selectedProfesor
      );
      this.updateDBProfesor();
    }
  }

  async goFormMateria() {
    this.botonesCrearColegio = 5;
    if (this.botonesCrearColegioProgreso < 5) {
      this.botonesCrearColegioProgreso = 5;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 5,
        botonesCrearColegio: 5,
      });
    }
  }

  // _______________________________________MATERIAS____________________________________________________________

  materiaArray: Materia[] = [];

  selectedMateria: Materia = new Materia();

  async updateDBMateria() {
    this.selectedMateria = new Materia();
    let materiaArrayDiccionario: Array<any> = [];
    this.materiaArray.forEach((materia) => {
      materiaArrayDiccionario.push({
        id: materia.id,
        nombre: materia.nombre,
        cantidadDeModulosTotal: materia.cantidadDeModulosTotal,
        curso: materia.cursoDado,
        // cantProfesores: materia.cantProfesores,
        // espacioEntreDias: materia.espacioEntreDias,
        // tipoAula: materia.tipo,
        // otro: materia.otro,
        profesoresCapacitados: materia.profesoresCapacitados,
        cantidadMaximaDeModulosPorDia: materia.cantidadMaximaDeModulosPorDia,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      materias: materiaArrayDiccionario,
    });
  }

  openForEditMateria(materia: Materia) {
    this.selectedMateria = materia;
  }

  addOrEditMateria() {
    if (
      this.selectedMateria.nombre != '' &&
      this.selectedMateria.cantidadDeModulosTotal != '' &&
      this.selectedMateria.cursoDado != '' &&
      this.selectedMateria.cantidadMaximaDeModulosPorDia != '' &&
      this.selectedMateria.nombre.length <= 30
    ) {
      if (this.selectedMateria.id == 0) {
        this.selectedMateria.id = this.materiaArray.length + 1;
        this.profesoresArrayMaterias.forEach((profesor) => {
          if (profesor.valor == true) {
            this.selectedMateria.profesoresCapacitados.push(profesor.nombre);
          }
        });
        this.materiaArray.push(this.selectedMateria);
      }
      this.updateDBMateria();
    } else {
      if (this.selectedMateria.nombre.length > 30) {
        alert('Pone un nombre menor a los 30 caracteres');
      } else {
        alert('Complete los campos vacios');
      }
    }
  }

  clicked(nombreProfesor: string) {
    for (let i = 0; i < this.profesoresArrayMaterias.length; i++) {
      if (
        this.profesoresArrayMaterias[i].nombre == nombreProfesor &&
        this.profesoresArrayMaterias[i].valor == false
      ) {
        this.profesoresArrayMaterias[i].valor = true;
      } else if (
        this.profesoresArrayMaterias[i].nombre == nombreProfesor &&
        this.profesoresArrayMaterias[i].valor == true
      ) {
        this.profesoresArrayMaterias[i].valor = false;
      }
    }
  }

  deleteMateria() {
    if (confirm('¿Estas seguro/a que quieres eliminar esta materia?')) {
      this.materiaArray = this.materiaArray.filter(
        (x) => x != this.selectedMateria
      );
      this.updateDBMateria();
    }
  }

  async goFormFinalizar() {
    this.botonesCrearColegio = 6;
    if (this.botonesCrearColegioProgreso < 6) {
      this.botonesCrearColegioProgreso = 6;
      this.afs.collection('schools').doc(this.nombreDocumento).update({
        botonesCrearColegioProgreso: 6,
        botonesCrearColegio: 6,
      });
    }
  }

  // _______________________________________FINALIZAR____________________________________________________________

  async finalizar() {
    alert('GRACIAS👍 BROMITA🤙');
  }
}
