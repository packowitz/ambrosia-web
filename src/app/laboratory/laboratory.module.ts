import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {LaboratoryPage} from './laboratory.page';
import {LaboratoryUpgradeInfoModal} from './laboratory-upgrade-info.modal';
import {HeroOverviewPage} from './hero-overview.page';
import {HeroOverviewModal} from './hero-overview.modal';

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
            },
            {
                path: 'heroes',
                component: HeroOverviewPage
            }
        ])
    ],
    declarations: [LaboratoryPage, LaboratoryUpgradeInfoModal, HeroOverviewPage, HeroOverviewModal],
    entryComponents: [LaboratoryUpgradeInfoModal, HeroOverviewModal]
})
export class LaboratoryModule {
}
