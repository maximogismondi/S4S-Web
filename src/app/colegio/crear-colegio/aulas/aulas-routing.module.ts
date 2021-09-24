import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulasComponent } from './aulas.component';

const routes: Routes = [{ path: '', component: AulasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulasRoutingModule { }
