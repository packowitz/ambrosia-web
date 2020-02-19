import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {VehiclesPage} from './vehicles.page';
import {VehicleDetailsPage} from './vehicleDetails.page';
import {VehicleAvatarModal} from './vehicleAvatar.modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: VehiclesPage
      },
      {
        path: ':id',
        component: VehicleDetailsPage
      }
    ])
  ],
  declarations: [VehiclesPage, VehicleDetailsPage, VehicleAvatarModal],
  entryComponents: [VehicleAvatarModal]
})
export class VehiclesModule {}
