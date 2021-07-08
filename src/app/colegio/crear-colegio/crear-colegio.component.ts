import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Aula } from 'src/app/shared/interface/user.interface';

@Component({
  selector: 'app-crear-colegio',
  templateUrl: './crear-colegio.component.html',
  styleUrls: ['./crear-colegio.component.scss'],
  providers: [AuthService],
})
export class CrearColegioComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService
  ) {}

  infoGralForm: FormGroup;
  
  aulaArray: Aula[] = [
    // {id:1, nombre: "1A", tipo:1},
    // {id:2, nombre: "1B", tipo:1},
    // {id:3, nombre: "1C", tipo:1}
  ];

  selectedAula: Aula = new Aula();

  openForEdit(aula: Aula){
    this.selectedAula = aula;
  }

  addOrEdit(){  
    if(this.selectedAula.id == 0){
      this.selectedAula.id = this.aulaArray.length+1;
      this.aulaArray.push(this.selectedAula);
    }
    this.selectedAula = new Aula();
  }

  delete(){
    if(confirm('¿Estas seguro/a que quieres eliminar esta aula?')){
      this.aulaArray = this.aulaArray.filter(x => x != this.selectedAula);
      this.selectedAula = new Aula();
    }
  }

  ngOnInit(): void {
    // this.infoGralForm = this.fb.group({
    //   duracionModulo: ['', Validators.required],
    //   InicioHorario: ['', Validators.required],
    //   FinalizacionHorario: ['', Validators.required],
    //   cantCursos: ['', Validators.required],
    //   cantProfes: ['', Validators.required],
    //   cantMaterias: ['', Validators.required]
    // });
  }

   

  // async infoGralNext(){
  //   const { duracionModulo, InicioHorario, FinalizacionHorario, cantCursos, cantProfes, cantMaterias} = this.infoGralForm.value;
  //   const infoSchool = await this.authSvc.infoSchoolGeneral(
  //     duracionModulo,
  //     InicioHorario,
  //     FinalizacionHorario,
  //     cantCursos,
  //     cantProfes,
  //     cantMaterias,
  //     await this.id
  //   );
  // }
}
