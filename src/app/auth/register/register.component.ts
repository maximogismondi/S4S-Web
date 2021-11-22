import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interface/user.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  // noVerificado: boolean = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      confirmarEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onRegister() {
    const { email, password, confirmarEmail } = this.registerForm.value;
    if(email.length > 10 && password.length > 5 && confirmarEmail.length > 10 && password == confirmarEmail) {
      const user = await this.authSvc.register(email, password);
      if (user) {
        this.router.navigate(['verificacion-email']);
      }
    }
    else{
      if(email.length == 0 && password.length == 0 && confirmarEmail.length == 0){
        alert("Rellene los campos vacios");
      }
      else if(email != confirmarEmail){
        alert("Los emails son distintos");
      }
      else if(email.length < 10){
        alert("El email debe ser mayor a los 10 digitos");
      }
      else if(confirmarEmail.length < 10){
        alert("El email a confirmar debe ser mayor a los 10 digitos");
      }
      else if(password.length < 5){
        alert("La contraseña debe ser mayor a los 5 digitos");
      }
      // else{
      //   alert("El email debe ser mayor a los 5 digitos y la contraseña debe ser mayor a los 5 digitos");
      // } 
    }
    
  }
}
