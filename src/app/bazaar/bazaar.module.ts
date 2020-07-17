import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {BazaarPage} from './bazaar.page';

const routes: Routes = [
  {
    path: '',
    component: BazaarPage
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
  declarations: [BazaarPage]
})
export class BazaarPageModule {}
