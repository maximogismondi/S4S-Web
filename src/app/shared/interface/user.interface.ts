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
  // ejecutado: string;
  direccion: string;
  localidad: string;
  telefono: string;
  duracionModulo: number;
  inicioHorario: string;
  finalizacionHorario: string;
  botonesCrearColegioProgreso: number;
  // botonesCrearColegio: number;
  usuariosExtensiones: Array<string>;
  aulas: Array<Aula>;
  turnos: Array<Turno>;
  // modulos: Array<Modulo>;
  materias: Array<Materia>;
  cursos: Array<Curso>;
  profesores: Array<Profesor>;
}

export class Turno {
  turno: string;
  modulos: Array<Modulo> = [];
  constructor(turno: string) {
    this.turno = turno;
  }
}

export class Modulo {
  inicio: string;
  final: string;
  constructor(inicio: string, final: string) {
    this.inicio = inicio;
    this.final = final;
  }
}

// export class Turno{
//   cantModulos: number = 0;
//   turno: string;
// }

// export class HorarioModulo{
//   inicio: Time;
//   fin: string;
//   horariosFinalManana: Array<string> = [];
//   horariosFinalTarde: Array<string> = [];
//   horariosFinalNoche: Array<string> = [];
// }

// export class Modulo {
//   id: number = 0;
//   dia: string;
//   inicio: Time;
// }

export class Aula {
  id: number = 0;
  nombre: string = '';
  tipo: string = '';
  otro: string = 'normal';
  // Se selecciono el tipo normal
}

export class Curso {
  id: number = 0;
  nombre: string = '';
  turnoPreferido: string = '';
  cantAlumnos: string = '';
  // materiasCurso: Array<string> = [];
}

export class Profesor {
  id: number = 0;
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  disponibilidad: any = {};
  constructor(turnoArray: Array<Turno>) {
    let mapDisponibilidad: any = {};
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    dias.forEach((dia) => {
      mapDisponibilidad[dia] = {};
      console.log(turnoArray)
      turnoArray.forEach((turno) => {
        mapDisponibilidad[dia][turno.turno] = {};
        turno.modulos.forEach((modulo) => {
          mapDisponibilidad[dia][turno.turno][modulo.inicio] = true;
        });
      });
    });
    this.disponibilidad = mapDisponibilidad;
  }

  // materiasCapacitado: Array<string>;
  // turnoPreferido: number;
  // condiciones: Array<string>;
  // condiciones: Map<string, any>;
}

export class ProfesorReducido {
  nombre: string;
  valor: boolean;
}

export class Materia {
  id: number = 0;
  nombre: string = '';
  cantidadDeModulosTotal: string = '';
  // cantProfesores: number;
  // espacioEntreDias: number;
  // tipo: string;
  // otro: string = "Se selecciono el tipo normal";
  cantidadMaximaDeModulosPorDia: string = '';
  curso: string = '';
  // profesoresCapacitados: Array<string> = [];
  profesoresCapacitados: any = {};
  constructor(profesorArray: Array<Profesor>) {
    let mapProfesoresCapacitados: any = {};
    profesorArray.forEach((profesor) => {
      mapProfesoresCapacitados[profesor.nombre] = false;
    });

    this.profesoresCapacitados = mapProfesoresCapacitados;
  }
}

// export class MateriaReducido{
//   nombre: string;
//   valor: boolean;
// }
