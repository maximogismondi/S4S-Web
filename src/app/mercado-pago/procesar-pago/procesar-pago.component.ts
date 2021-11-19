// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { ActivatedRoute, Router } from '@angular/router';
// import { map } from 'rxjs/operators';
// import { ColegioService } from '../../colegio/services/colegio.service';

// @Component({
//   selector: 'app-procesar-pago',
//   templateUrl: './procesar-pago.component.html',
//   styleUrls: ['./procesar-pago.component.scss'],
// })
// export class ProcesarPagoComponent implements OnInit {
//   constructor(
//     public colegioSvc: ColegioService,
//     private activatedRoute: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.activatedRoute.queryParams.subscribe(async (params) => {
//       if (params['status'] == 'approved') {
//         this.colegioSvc.botonesCrearColegio = 6;
//         this.colegioSvc.pagoFinalizado = true;
//         // this.router.navigate(['/' + this.colegioSvc.nombreColegio + '/crear-colegio']);
//       } else {
//         alert('Error de Pago: GbFH6dhd84HSKfaWJWN7772yk7JGOD');
//         this.colegioSvc.botonesCrearColegio = 1;
//       }
//     });
//   }
// }
