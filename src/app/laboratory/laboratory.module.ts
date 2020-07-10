import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {LaboratoryPage} from './laboratory.page';
import {LaboratoryUpgradeInfoModal} from './laboratory-upgrade-info.modal';

@NgModule({
    imports: [
        CommonModule,
        CommonAmbrosiaModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: LaboratoryPage
            }
        ])
    ],
    declarations: [LaboratoryPage, LaboratoryUpgradeInfoModal],
    entryComponents: [LaboratoryUpgradeInfoModal]
})
export class LaboratoryModule {
}
