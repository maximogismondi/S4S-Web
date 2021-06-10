import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  providers: [AuthService],
})
export class SendEmailComponent implements OnInit {
  public user$: Observable<any> = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSendEmail() {
    this.authSvc.sendVerificationEmail();
  }

  // async goToPage() {
  //   const user = await this.authSvc.user$;user && user.user?.emailVerified
  //   if (1) {
  //     this.router.navigate(['/eleccion']);
  //   } else {
  //     alert('No se ha verificado el email');
  //   }
  // }
}
