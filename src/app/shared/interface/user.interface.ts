import { Time } from "@angular/common";

export class User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
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
  materias: Array<Materia>;
  cursos: Array<Curso>;
  profes: Array<Profesor>;
}

export class Modulo {
  id: number = 0;
  dia: string;
  inicio: Time;
}

export class Aula {
  id: number = 0;
  nombre: string;
  tipo: number;
}

export class Materia {
  id: number = 0;
  nombre: string;
  cantModulos: number;
  cantProfesores: number;
  espacioEntreDias: number;
  tipoAula: number;
  cantidadModulosContinuos: number;
}

export class Curso {
  id: number = 0;
  nombre: string;
  turnoPreferido: number;
  cantAlumnos: number;
  materiasCurso: Array<string>;
}

export class Profesor {
  id: number = 0;
  nombre: string;
  dni: number;
  materiasCapacitado: Array<string>;
  turnoPreferido: number;
  condiciones: Array<string>;
  // condiciones: Map<string, any>;
}
