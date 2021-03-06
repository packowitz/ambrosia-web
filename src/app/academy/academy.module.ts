import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {AcademyPage} from './academy.page';
import {AcademyUpgradeInfoModal} from './academy-upgrade-info.modal';

@NgModule({
    imports: [
        CommonModule,
        CommonAmbrosiaModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: AcademyPage
            }
        ])
    ],
    declarations: [AcademyPage, AcademyUpgradeInfoModal],
    entryComponents: [AcademyUpgradeInfoModal]
})
export class AcademyModule {
}
