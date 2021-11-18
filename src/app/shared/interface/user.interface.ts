export class User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
}

// export class UserDataExtra{
//   usuario: string;
//   tema: boolean;
// }

export class Colegio {
  id: string;
  userAdmin: string;
  nombre: string;
  color: string;
  localidad: string;
  provincia: string;
  telefono: string;
  duracionModulo: number;
  usuariosExtensiones: Array<string>;
  aulas: Array<Aula>;
  turnos: Array<Turno>;
  materias: Array<Materia>;
  cursos: Array<Curso>;
  profesores: Array<Profesor>;
}

export class Turno {
  turno: string;
  inicio: string;
  finalizacion: string;
  habilitado: boolean;
  modulos: Array<Modulo> = [];
  constructor(turno: string) {
    this.turno = turno;
  }
}

export class Modulo {
  inicio: string;
  final: string;
  tipo: string = "clase";
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
    const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
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
  cantidadDeModulosTotal: number;
  cantidadMaximaDeModulosPorDia: number;
  cantidadMinimaDeModulosPorDia: number;
  profesorSimultaneo: boolean = false;
  materiaEspecial: boolean = false;
  curso: string = '';
  profesoresCapacitados: Array<string> = [];
  aulasMateria: Array<string> = [];
  constructor() {
    this.profesoresCapacitados = [];
    this.aulasMateria = [];
  }
}
