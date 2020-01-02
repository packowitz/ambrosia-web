import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {MapsPage} from './maps.page';
import {MapDetailsPage} from './mapDetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: MapsPage
      },
      {
        path: ':id',
        component: MapDetailsPage
      }
    ])
  ],
  declarations: [MapsPage, MapDetailsPage]
})
export class MapsModule {}
