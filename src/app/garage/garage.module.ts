import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {GaragePage} from './garage.page';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {VehicleUpgradeModal} from './vehicleUpgrade.modal';
import {VehiclePartUpgradeModal} from './vehiclePartUpgrade.modal';

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
  declarations: [GaragePage, VehicleUpgradeModal, VehiclePartUpgradeModal],
  entryComponents: [VehicleUpgradeModal, VehiclePartUpgradeModal]
})
export class GarageModule {}
