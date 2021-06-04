import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EleccionComponent } from './colegio/eleccion/eleccion.component'; //sirve para esto component: EleccionComponent 

const routes: Routes = [
  { 
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule)
  },
    
  { 
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule)
  },
  { 
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'eleccion',
    loadChildren: () => import('./colegio/eleccion/eleccion.module').then(m => m.EleccionModule)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
