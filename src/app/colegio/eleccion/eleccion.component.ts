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

  ngOnInit(): void {
    this.crearColegioForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      localidad: ['', Validators.required],
      telefono: ['', Validators.required],
    });
  }

  //joya
  async onCrear() {
    const { nombre, direccion, localidad, telefono } = this.crearColegioForm.value;
    const school = await this.authSvc.createSchool(
      nombre,
      direccion,
      localidad,
      telefono
    );
  }

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
