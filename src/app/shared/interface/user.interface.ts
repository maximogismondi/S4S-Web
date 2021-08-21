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
  ejecutado: string;
  direccion: string;
  localidad: string;
  telefono: string;
  duracionModulo: number;
  inicioHorario: Time;
  finalizacionHorario: Time;
  usuariosExtensiones: Array<string>;
  aulas: Array<Aula>;
  turnos: Array<Turno>;
  // modulos: Array<Modulo>;
  materias: Array<Materia>;
  cursos: Array<Curso>;
  profesores: Array<Profesor>;
}

export class Turno{
  cantModulos: number = 0;
  turno: string;
}

export class HorarioModulo{
  inicio: Time;
  fin: string;
  horariosFinalManana: Array<string> = [];
  horariosFinalTarde: Array<string> = [];
  horariosFinalNoche: Array<string> = [];
}

// export class Modulo {
//   id: number = 0;
//   dia: string;
//   inicio: Time;
// }

export class Aula {
  id: number = 0;
  nombre: string;
  tipo: string;
  otro: string = "Se selecciono el tipo normal";
}

export class Curso {
  id: number = 0;
  nombre: string;
  // turnoPreferido: number;
  // cantAlumnos: number;
  // materiasCurso: Array<string> = [];
}

export class Profesor {
  id: number = 0;
  nombre: string;
  // dni: number;
  // materiasCapacitado: Array<string>;
  // turnoPreferido: number;
  // condiciones: Array<string>;
  // condiciones: Map<string, any>;
}

export class ProfesorReducido{
  nombre: string;
  valor: boolean;
}

export class Materia {
  id: number = 0;
  nombre: string;
  cantidadDeModulosTotal: number;
  // cantProfesores: number;
  // espacioEntreDias: number;
  // tipo: string;
  // otro: string = "Se selecciono el tipo normal";
  cantidadMaximaDeModulosPorDia: number;
  cursoDado: string;
  profesoresCapacitados: Array<string> = [];
}

// export class MateriaReducido{
//   nombre: string;
//   valor: boolean;
// }
