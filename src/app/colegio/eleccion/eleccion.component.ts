import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-eleccion',
  templateUrl: './eleccion.component.html',
  styleUrls: ['./eleccion.component.scss'],
  providers: [AuthService],
})
export class EleccionComponent implements OnInit {
  NombreColegio: string;
  fueACrear:boolean = false;
  fueAUnirse:boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore
  ) {
    authSvc.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs.firestore
          .collection('schools')
          .where('userAdmin', '==', user.uid)
          .get()
          .then((data) => {
            this.NombreColegio = data.docs[0].data().nombre;
          });
      }
    });
  }

  crearColegioForm: FormGroup;
  unirseColegioForm: FormGroup;

  ngOnInit(): void {
    this.crearColegioForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      localidad: ['', Validators.required],
      telefono: ['', Validators.required],
      duracionModulo: ['', Validators.required],
      inicioHorario: ['', Validators.required],
      finalizacionHorario: ['', Validators.required],
    });

  }

  async generaNss() {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < characters.length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  id = this.generaNss();

  //joya
  async onCrear() {
    const {
      nombre,
      direccion,
      localidad,
      telefono,
      duracionModulo,
      inicioHorario,
      finalizacionHorario,
    } = this.crearColegioForm.value;
    const school = await this.authSvc.createSchool(
      nombre,
      direccion,
      localidad,
      telefono,
      duracionModulo,
      inicioHorario,
      finalizacionHorario,
      await this.id
    );
  }

  //joya
  irCrear() {
    // document.getElementById('crear')!.style.display = 'block';
    // document.getElementById('unirse')!.style.display = 'none';
    // document.getElementById('botonesEleccionCrear')!.style.display = 'none';
    // document.getElementById('botonesEleccionUnirse')!.style.display = 'block';
    this.fueACrear = true;
    this.fueAUnirse = false;
  }

  //joya
  irUnirse() {
    // document.getElementById('crear')!.style.display = 'none';
    // document.getElementById('unirse')!.style.display = 'block';
    // document.getElementById('botonesEleccionCrear')!.style.display = 'block';
    // document.getElementById('botonesEleccionUnirse')!.style.display = 'none';
    this.fueAUnirse = true;
    this.fueACrear = false;
  }

}
