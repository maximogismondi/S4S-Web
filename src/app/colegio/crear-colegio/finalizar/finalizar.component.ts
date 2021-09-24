import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  Aula,
  Colegio,
  Curso,
  Materia,
  Profesor,
  Turno,
  Modulo,
  // ProfesorReducido,
  // HorarioModulo,
  // MateriaReducido,
} from 'src/app/shared/interface/user.interface';
import { ColegioService } from '../../services/colegio.service';

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.scss']
})
export class FinalizarComponent implements OnInit {
  constructor(
    private colegioSvc: ColegioService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

    // _______________________________________FINALIZAR____________________________________________________________
    botonPresionado: boolean = false;
    async finalizar() {
      this.http
        .get(
          'https://s4s-algoritmo.herokuapp.com/algoritmo?idColegio=' +
            this.colegioSvc.nombreDocumento,
          { responseType: 'text' }
        )
        .subscribe((data) => {
          console.log(data);
        });
        this.http
        .get(
          'https://apis.datos.gob.ar/georef/api/provincias', {responseType: 'json'}
        )
        .subscribe((data) => {
          console.log(data);
        });
      this.botonPresionado = true;
    }
}
