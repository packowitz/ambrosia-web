import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CampaignFightPage} from './campaignFight.page';
import {CommonAmbrosiaModule} from '../common-ambrosia.module';

@NgModule({
  imports: [
    CommonModule,
    CommonAmbrosiaModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: ':mapId/:posX/:posY',
        component: CampaignFightPage
      },
      {
        path: ':fightId',
        component: CampaignFightPage
      }
    ])
  ],
  declarations: [CampaignFightPage]
})
export class CampaignModule {}
