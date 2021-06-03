import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EleccionComponent } from './eleccion.component';

const routes: Routes = [{ path: '', component: EleccionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EleccionRoutingModule { }
