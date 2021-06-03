import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
  }

  gotoEleccion() {
    this.router.navigate(['/eleccion']);
  }

  onRegister(){
    console.log('Form =>', this.registerForm.value);
  }
}
