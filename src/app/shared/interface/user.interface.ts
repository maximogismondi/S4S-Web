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
  provincia: string;
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
  materias: Array<string> = [];
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
      turnoArray.forEach((turno) => {
        mapDisponibilidad[dia][turno.turno] = {};
        turno.modulos.forEach((modulo) => {
          mapDisponibilidad[dia][turno.turno][modulo.inicio] = false;
        });
      });
    });
    this.disponibilidad = mapDisponibilidad;
  }
}

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
  }

}
