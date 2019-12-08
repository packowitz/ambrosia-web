import {Component, Input} from '@angular/core';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'gear-icon',
    template: `
      <div class="flex-start border_{{getJewelCount()}} mt-1">
        <div class="flex-vert gear-icon-box">
          <ion-img *ngIf="!gear" [src]="'assets/img/sets/default_' + type + '.png'"></ion-img>
          <ion-img *ngIf="gear" [src]="'assets/img/sets/' + gear.set + '_' + type + '.png'" class="border-right-grey"></ion-img>
          <i *ngIf="gear && gear.specialJewelSlot" class="gear-special-icon fas fa-circle inner"></i>
          <i *ngIf="gear && gear.specialJewelSlot" class="gear-special-icon far fa-circle"></i>
          <i *ngIf="gear && gear.specialJewelSlot && gear.specialJewelType"
             class="gear-special-icon color-orange ra ra-kaleidoscope jewel"></i>
          <div *ngIf="gear" class="flex-center gear-stars">
            <ion-img [src]="'assets/img/star_' + converter.rarityStars(gear.rarity) + '.png'" class="hero-stars"></ion-img>
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

    constructor(private converter: ConverterService) {
    }

    getJewelCount(): number {
        if (this.gear) {
            if (this.gear.jewelSlot4) { return 4; }
            if (this.gear.jewelSlot3) { return 3; }
            if (this.gear.jewelSlot2) { return 2; }
            if (this.gear.jewelSlot1) { return 1; }
        }
        return 0;
    }

}
