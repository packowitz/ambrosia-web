import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ArenaPage} from './arena.page';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';

const routes: Routes = [
  {
    path: '',
    component: ArenaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonAmbrosiaModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ArenaPage]
})
export class ArenaPageModule {}
