import {Component, EventEmitter, Input} from '@angular/core';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';
import {JewelryService} from '../services/jewelry.service';
import {Jewelry} from '../domain/jewelry.model';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'gear-modal',
    templateUrl: 'gear.modal.html'
})
export class GearModal {

    @Input() gear: Gear;
    @Input() heroCallback;

    selectedJewel = -1;
    selectedJewelSlotType: string;

    jewelries: Jewelry[] = [];
    jewelLevels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    constructor(private converter: ConverterService,
                private jewelryService: JewelryService,
                private backendService: BackendService,
                private propertyService: PropertyService,
                private modalCtrl: ModalController) {}

    selectJewelSlot(nr: number, slotType: string) {
        this.selectedJewel = nr;
        this.selectedJewelSlotType = slotType;
        if (nr === 0) {
            this.jewelries = [this.jewelryService.getSpecialJewelry(this.gear.set)];
        } else {
            this.jewelries = this.jewelryService.getJewelries(slotType);
        }
    }

    isEquipped(jewelType: string, level: number): Boolean {
        if (this.selectedJewel === 0 && this.gear.specialJewelType === jewelType) {
            return this.gear.specialJewelLevel === level;
        } else if (this.selectedJewel === 1 && this.gear.jewel1Type === jewelType) {
            return this.gear.jewel1Level === level;
        } else if (this.selectedJewel === 2 && this.gear.jewel2Type === jewelType) {
            return this.gear.jewel2Level === level;
        } else if (this.selectedJewel === 3 && this.gear.jewel3Type === jewelType) {
            return this.gear.jewel3Level === level;
        } else if (this.selectedJewel === 4 && this.gear.jewel4Type === jewelType) {
            return this.gear.jewel4Level === level;
        }
    }

    upgrade(jewelType: string, level: number) {
        this.backendService.upgradeJewel(jewelType, level).subscribe(() => {
            this.selectJewelSlot(this.selectedJewel, this.selectedJewelSlotType);
        });
    }

    pluginJewel(jewelType: string, level: number) {
        this.backendService.pluginJewel(this.gear, this.selectedJewel, jewelType, level).subscribe(action => {
            this.updateJewelsOnGear(action.gear);
            if (action.hero) {
                this.heroCallback.emit(action.hero);
            }
            this.selectJewelSlot(this.selectedJewel, this.selectedJewelSlotType);
        });
    }

    unplugJewel() {
        this.backendService.unplugJewel(this.gear, this.selectedJewel).subscribe(action => {
            this.updateJewelsOnGear(action.gear);
            if (action.hero) {
                this.heroCallback.emit(action.hero);
            }
            this.selectJewelSlot(this.selectedJewel, this.selectedJewelSlotType);
        });
    }

    updateJewelsOnGear(newGear: Gear) {
        this.gear.jewel1Type = newGear.jewel1Type;
        this.gear.jewel1Level = newGear.jewel1Level;
        this.gear.jewel2Type = newGear.jewel2Type;
        this.gear.jewel2Level = newGear.jewel2Level;
        this.gear.jewel3Type = newGear.jewel3Type;
        this.gear.jewel3Level = newGear.jewel3Level;
        this.gear.jewel4Type = newGear.jewel4Type;
        this.gear.jewel4Level = newGear.jewel4Level;
        this.gear.specialJewelType = newGear.specialJewelType;
        this.gear.specialJewelLevel = newGear.specialJewelLevel;
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

}