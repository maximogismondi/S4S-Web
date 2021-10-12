// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/* // SDK de Mercado Pago
const mercadopago = require ('mercadopago');
// Agrega credenciales
mercadopago.configure({
  access_token: 'TEST-5bd86ed1-ae42-4cf6-a63a-2bcc93bffb2b'
});

// Crea un objeto de preferencia
let producto = {
  items: [
    {
      title: 'Curso - S4S',
      unit_price: 100,
      quantity: 1,
    }
  ]
};

mercadopago.preferences.create(producto)
.then(function(response){
// Este valor reemplazará el string "<%= global.id %>" en tu HTML
  global.id = response.body.id;
}).catch(function(error){
  console.log(error);
}); */

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAuUuoKyjyAL3e-0uOR_jNJofk6ysNrvZ8',
    authDomain: 'proyectos4s-89b8a.firebaseapp.com',
    projectId: 'proyectos4s-89b8a',
    storageBucket: 'proyectos4s-89b8a.appspot.com',
    messagingSenderId: '577933725375',
    appId: '1:577933725375:web:5952b35e4e72d5ce13c00a'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
