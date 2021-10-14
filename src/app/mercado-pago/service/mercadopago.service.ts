import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {

  constructor(private http: HttpClient) { }

  createPreference(cantidadCursos: number, escuela: string): Promise<any> {
    const headers = {
      Authorization: `Bearer TEST-2483069801956454-101216-eb9ad32d23c813bc9e019d954e121482-127906426`
    }

    let preference = {
      items: [{
        title: `${escuela} - cantidad de cursos a pagar: ${cantidadCursos} - S4S`,
        unit_price: 100,
        quantity: cantidadCursos,
      }],
      back_urls: {
        "success": "http://localhost:4200/procesar-pago",
        "failure": "http://localhost:4200/procesar-pago",
        "pending": "http://localhost:4200/procesar-pago"
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [
            {
                id: "ticket"
            }
        ],
        installments: 1
      }
    };

    return this.http.post('https://api.mercadopago.com/checkout/preferences', preference, {headers}).toPromise();
  }
}
