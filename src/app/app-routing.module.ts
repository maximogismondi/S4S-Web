import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EleccionComponent } from './colegio/eleccion/eleccion.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { 
    path: 'login',
    component: LoginComponent
  },
    
  { 
    path: 'register',
    component: RegisterComponent
  },
  { 
    path: '',
    component: HomeComponent
  },
  {
    path: 'eleccion',
    component: EleccionComponent 
  }
];

/*
const routes: Routes = [
  
  { path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule) 
  },

  { path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) 
  },

  { path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule)
  }];
*/

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
