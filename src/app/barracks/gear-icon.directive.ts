import {Component, Input} from '@angular/core';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'gear-icon',
    template: `
        <div class="flex-start">
            <div class="flex-vert gear-icon-box">
                <i class="gear-icon ra"
                   [class.ra-relic-blade]="type == 'WEAPON'"
                   [class.ra-eye-shield]="type == 'SHIELD'"
                   [class.ra-helmet]="type == 'HELMET'"
                   [class.ra-vest]="type == 'ARMOR'"
                   [class.ra-forward]="type == 'PANTS'"
                   [class.ra-footprint]="type == 'BOOTS'"
                ></i>
                <i *ngIf="gear && gear.specialJewelSlot" class="gear-special-icon fas fa-circle inner"></i>
                <i *ngIf="gear && gear.specialJewelSlot" class="gear-special-icon far fa-circle"></i>
                <i *ngIf="gear && gear.specialJewelSlot && gear.specialJewelType" class="gear-special-icon color-orange ra ra-kaleidoscope jewel"></i>
                <div *ngIf="gear" class="flex-center gear-stars">
                    <ion-icon name="star" *ngFor="let star of converter.rarityToArray(gear.rarity)"></ion-icon>
                </div>
            </div>
            <div *ngIf="gear" class="gear-jewels flex-vert-space-between">
                <gear-jewel-slot [slotType]="gear.jewelSlot1" [pluggedInType]="gear.jewel1Type" style="display: inherit"></gear-jewel-slot>
                <gear-jewel-slot [slotType]="gear.jewelSlot2" [pluggedInType]="gear.jewel2Type" style="display: inherit"></gear-jewel-slot>
                <gear-jewel-slot [slotType]="gear.jewelSlot3" [pluggedInType]="gear.jewel3Type" style="display: inherit"></gear-jewel-slot>
                <gear-jewel-slot [slotType]="gear.jewelSlot4" [pluggedInType]="gear.jewel4Type" style="display: inherit"></gear-jewel-slot>
            </div>
        </div>
  `,
    styleUrls: ['gear-icon.directive.scss']
})
export class GearIcon {
    @Input() gear: Gear;
    @Input() type: string;

    constructor(private converter: ConverterService) { }

}
