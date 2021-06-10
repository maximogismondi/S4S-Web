import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearColegioComponent } from './crear-colegio.component';

const routes: Routes = [{ path: '', component: CrearColegioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearColegioRoutingModule { }
