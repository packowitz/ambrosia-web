import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {LootPage} from './loot.page';
import {LootBoxPage} from './lootBox.page';
import {GearLootPage} from './gearLoot.page';
import {GearLootDetailsPage} from './gearLootDetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LootPage
      },
      {
        path: 'box/:id',
        component: LootBoxPage
      },
      {
        path: 'gear',
        component: GearLootPage
      },
      {
        path: 'gear/:id',
        component: GearLootDetailsPage
      }
    ])
  ],
  declarations: [LootPage, LootBoxPage, GearLootPage, GearLootDetailsPage]
})
export class LootModule {}
