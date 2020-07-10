import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CommonAmbrosiaModule} from '../common/common-ambrosia.module';
import {StoragePage} from './storage.page';
import {StorageUpgradeInfoModal} from './storage-upgrade-info.modal';

@NgModule({
    imports: [
        CommonModule,
        CommonAmbrosiaModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: StoragePage
            }
        ])
    ],
    declarations: [StoragePage, StorageUpgradeInfoModal],
    entryComponents: [StorageUpgradeInfoModal]
})
export class StorageModule {
}
