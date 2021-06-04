import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers:[AuthService]
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;

/*
  registerForm= new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
*/
  constructor(private router: Router, private fb: FormBuilder, private authSvc:AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
  }
/* 
  gotoEleccion() {
    this.router.navigate(['/eleccion']);
  }
*/
  async onRegister(){
    const{email, password} =this.registerForm.value;
      const user = await this.authSvc.register(email, password);
      if(user){
        this.router.navigate(['/eleccion']);
      }
  }
}
