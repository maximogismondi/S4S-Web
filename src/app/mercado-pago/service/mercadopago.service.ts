import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {

  constructor(private http: HttpClient) { }

  // createPreference(cantidadCursos: number, escuela: string): Promise<any> {
  //   const headers = {
  //     Authorization: `Bearer APP_USR-2706885163404337-101513-1d9906c97a2c3067664dce6bad38248b-457911102`
  //   }

  //   let preference = {
  //     items: [{
  //       title: `${escuela} - cantidad de cursos a pagar: ${cantidadCursos} - S4Schools`,
  //       unit_price: 1,
  //       quantity: cantidadCursos,
  //     }],
  //     back_urls: {
  //       "success": `http://localhost:4200/${escuela}/crear-colegio/turnos`,
  //       "failure": `http://localhost:4200/${escuela}/crear-colegio/turnos`,
  //       "pending": `http://localhost:4200/${escuela}/crear-colegio/turnos`
  //     },
  //     auto_return: 'approved',
  //     payment_methods: {
  //       excluded_payment_types: [
  //           {
  //               id: "ticket"
  //           }
  //       ],
  //       installments: 1
  //     }
  //   };

  //   return this.http.post('https://api.mercadopago.com/checkout/preferences', preference, {headers}).toPromise();
  // }
}
