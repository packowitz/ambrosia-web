import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {FightsPage} from './fights.page';
import {FightDetailsPage} from './fightDetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: FightsPage
      },
      {
        path: ':id',
        component: FightDetailsPage
      }
    ])
  ],
  declarations: [FightsPage, FightDetailsPage]
})
export class FightsModule {}
