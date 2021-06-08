import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  gotoLogin(){
    
    if(1){
      this.router.navigate(['/login']);
    }
    /*else if(user no hizo verificacion){
      this.router.navigate(['/verificacion-email']);
    } */
    /*else if(user ya eligio){
      this.router.navigate(['/paginaPrincipal']);
    } */
    else{ 
      this.router.navigate(['/eleccion']);
    }
    
  }

  functionScrollToDownMoreInfo(){

    window.scrollTo({
      top: 1400,
      left: 0,
      behavior: "smooth"
    });
    
  }

  functionScrollToDown(){
    //window.scrollTo(0,0);
    
    window.scrollTo({
      top: 623,
      left: 0,
      behavior: "smooth"
    });

    //$("button","#buttonScrollToDown").animate({scrollTop: 50},"slow");
  }

  functionScrollToUp(){

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }
}

