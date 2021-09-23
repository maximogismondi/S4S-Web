import { EAFNOSUPPORT } from "constants";

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
  inicioHorario: string;
  finalizacionHorario: string;
  botonesCrearColegioProgreso: number;
  usuariosExtensiones: Array<string>;
  aulas: Array<Aula>;
  turnos: Array<Turno>;
  materias: Array<Materia>;
  cursos: Array<Curso>;
  profesores: Array<Profesor>;
  // ejecutado: string;
  // botonesCrearColegio: number;
  // modulos: Array<Modulo>;
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
  diasHechos: Array<DiasHechos>;
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
      // console.log(turnoArray)
      turnoArray.forEach((turno) => {
        mapDisponibilidad[dia][turno.turno] = {};
        turno.modulos.forEach((modulo) => {
          mapDisponibilidad[dia][turno.turno][modulo.inicio] = false;
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

// export class ProfesorReducido {
//   nombre: string;
//   valor: boolean;
// }

export class Materia {
  id: number = 0;
  nombre: string = '';
  cantidadDeModulosTotal: string = '';
  cantidadMaximaDeModulosPorDia: string = '';
  curso: string = '';
  profesoresCapacitados: any = {};
  aulasMateria: any = {};

  constructor(profesorArray: Array<Profesor>, aulaArray: Array<Aula>) {
    // let mapProfesoresCapacitados: any = {};
    // let mapAulaMateria: any = {};
    this.profesoresCapacitados = {};
    this.aulasMateria = {};

    profesorArray.forEach((profesor) => {
      this.profesoresCapacitados[profesor.nombre + ' ' + profesor.apellido] = false;
    });

    aulaArray.forEach((aula) => {
      this.aulasMateria[aula.nombre] = false;
    });

    // this.profesoresCapacitados = mapProfesoresCapacitados;
    // this.aulasMateria = mapAulaMateria;
    // cantProfesores: number;
    // espacioEntreDias: number;
    // tipo: string;
    // otro: string = "Se selecciono el tipo normal";
    // profesoresCapacitados: Array<string> = [];
  }
  // export class MateriaReducido{
  //   nombre: string;
  //   valor: boolean;
  // }
}
export class MananaHecha{
  nombreMateria: string;
  aulaMateria: string;
}
export class TardeHecha{
  nombreMateria: string;
  aulaMateria: string;
}
export class NocheHecha{
  nombreMateria: string;
  aulaMateria: string;
}
export class DiasHechos{
  nombre: string;
  turnoManana: Array<MananaHecha>;
  turnoTarde: Array<TardeHecha>;
  turnoNoche: Array<NocheHecha>;

}
export interface HorariosHechos{
  horarios: Array<Curso>;
}
