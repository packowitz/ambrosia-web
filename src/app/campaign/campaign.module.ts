import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CampaignPage} from './campaign.page';
import {EnterDungeonPage} from './enterDungeon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CampaignPage
      },
      {
        path: ':id',
        component: EnterDungeonPage
      }
    ])
  ],
  declarations: [CampaignPage, EnterDungeonPage]
})
export class CampaignModule {}
