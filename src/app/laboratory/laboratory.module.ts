import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {LaboratoryPage} from './laboratory.page';
import {LaboratoryUpgradeModal} from './laboratoryUpgrade.modal';

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
    declarations: [LaboratoryPage, LaboratoryUpgradeModal],
    entryComponents: [LaboratoryUpgradeModal]
})
export class LaboratoryModule {
}
