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

export interface Colegio{
  nombre: string;
  direccion: string;
  localidad: string;
  telefono: string;
  usuariosExtensiones: Array<string>;
  codigo_Id: string;
  userAdmin: string;
}
