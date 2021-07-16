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
  noVerificado: boolean = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private afs: AngularFirestore
    ) {
      authSvc.afAuth.authState.subscribe((user) => {
        if (!user) {
          this.noVerificado = false;
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
    const user = await this.authSvc.login(email, password);
    if (user && user.emailVerified) {
      this.router.navigate(['/menu-principal']);
    } else if (user) {
      this.router.navigate(['/verificacion-email']);
    }
  }

  async onGoogleLogin() {
    if (await this.authSvc.loginGoogle()) {
      this.router.navigate(['/menu-principal']);
    }
  }
}
