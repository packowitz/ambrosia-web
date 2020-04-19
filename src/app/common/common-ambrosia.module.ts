import {NgModule} from '@angular/core';
import {GearIcon} from '../barracks/gear-icon.directive';
import {GearJewelSlot} from '../barracks/gear-jewel-slot.directive';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {VehicleDirective} from '../garage/vehicle.directive';
import {VehicleSelectionPopover} from '../garage/vehicle-selection-popover';
import {LootedDirective} from '../home/looted.directive';
import {LootItemDirective} from '../home/loot-item.directive';
import {UpgradeItemDirective} from './upgradeItem.directive';
import {BuildingUpgradeModal} from './buildingUpgrade.modal';

@NgModule({
    declarations: [
        BuildingUpgradeModal,
        GearIcon, GearJewelSlot,
        LootedDirective, LootItemDirective,
        UpgradeItemDirective,
        VehicleDirective, VehicleSelectionPopover
    ],
    exports: [
        BuildingUpgradeModal,
        GearIcon, GearJewelSlot,
        LootedDirective, LootItemDirective,
        UpgradeItemDirective,
        VehicleDirective, VehicleSelectionPopover
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    entryComponents: [BuildingUpgradeModal, VehicleSelectionPopover]
})
export class CommonAmbrosiaModule {
}
