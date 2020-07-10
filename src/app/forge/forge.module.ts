import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {ForgePage} from './forge.page';
import {GearUpgradeModal} from './gearUpgrade.modal';
import {ModificationSelectionPopover} from './modification-selection-popover';
import {ForgeUpgradeInfoModal} from './forge-upgrade-info.modal';

@NgModule({
    imports: [
        CommonModule,
        CommonAmbrosiaModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ForgePage
            }
        ])
    ],
    declarations: [ForgePage, GearUpgradeModal, ModificationSelectionPopover, ForgeUpgradeInfoModal],
    entryComponents: [GearUpgradeModal, ModificationSelectionPopover, ForgeUpgradeInfoModal]
})
export class ForgeModule {
}
