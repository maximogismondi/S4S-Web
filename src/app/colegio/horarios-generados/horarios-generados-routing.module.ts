import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorariosGeneradosComponent } from './horarios-generados.component';

const routes: Routes = [{ path: '', component: HorariosGeneradosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorariosGeneradosRoutingModule { }
