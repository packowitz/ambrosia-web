import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {BarracksPage} from './barracks.page';
import {GearListItem} from './gear-list-item.directive';
import {GearModal} from './gear.modal';
import {GearIcon} from './gear-icon.directive';
import {GearStat} from './gear-stat.directive';
import {GearJewelSlot} from './gear-jewel-slot.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: BarracksPage
      }
    ])
  ],
  declarations: [BarracksPage, GearListItem, GearModal, GearIcon, GearStat, GearJewelSlot],
  entryComponents: [GearModal]
})
export class BarracksModule {}
