import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {GaragePage} from './garage.page';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {GarageUpgradeModal} from './garageUpgrade.modal';

@NgModule({
  imports: [
    CommonModule,
    CommonAmbrosiaModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: GaragePage
      }
    ])
  ],
  declarations: [GaragePage, GarageUpgradeModal],
  entryComponents: [GarageUpgradeModal]
})
export class GarageModule {}
