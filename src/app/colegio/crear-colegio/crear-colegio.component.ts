import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Aula, Curso, Materia, Modulo, Profesor } from 'src/app/shared/interface/user.interface';

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
  finalizacionModulo: Time;
  paradoActualmente: string = 'Modulos';
  // modulos: number;
  // aulas: number;
  // materias: number;
  // cursos: number;
  // profes: number;
  
  

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore
  ) {
    authSvc.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs.firestore
          .collection('schools')
          .where('userAdmin', '==', user.uid)
          .get()
          .then((data) => {
            this.nombreColegio = data.docs[0].data().nombre;
            this.nombreDocumento = data.docs[0].data().id;
            this.duracionModulo = data.docs[0].data().duracionModulo;
            // this.modulos = data.docs[0].data().modulos.length;
            // this.aulas = data.docs[0].data().aulas.length;
            // this.materias = data.docs[0].data().materias.length;
            // this.cursos = data.docs[0].data().cursos.length;
            // this.profes = data.docs[0].data().profes.length;
          });
      }
    });

    // this.afs.collection("schools").doc(this.nombreDocumento).update({emailVerified: true,aulas:this.aulaArray});
  }

  // infoGralForm: FormGroup;

  // _______________________________________MODULOS______________________________________________________________

  moduloArray: Modulo[] = [];

  selectedModulo: Modulo = new Modulo();

  openForEditModulo(modulo: Modulo) {
    this.selectedModulo = modulo;
  }

  addOrEditModulo() {
    if (this.selectedModulo.id == 0) {
      this.selectedModulo.id = this.moduloArray.length + 1;
      this.moduloArray.push(this.selectedModulo);
    }
    this.selectedModulo = new Modulo();
  }

  deleteModulo() {
    if (confirm('¿Estas seguro/a que quieres eliminar este modulo?')) {
      this.moduloArray = this.moduloArray.filter(
        (x) => x != this.selectedModulo
      );
      this.selectedModulo = new Modulo();
    }
  }

  async goFormAula() {
    document.getElementById('divModulo')!.style.display = 'none'; //cambiar esto
    document.getElementById('divAula')!.style.display = 'block';
    document.getElementById('barraDeProgreso')!.style.width = '28%';
    this.paradoActualmente = 'Aulas';
    let moduloArrayDiccionario:Array<any> = [];
    this.moduloArray.forEach(modulo => {
      moduloArrayDiccionario.push({"id": modulo.id,"dia": modulo.dia, "inicio": modulo.inicio})
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      modulos: moduloArrayDiccionario
    });
  }

  // _________________________________________AULAS____________________________________________________________

  aulaArray: Aula[] = [
    // {id:1, nombre: "1A", tipo:1},
    // {id:2, nombre: "1B", tipo:1},
    // {id:3, nombre: "1C", tipo:1}
  ];

  selectedAula: Aula = new Aula();

  openForEditAula(aula: Aula) {
    this.selectedAula = aula;
  }

  addOrEditAula() {
    if (this.selectedAula.id == 0) {
      this.selectedAula.id = this.aulaArray.length + 1;
      this.aulaArray.push(this.selectedAula);
    }
    this.selectedAula = new Aula();
  }

  deleteAula() {
    if (confirm('¿Estas seguro/a que quieres eliminar esta aula?')) {
      this.aulaArray = this.aulaArray.filter((x) => x != this.selectedAula);
      this.selectedAula = new Aula();
    }
  }

  async goFormMateria(){
    document.getElementById('divAula')!.style.display = 'none';
    document.getElementById('divMateria')!.style.display = 'block';
    document.getElementById('barraDeProgreso')!.style.width = '47%';
    this.paradoActualmente = 'Materias';
    let aulaArrayDiccionario:Array<any> = [];
    this.aulaArray.forEach(aula => {
      aulaArrayDiccionario.push({"id": aula.id,"nombre": aula.nombre, "tipo": aula.tipo})
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      aulas: aulaArrayDiccionario
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
      this.materiaArray.push(this.selectedMateria);
    }
    this.selectedMateria = new Materia();
  }

  deleteMateria() {
    if (confirm('¿Estas seguro/a que quieres eliminar esta materia?')) {
      this.materiaArray = this.materiaArray.filter((x) => x != this.selectedMateria);
      this.selectedMateria = new Materia();
    }
  }

  async goFormCurso(){
    document.getElementById('divMateria')!.style.display = 'none';
    document.getElementById('divCurso')!.style.display = 'block';
    document.getElementById('barraDeProgreso')!.style.width = '61%';
    this.paradoActualmente = 'Cursos';
    let materiaArrayDiccionario:Array<any> = [];
    this.materiaArray.forEach(materia => {
      materiaArrayDiccionario.push({"id": materia.id,"nombre": materia.nombre, "cantModulos": materia.cantModulos, "cantProfesores": materia.cantProfesores, "espacioEntreDias": materia.espacioEntreDias, "tipoAula": materia.tipoAula, "cantidadModulosContinuos": materia.cantidadModulosContinuos})
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      materias: materiaArrayDiccionario
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
      this.cursoArray.push(this.selectedCurso);
    }
    this.selectedCurso = new Curso();
  }

  deleteCurso() {
    if (confirm('¿Estas seguro/a que quieres eliminar este curso?')) {
      this.cursoArray = this.cursoArray.filter(
        (x) => x != this.selectedCurso
      );
      this.selectedCurso = new Curso();
    }
  }

  async goFormProfesor() {
    document.getElementById('divCurso')!.style.display = 'none';
    document.getElementById('divProfesor')!.style.display = 'block';
    document.getElementById('barraDeProgreso')!.style.width = '82%';
    this.paradoActualmente = 'Profesores';
    let CursoArrayDiccionario:Array<any> = [];
    this.cursoArray.forEach(curso => {
      CursoArrayDiccionario.push({"id": curso.id,"nombre": curso.nombre, "turnoPreferido": curso.turnoPreferido, "cantAlumnos": curso.cantAlumnos, "materiasCurso": curso.materiasCurso})
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      modulos: CursoArrayDiccionario
    });
  }

  // _______________________________________PROFES______________________________________________________________

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
    if (confirm('¿Estas seguro/a que quieres eliminar este curso?')) {
      this.profesorArray = this.profesorArray.filter(
        (x) => x != this.selectedProfesor
      );
      this.selectedProfesor = new Profesor();
    }
  }

  async goFormFinalizar() {
    document.getElementById('divProfesor')!.style.display = 'none';
    document.getElementById('divFinalizar')!.style.display = 'block';
    document.getElementById('barraDeProgreso')!.style.width = '100%';
    this.paradoActualmente = 'Finalizar';
    let ProfesorArrayDiccionario:Array<any> = [];
    this.profesorArray.forEach(profesor => {
      ProfesorArrayDiccionario.push({"id": profesor.id,"nombre": profesor.nombre, "dni": profesor.dni, "materias capacitado": profesor.materiasCapacitado, "turnoPreferido": profesor.turnoPreferido, "condiciones": profesor.condiciones})
    });
    this.afs.collection('schools').doc(this.nombreDocumento).update({
      modulos: ProfesorArrayDiccionario
    });
  }

  ngOnInit(): void {
    // this.infoGralForm = this.fb.group({
    //   duracionModulo: ['', Validators.required],
    //   InicioHorario: ['', Validators.required],
    //   FinalizacionHorario: ['', Validators.required],
    //   cantCursos: ['', Validators.required],
    //   cantProfes: ['', Validators.required],
    //   cantMaterias: ['', Validators.required]
    // });
  }

  // async infoGralNext(){
  //   const { duracionModulo, InicioHorario, FinalizacionHorario, cantCursos, cantProfes, cantMaterias} = this.infoGralForm.value;
  //   const infoSchool = await this.authSvc.infoSchoolGeneral(
  //     duracionModulo,
  //     InicioHorario,
  //     FinalizacionHorario,
  //     cantCursos,
  //     cantProfes,
  //     cantMaterias,
  //     await this.id
  //   );
  // }
}
