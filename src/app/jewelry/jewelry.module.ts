import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {JewelryPage} from './jewelry.page';
import {JewelUpgradeModal} from './jewelUpgrade.modal';
import {JewelryUpgradeInfoModal} from './jewelry-upgrade-info.modal';

@NgModule({
    imports: [
        CommonModule,
        CommonAmbrosiaModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: JewelryPage
            }
        ])
    ],
    declarations: [JewelryPage, JewelUpgradeModal, JewelryUpgradeInfoModal],
    entryComponents: [JewelUpgradeModal, JewelryUpgradeInfoModal]
})
export class JewelryModule {
}
