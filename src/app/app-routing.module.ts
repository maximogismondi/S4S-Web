import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendEmailComponent } from './auth/send-email/send-email.component';
import { EleccionComponent } from './colegio/eleccion/eleccion.component'; //sirve para esto component: EleccionComponent
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
// import { AuthGuard } from './shared/guards/auth.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },

  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'eleccion',
    loadChildren: () =>
      import('./colegio/eleccion/eleccion.module').then(
        (m) => m.EleccionModule
      ),
    // canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'verificacion-email',
    component: SendEmailComponent,
    // canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'crear-colegio',
    loadChildren: () =>
      import('./colegio/crear-colegio/crear-colegio.module').then(
        (m) => m.CrearColegioModule
      ),
    // canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'menu-principal',
    loadChildren: () =>
      import('./colegio/menu-principal/menu-principal.module').then(
        (m) => m.MenuPrincipalModule
      ),
    // canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  // {
  //   path: 'configuracion',
  //   loadChildren: () =>
  //     import('./configuraciones/setting/setting.module').then(
  //       (m) => m.SettingModule
  //     ),
  //   canActivate: [AngularFireAuthGuard],
  //   data: { authGuardPipe: redirectUnauthorizedToLogin },
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
