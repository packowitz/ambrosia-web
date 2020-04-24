import {Component} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'modification-selection-modal',
    template: `
        <div class="ma-2">
          <ion-list>
            <ion-item (click)="close('REROLL_QUALITY')" class="pointer" *ngIf="model.progress.reRollGearQualityEnabled && (!gear.modificationPerformed || gear.modificationAllowed == 'REROLL_QUALITY')">
              Quality&nbsp;<i>({{converter.readableIdentifier(gear.gearQuality)}})</i>
            </ion-item>
            <ion-item (click)="close('REROLL_STAT')" class="pointer" *ngIf="model.progress.reRollGearStatEnabled && (!gear.modificationPerformed || gear.modificationAllowed == 'REROLL_STAT')">
              Stat&nbsp;<i>({{converter.readableIdentifier(gear.stat)}})</i>
            </ion-item>
            <ion-item (click)="close('INC_RARITY')" class="pointer" *ngIf="model.progress.incGearRarityEnabled && (!gear.modificationPerformed || gear.modificationAllowed == 'INC_RARITY')">
              Increase Rarity ({{converter.rarityStars(gear.rarity)}} -> {{converter.rarityStars(gear.rarity) + 1}})
            </ion-item>
            <ion-item (click)="close('ADD_JEWEL')" class="pointer" *ngIf="model.progress.addGearJewelEnabled && (!gear.modificationPerformed || gear.modificationAllowed == 'ADD_JEWEL')">
              Add Jewel Slot
            </ion-item>
            <ion-item (click)="close('REROLL_JEWEL_1')" class="pointer" *ngIf="model.progress.reRollGearJewelEnabled && gear.jewelSlot1 && !gear.jewel1Type && (!gear.modificationPerformed || gear.modificationAllowed == 'REROLL_JEWEL_1')">
              Jewel 1&nbsp;<i>({{converter.readableIdentifier(gear.jewelSlot1)}})</i>
            </ion-item>
            <ion-item (click)="close('REROLL_JEWEL_2')" class="pointer" *ngIf="model.progress.reRollGearJewelEnabled && gear.jewelSlot2 && !gear.jewel2Type && (!gear.modificationPerformed || gear.modificationAllowed == 'REROLL_JEWEL_2')">
              Jewel 2&nbsp;<i>({{converter.readableIdentifier(gear.jewelSlot2)}})</i>
            </ion-item>
            <ion-item (click)="close('REROLL_JEWEL_3')" class="pointer" *ngIf="model.progress.reRollGearJewelEnabled && gear.jewelSlot3 && !gear.jewel3Type && (!gear.modificationPerformed || gear.modificationAllowed == 'REROLL_JEWEL_3')">
              Jewel 3&nbsp;<i>({{converter.readableIdentifier(gear.jewelSlot3)}})</i>
            </ion-item>
            <ion-item (click)="close('REROLL_JEWEL_4')" class="pointer" *ngIf="model.progress.reRollGearJewelEnabled && gear.jewelSlot4 && !gear.jewel4Type && (!gear.modificationPerformed || gear.modificationAllowed == 'REROLL_JEWEL_4')">
              Jewel 4&nbsp;<i>({{converter.readableIdentifier(gear.jewelSlot4)}})</i>
            </ion-item>
            <ion-item (click)="close('ADD_SPECIAL_JEWEL')" class="pointer" *ngIf="model.progress.addGearSpecialJewelEnabled && gear.type == 'ARMOR' && !gear.specialJewelSlot && (!gear.modificationPerformed || gear.modificationAllowed == 'ADD_SPECIAL_JEWEL')">
              Add Set Jewel&nbsp;<i>({{converter.readableIdentifier(gear.set)}})</i>
            </ion-item>
          </ion-list>
        </div>
    `
})
export class ModificationSelectionPopover {

    gear: Gear;

    constructor(private popoverController: PopoverController,
                private navParams: NavParams,
                public model: Model,
                public converter: ConverterService) {
        this.gear = navParams.get('gear');
    }

    close(modification?: string) {
        this.popoverController.dismiss(modification);
    }
}