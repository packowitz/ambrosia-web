import {NgModule} from '@angular/core';
import {GearIcon} from './barracks/gear-icon.directive';
import {GearJewelSlot} from './barracks/gear-jewel-slot.directive';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [GearIcon, GearJewelSlot],
    exports: [GearIcon, GearJewelSlot],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class CommonAmbrosiaModule {
}
