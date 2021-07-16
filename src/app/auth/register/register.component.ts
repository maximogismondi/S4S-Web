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
    private afs: AngularFirestore
  ) {
    // authSvc.afAuth.authState.subscribe((user) => {
    //   if (!user) {
    //     this.noVerificado = false;
    //   }
    // });
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onRegister() {
    const { email, password } = this.registerForm.value;
    const user = await this.authSvc.register(email, password);
    if (user) {
      this.router.navigate(['/verificacion-email']);
    }
    
  }
}
