import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuthService],
})
export class HomeComponent implements OnInit {
  windowScrollInY: number = 0;

  constructor(
    private router: Router,
    public authSvc: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    window.onscroll = () => {
      this.windowScrollInY = window.scrollY;
    };
  }

  // gotoLogin() {}

  functionScrollToUp() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
