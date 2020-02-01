import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {BarracksPage} from './barracks.page';
import {GearListItem} from './gear-list-item.directive';
import {GearModal} from './gear.modal';
import {GearStat} from './gear-stat.directive';
import {CommonAmbrosiaModule} from '../common-ambrosia.module';

@NgModule({
    imports: [
        CommonModule,
        CommonAmbrosiaModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: BarracksPage
            }
        ])
    ],
    declarations: [BarracksPage, GearListItem, GearModal, GearStat],
    entryComponents: [GearModal]
})
export class BarracksModule {
}
