import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {LootPage} from './loot.page';
import {LootBoxPage} from './lootBox.page';

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
      }
    ])
  ],
  declarations: [LootPage, LootBoxPage]
})
export class LootModule {}
