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
import {GearModal} from '../barracks/gear.modal';
import {GearListItem} from '../barracks/gear-list-item.directive';
import {GearStat} from '../barracks/gear-stat.directive';
import {UpgradeModal} from './upgrade.modal';
import {HeroIconDirective} from './heroIcon.directive';
import {HeroInfoPopup} from './heroInfo.popup';
import {SetsInfoModal} from './setsInfo.modal';
import {GearInfoModal} from './gearInfo.modal';
import {BuffInfoModal} from './buffInfo.modal';
import {StoryPopover} from './story.popover';
import {LootSelectionPopover} from './loot-selection.popover';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        BuildingUpgradeModal,
        GearIcon, GearListItem, GearModal, GearJewelSlot, GearStat, GearInfoModal, SetsInfoModal,
        HeroIconDirective, HeroInfoPopup, BuffInfoModal,
        LootedDirective, LootItemDirective, LootSelectionPopover,
        StoryPopover,
        UpgradeItemDirective, UpgradeModal,
        VehicleDirective, VehicleSelectionPopover
    ],
    exports: [
        BuildingUpgradeModal,
        GearIcon, GearListItem, GearModal, GearJewelSlot, GearStat, GearInfoModal, SetsInfoModal,
        HeroIconDirective, HeroInfoPopup, BuffInfoModal,
        LootedDirective, LootItemDirective, LootSelectionPopover,
        StoryPopover,
        UpgradeItemDirective, UpgradeModal,
        VehicleDirective, VehicleSelectionPopover
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule
    ],
    entryComponents: [BuildingUpgradeModal, GearModal, HeroInfoPopup, BuffInfoModal, UpgradeModal, VehicleSelectionPopover, GearInfoModal, SetsInfoModal, StoryPopover, LootSelectionPopover]
})
export class CommonAmbrosiaModule {
}
