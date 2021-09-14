import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly url:string ="http://localhost:3300";
  public idHorarioGenerado:string;

  constructor(private http: HttpClient,private authS: AuthService) {
    let uid = authS.userData.uid;
    http.get<string>(this.url + "/algoritmo/" + uid).subscribe((data) => {
     this.idHorarioGenerado = data;
    })
  }}