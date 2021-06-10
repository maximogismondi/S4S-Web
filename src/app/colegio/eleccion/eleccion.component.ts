import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eleccion',
  templateUrl: './eleccion.component.html',
  styleUrls: ['./eleccion.component.scss'],
})
export class EleccionComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  gotoEleccion() {
    this.router.navigate(['/eleccion']);
    document.getElementById('botonesEleccionCrear')!.style.display = 'block';
    document.getElementById('botonesEleccionUnirse')!.style.display = 'block';
    document.getElementById('crear')!.style.display = 'none';
    document.getElementById('unirse')!.style.display = 'none';
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

  gotoCrear() {
    this.router.navigate(['/crear-colegio']);
  }
}
