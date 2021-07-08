import { Component, OnInit } from '@angular/core';
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
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService
  ) {}

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

    // this.unirseColegioForm = this.fb.group({
    //   codigoColegio: ['', Validators.required],
    // });
  }

  async generaNss() {
    let result = '';
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
    const { nombre, direccion, localidad, telefono, duracionModulo, inicioHorario, finalizacionHorario} = this.crearColegioForm.value;
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

  // async onUnirse(){
  //   const { codigoColegio } = this.unirseColegioForm.value;
  //   const school = await this.authSvc.joinSchool(
  //     codigoColegio
  //   );
  // }

  irCrear() {
    document.getElementById('crear')!.style.display = 'block';
    document.getElementById('unirse')!.style.display = 'none';
    document.getElementById('botonesEleccionCrear')!.style.display = 'none';
    document.getElementById('botonesEleccionUnirse')!.style.display = 'block';
  }

  irUnirse() {
    document.getElementById('crear')!.style.display = 'none';
    document.getElementById('unirse')!.style.display = 'block';
    document.getElementById('botonesEleccionCrear')!.style.display = 'block';
    document.getElementById('botonesEleccionUnirse')!.style.display = 'none';
  }

  // gotoCrear() {
  //   this.router.navigate(['/crear-colegio']);
  // }

  // gotoEleccion() {
  //   this.router.navigate(['/eleccion']);
  //   document.getElementById('botonesEleccionCrear')!.style.display = 'block';
  //   document.getElementById('botonesEleccionUnirse')!.style.display = 'block';
  //   document.getElementById('crear')!.style.display = 'none';
  //   document.getElementById('unirse')!.style.display = 'none';
  // }
}
