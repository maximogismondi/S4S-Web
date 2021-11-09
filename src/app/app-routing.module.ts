import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendEmailComponent } from './auth/send-email/send-email.component';
import { EleccionComponent } from './colegio/eleccion/eleccion.component'; //sirve para esto component: EleccionComponent
import { map } from 'rxjs/operators';
import {
  AngularFireAuthGuard,
  emailVerified,
  isNotAnonymous,
  loggedIn,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
// import { ProcesarPagoComponent } from './mercado-pago/procesar-pago/procesar-pago.component';

const redirectToLoginWhenUserNotVerified = (redirect: any[]) =>
  pipe(
    emailVerified,
    map((loggedIn: any) => loggedIn || redirect)
  );
const redirectToLoginWhenUserLogin = (redirect: any[]) =>
  pipe(
    isNotAnonymous,
    map((loggedIn: any) => loggedIn || redirect)
  );

const redirectToVerifiedEmail = () =>
  redirectToLoginWhenUserNotVerified(['verificacion-email']);
const redirectToLogin = () => redirectToLoginWhenUserLogin(['login']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then((m) => m.RegisterModule),
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectToVerifiedEmail },
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectToVerifiedEmail },
  },
  {
    path: 'eleccion',
    loadChildren: () =>
      import('./colegio/eleccion/eleccion.module').then(
        (m) => m.EleccionModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectToVerifiedEmail },
  },
  {
    path: 'verificacion-email',
    component: SendEmailComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectToLogin },
  },
  {
    path: ':nombreColegio/crear-colegio/:seccion',
    loadChildren: () =>
      import('./colegio/crear-colegio/crear-colegio.module').then(
        (m) => m.CrearColegioModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectToVerifiedEmail },
  },
  {
    path: 'menu-principal',
    loadChildren: () =>
      import('./colegio/menu-principal/menu-principal.module').then(
        (m) => m.MenuPrincipalModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectToVerifiedEmail },
  },
  {
    path: ':nombreColegio/horarios-generados',
    loadChildren: () =>
      import('./colegio/horarios-generados/horarios-generados.module').then(
        (m) => m.HorariosGeneradosModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectToVerifiedEmail },
  },
  // {
  //   path: 'procesar-pago',
  //   component: ProcesarPagoComponent,
  //   canActivate: [AngularFireAuthGuard],
  //   data: { authGuardPipe: redirectToVerifiedEmail },
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
