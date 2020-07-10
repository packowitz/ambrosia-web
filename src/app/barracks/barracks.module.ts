import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {BarracksPage} from './barracks.page';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {BarracksUpgradeInfoModal} from './barracks-upgrade-info.modal';

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
    declarations: [BarracksPage, BarracksUpgradeInfoModal],
    entryComponents: [BarracksUpgradeInfoModal]
})
export class BarracksModule {
}
