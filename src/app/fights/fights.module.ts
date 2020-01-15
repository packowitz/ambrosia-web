import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {FightsPage} from './fights.page';
import {FightDetailsPage} from './fightDetails.page';
import {FightStageConfigsPage} from './fightStageConfigs.page';
import {FightStageConfigModal} from './fightStageConfig.modal';

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
        path: 'configs',
        component: FightStageConfigsPage
      },
      {
        path: ':id',
        component: FightDetailsPage
      }
    ])
  ],
  declarations: [FightsPage, FightDetailsPage, FightStageConfigsPage, FightStageConfigModal],
  entryComponents: [FightStageConfigModal]
})
export class FightsModule {}
