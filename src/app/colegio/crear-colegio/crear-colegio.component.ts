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
  inicioModuloSeleccionado: string;
  turnoSeleccionado: string;
  // horasFinalSeleccionada: string;
  // minutoFinalSeleccionado: string;
  // horaInicialSeleccionada: string;
  // minutosInicialSeleccionado: string;
  horaInicial: number;
  horaFinal: number;
  turnosArray: Array<Turno> = [new Turno("manana"), new Turno("tarde"), new Turno("noche")];

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
              this.inicioModuloSeleccionado = school.inicioHorario;
              // this.horarios.push(String(this.inicioHorario));
              this.horaInicial = Number(String(this.inicioHorario).split(':')[0]);
              this.horaFinal = Number(String(this.finalizacionHorario).split(':')[0]);
              // this.minutos = Number(String(this.inicioHorario).split(':')[1]);
              // this.modulos = school.modulos.length;
              this.turnos = school.turnos.length;
              this.aulas = school.aulas.length;
              this.materias = school.materias.length;
              this.cursos = school.cursos.length;
              // console.log(this.profesores)
              this.profesores = school.profesores.length;
              // console.log(this.profesores)
              this.profesoresArrayMaterias = [];
              school.profesores.forEach((profesor) => {
                
                let profesorAux: ProfesorReducido = {
                  nombre: profesor.nombre,
                  valor: false,
                };
                // console.log(profesorAux)
                this.profesoresArrayMaterias.push(profesorAux);
              });
              this.totalCursosColegio = [];
              school.cursos.forEach((cursos) => {
                this.totalCursosColegio.push(cursos.nombre);
              })
            })
          )
          .subscribe();
      }
    });
  }

  ngOnInit(): void {}

  // _______________________________________TURNOS______________________________________________________________

  // moduloArray: Modulo[] = [];

  // selectedModulo: Modulo = new Modulo();

  // openForEditModulo(modulo: Modulo) {
  //   this.selectedModulo = modulo;
  // }

  // addOrEditModulo() {
  //   this.horarioFinalizacionModulo = String(this.selectedModulo.inicio);
  //   this.horas = Number(this.horarioFinalizacionModulo.split(':')[0]);
  //   this.minutos =
  //     Number(this.horarioFinalizacionModulo.split(':')[1]) +
  //     this.duracionModulo;

  //   while (this.minutos >= 60) {
  //     this.minutos = this.minutos - 60;
  //     this.horas = this.horas + 1;
  //     if (this.horas == 24) {
  //       this.horas = 0;
  //     }
  //   }

  //   this.horarioFinalizacionModulo =
  //     String(this.horas) + ':' + String(this.minutos);
  //   if (this.selectedModulo.id == 0) {
  //     this.selectedModulo.id = this.moduloArray.length + 1;
  //     this.moduloArray.push(this.selectedModulo);

  //     // console.log(this.horarioFinalizacionModulo);
  //   }
  //   this.selectedModulo = new Modulo();
  // }

  // deleteModulo() {
  //   if (confirm('¿Estas seguro/a que quieres eliminar este modulo?')) {
  //     this.moduloArray = this.moduloArray.filter(
  //       (x) => x != this.selectedModulo
  //     );
  //     this.selectedModulo = new Modulo();
  //   }
  // }

  // async goFormAula() {
  //   let moduloArrayDiccionario: Array<any> = [];
  //   this.moduloArray.forEach((modulo) => {
  //     moduloArrayDiccionario.push({
  //       id: modulo.id,
  //       dia: modulo.dia,
  //       inicio: modulo.inicio,
  //     });
  //   });
  //   this.afs.collection('schools').doc(this.nombreDocumento).update({
  //     modulos: moduloArrayDiccionario,
  //   });
  // }

  // _______________________________________MODULOS______________________________________________________________

  moduloValido(horaInicial:string,horaFinal:string):string {
    //fuera de horario
    if (horaInicial < this.inicioHorario){
      return "Fuera de Horario"
    }
    if (horaFinal > this.finalizacionHorario){
      return "Fuera de Horario"
    }

    //fuera de turno
    if (this.turnoSeleccionado == "manana"){
      if (horaFinal > "12:00"){
        return "Fuera de Turno"
      }
    } else if (this.turnoSeleccionado == "tarde"){
      if (horaInicial < "12:00"){
        return "Fuera de Turno"
      }
      if (horaFinal > "18:00"){
        return "Fuera de Turno"
      }
    } else {
      if (horaInicial < "18:00"){
        return "Fuera de Turno"
      }
    }

    //modulos superpuestos
    for (let iModulos = 0; iModulos < this.turnosArray[this.turnoSeleccionado == "manana" ? 0 :this.turnoSeleccionado == "tarde" ? 1 : 2].modulos.length; iModulos++){
      let modulo: Modulo = this.turnosArray[this.turnoSeleccionado == "manana" ? 0 :this.turnoSeleccionado == "tarde" ? 1 : 2].modulos[iModulos];
      if (modulo.inicio <= horaInicial  && modulo.final > horaInicial){
        return "Modulos Superpuestos"
      }
      if (modulo.inicio < horaFinal && modulo.final >= horaFinal){
        return "Modulos Superpuestos"
      }
    }

    //valido
    return "valido"
  }

  addModulo() {

      let horaInicial: string = String(this.inicioModuloSeleccionado).split(':')[0]
      let minutosInicial: string = String(this.inicioModuloSeleccionado).split(':')[1]

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

      if(horaFinal.length == 1)   horaFinal = '0' + horaFinal;
      if(minutoFinal.length == 1) minutoFinal = '0' + minutoFinal;

      let inicio = horaInicial+":"+minutosInicial;
      let fin = horaFinal+":"+minutoFinal;

      if (this.moduloValido(inicio, fin) == "valido"){
        this.turnosArray[this.turnoSeleccionado == "manana" ? 0 :this.turnoSeleccionado == "tarde" ? 1 : 2].modulos.push(new Modulo(inicio, fin));
        this.inicioModuloSeleccionado = horaFinal + ":" + minutoFinal;
        this.turnosArray[this.turnoSeleccionado == "manana" ? 0 :this.turnoSeleccionado == "tarde" ? 1 : 2].modulos.sort((a, b) => (Number(a.inicio.split(':')[0])*60 + Number(a.inicio.split(':')[1]) > Number(b.inicio.split(':')[0])*60 + Number(b.inicio.split(':')[1]) ? 1 : -1));
      } else {
        alert(this.moduloValido(inicio, fin));
      }
      // confirm(String(this.inicioModuloSeleccionado));
      // this.horarioFinalizacionModulo = hsAux + ':' + minsAux;
      // this.horarios.push(this.horarioFinalizacionModulo);

      // if(this.crearHorarioManana){
      //   this.selectedTurno.horariosFinalManana.push(String(this.selectedTurno.inicio) + " - " + this.horarioFinalizacionModulo);
      //   if(this.mananaPrimerHorario){
      //     this.manana.turno = "manana";
      //     this.cantidadTurnos.push(this.manana);
      //     this.mananaPrimerHorario = false;
      //   }
      //   this.cantidadTurnos[0].cantModulos += 1;
      // }
      // else if(this.crearHorarioTarde){
      //   this.selectedTurno.horariosFinalTarde.push(String(this.selectedTurno.inicio) + " - " + this.horarioFinalizacionModulo);
      //   if(this.tardePrimerHorario){
      //     this.tarde.turno="tarde";
      //     this.cantidadTurnos.push(this.tarde);
      //     this.tardePrimerHorario = false;
      //   }
      //   this.cantidadTurnos[1].cantModulos += 1;
      // }
      // else{
      //   this.selectedTurno.horariosFinalNoche.push(String(this.selectedTurno.inicio) + " - " + this.horarioFinalizacionModulo);
      //   if(this.nochePrimerHorario){
      //     this.noche.turno="noche";
      //     this.cantidadTurnos.push(this.noche);
      //     this.nochePrimerHorario = false;
      //   }
      //   this.cantidadTurnos[2].cantModulos += 1;
      // }
      // // this.conjuntoDeTurnos.push(this.selectedTurno);
      // // this.turnoArray.push(this.conjuntoDeTurnos[this.conjuntoDeTurnos.length-1]);
      // this.turnoArray.push(this.selectedTurno)
      // this.selectedTurno = new HorarioModulo();
    
    // else{
    //   confirm('Ingrese un horario mayor de inicio');
    // }
  }

  turnoActual(turno: string){
    this.turnoSeleccionado = turno
  }

 async goFormAula() {

   let turnoArrayDiccionario: Array<any> = [];
   this.turnosArray.forEach((turno) => {
    let modulosTurno: Array<any> = [];
    turno.modulos.forEach((modulo) => {
      modulosTurno.push({
        inicio: modulo.inicio,
        final: modulo.final,
      })
    }) 
    turnoArrayDiccionario.push({
      turno: turno.turno,
      modulos: modulosTurno
    });
   });
   this.afs.collection('schools').doc(this.nombreDocumento).update({
     turnos: turnoArrayDiccionario,
   });
 }

  // _________________________________________AULAS____________________________________________________________

  aulaArray: Aula[] = [];

  selectedAula: Aula = new Aula();

  openForEditAula(aula: Aula) {
    this.selectedAula = aula;
  }

  addOrEditAula() {
    if (this.selectedAula.id == 0) {
      this.selectedAula.id = this.aulaArray.length + 1;
      this.aulaArray.push(this.selectedAula);
    }
    if(this.selectedAula.tipo == "Normal"){
      this.selectedAula.otro = "Se selecciono el tipo normal";
    }
    this.selectedAula = new Aula();
  }

  deleteAula() {
    if (confirm('¿Estas seguro/a que quieres eliminar este aula?')) {
      this.aulaArray = this.aulaArray.filter((x) => x != this.selectedAula);
      this.selectedAula = new Aula();
    }
  }

  async goFormCurso() {
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

  // _______________________________________CURSOS______________________________________________________________

  cursoArray: Curso[] = [];

  selectedCurso: Curso = new Curso();

  openForEditCurso(curso: Curso) {
    this.selectedCurso = curso;
  }

  addOrEditCurso() {
    if (this.selectedCurso.id == 0) {
      this.selectedCurso.id = this.cursoArray.length + 1;
      // this.materiasArrayCursos.forEach((materia) => {
      //   if (materia.valor == true) {
      //     this.selectedCurso.materiasCurso.push(materia.nombre);
      //   }
      // });
      this.cursoArray.push(this.selectedCurso);
    }
    this.selectedCurso = new Curso();
  }

  // clicked(nombreMateria: string) {
  //   for (let i = 0; i < this.materiasArrayCursos.length; i++) {
  //     if (
  //       this.materiasArrayCursos[i].nombre == nombreMateria &&
  //       this.materiasArrayCursos[i].valor == false
  //     ) {
  //       this.materiasArrayCursos[i].valor = true;
  //     } else if (
  //       this.materiasArrayCursos[i].nombre == nombreMateria &&
  //       this.materiasArrayCursos[i].valor == true
  //     ) {
  //       this.materiasArrayCursos[i].valor = false;
  //     }
  //   }
  // }

  deleteCurso() {
    if (confirm('¿Estas seguro/a que quieres eliminar este curso?')) {
      this.cursoArray = this.cursoArray.filter((x) => x != this.selectedCurso);
      this.selectedCurso = new Curso();
    }
  }

  async goFormProfesor() {
    let CursoArrayDiccionario: Array<any> = [];
    this.cursoArray.forEach((curso) => {
      CursoArrayDiccionario.push({
        // id: curso.id,
        nombre: curso.nombre,
        // turnoPreferido: curso.turnoPreferido,
        // cantAlumnos: curso.cantAlumnos,
        // materiasCurso: curso.materiasCurso,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      cursos: CursoArrayDiccionario,
    });
  }

  // _______________________________________PROFESORES__________________________________________________________

  profesorArray: Profesor[] = [];

  selectedProfesor: Profesor = new Profesor();

  openForEditProfesor(profesor: Profesor) {
    this.selectedProfesor = profesor;
  }

  addOrEditProfesor() {
    if (this.selectedProfesor.id == 0) {
      this.selectedProfesor.id = this.profesorArray.length + 1;
      this.profesorArray.push(this.selectedProfesor);
    }
    this.selectedProfesor = new Profesor();
  }

  deleteProfesor() {
    if (confirm('¿Estas seguro/a que quieres eliminar este profesor/a?')) {
      this.profesorArray = this.profesorArray.filter(
        (x) => x != this.selectedProfesor
      );
      this.selectedProfesor = new Profesor();
    }
  }

  async goFormMateria() {
    let ProfesorArrayDiccionario: Array<any> = [];
    this.profesorArray.forEach((profesor) => {
      ProfesorArrayDiccionario.push({
        // id: profesor.id,
        nombre: profesor.nombre,
        // dni: profesor.dni,
        // 'materias capacitado': profesor.materiasCapacitado,
        // turnoPreferido: profesor.turnoPreferido,
        // condiciones: profesor.condiciones,
      });
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      profesores: ProfesorArrayDiccionario,
    });
  }

  // _______________________________________MATERIAS____________________________________________________________

  materiaArray: Materia[] = [];

  selectedMateria: Materia = new Materia();

  openForEditMateria(materia: Materia) {
    this.selectedMateria = materia;
  }

  addOrEditMateria() {
    if (this.selectedMateria.id == 0) {
      this.selectedMateria.id = this.materiaArray.length + 1;
      this.profesoresArrayMaterias.forEach((profesor) => {
        if (profesor.valor == true) {
          this.selectedMateria.profesoresCapacitados.push(profesor.nombre);
        }
      });
      this.materiaArray.push(this.selectedMateria);
    }
    this.selectedMateria = new Materia();
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
      this.selectedMateria = new Materia();
    }
  }

  async goFormFinalizar() {
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

}
