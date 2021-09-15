import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly url:string = "https://s4s-algoritmo.herokuapp.com/";
  public idHorarioGenerado:string = "";

  constructor(privatehttp: HttpClient ,private authS: AuthService) {
  }

  llamarAlgoritmo(http: HttpClient, authS: AuthService){
    let uid = authS.userData.uid;
    http.post<string>(this.url + "/ayuda?id=" + uid, {}).subscribe((data) => {
      this.idHorarioGenerado = data;
     })
  }
}