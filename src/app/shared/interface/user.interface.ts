import { Time } from "@angular/common";

export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  // eleccion: boolean;
  // colegios: Array<string>;
}

// export interface UserData extends User {
//   colegios: Array<string>;
// }

export interface Colegio {
  id: string;
  userAdmin: string;
  nombre: string;
  direccion: string;
  localidad: string;
  telefono: string;
  duracionModulo: number;
  inicioHorario: Time;
  finalizacionHorario: Time;
  usuariosExtensiones: Array<string>;
  aulas: Array<Aula>;
  modulos: Array<Modulo>;
  cursos: Array<Curso>;
  profes: Array<Profesor>;
}

export class Aula {
  id: number = 0;
  nombre: string;
  tipo: number;
}

export interface Modulo {
  id: string;
  dia: string;
  inicio: number;
}

export interface Curso {
  id: string;
  nombre: string;
  turnoPreferido: number;
  cantAlumnos: number;
  materiasCurso: Array<Materia>;
}

export interface Profesor {
  id: string;
  nombre: string;
  dni: number;
  materiasCapacitado: Array<string>;
  turnoPreferido: number;
  condiciones: Map<string, any>;
}

export interface Materia {
  id: string;
  nombre: string;
  cantModulos: number;
  cantProfesores: number;
  espacioEntreDias: number;
  tipoAula: number;
  cantidadModulosContinuos: number;
}
