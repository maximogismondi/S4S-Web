import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalizarComponent } from './finalizar.component';

const routes: Routes = [{ path: '', component: FinalizarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalizarRoutingModule { }
