import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  verificado: boolean = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore
    ) {
      authSvc.afAuth.authState.subscribe((user) => {
        if (!user) {
          this.verificado = false;
        }
      });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;
    if(email.length > 10 && password.length > 5) {
      const user = await this.authSvc.login(email, password);
      if (user && user.emailVerified) {
        this.router.navigate(['/menu-principal']);
      }
    }
    else{
      if(email.length == 0 && password.length == 0){
        alert("Rellene los campos vacios");
      }
      else if(email.length < 10){
        alert("El email debe ser mayor a los 10 digitos");
      }
      else if(password.length < 5){
        alert("La contraseña debe ser mayor a los 5 digitos");
      }
      else if(email.length < 10 && password.length < 5){
        alert("El email debe ser mayor a los 10 digitos y la contraseña debe ser mayor a los 5 digitos");
      }
    }
    // else if (user && user.emailVerified == false) {
    //   this.router.navigate(['/verificacion-email']);
    // }
    // else{
    //  if(confirm("Este ususario no existe ¿Desea registrarse?")){
    //   this.router.navigate(['/register']);
    //   }
    // }
  }

  async onGoogleLogin() {
    if (await this.authSvc.loginGoogle()) {
      this.router.navigate(['/menu-principal']);
    }
  }

  // onSendEmail() {
  //   this.authSvc.sendVerificationEmail();
  // }
}
