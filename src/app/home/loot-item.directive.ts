import {Component, Input} from '@angular/core';
import {LootedItem} from '../services/backend.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'loot-item',
    template: `
      <div *ngIf="loot.type == 'RESOURCE'" class="flex-vert-center">
        <img src="assets/icon/resources/{{loot.resourceType}}.png" class="loot-image">
        <div class="font-small">{{loot.value}}x</div>
      </div>
      <div *ngIf="loot.type == 'PROGRESS'" class="flex-vert-center">
        <img src="assets/icon/progress/{{loot.progressStat}}.png" class="loot-image">
        <div class="font-small">{{getProgressStatText(loot.progressStat, loot.value)}}</div>
      </div>
      <div *ngIf="loot.type == 'HERO'" class="border-grey flex-vert-center loot-hero">
        <ion-img [src]="'assets/icon/chars/' + model.getHero(loot.value).heroBase.avatar + '.png'" class="border-bottom-grey"></ion-img>
        <ion-img [src]="'assets/img/star_' + model.getHero(loot.value).stars + '.png'" class="hero-stars"></ion-img>
      </div>
      <div *ngIf="getGear() as gear" class="flex-vert-center">
        <gear-icon [gear]="gear" [type]="gear.type"></gear-icon>
        <gear-stat class="font-small no-wrap" [stat]="gear.stat" [value]="gear.statValue"></gear-stat>
      </div>
      <div *ngIf="loot.type == 'JEWEL'" class="flex-vert-center">
        <img src="assets/img/jewels/{{loot.jewelType.slot}}_{{loot.value}}.png" class="loot-image">
        <div class="font-small no-wrap">{{converter.readableIdentifier(loot.jewelType.name)}}</div>
      </div>
      <div *ngIf="loot.type == 'VEHICLE'" class="flex-vert-center">
        <img src="assets/img/vehicles/{{model.getVehicle(loot.value).baseVehicle.avatar}}.png">
        <div class="font-small ion-text-center">{{model.getVehicle(loot.value).baseVehicle.name}}</div>
      </div>
      <div *ngIf="loot.type == 'VEHICLE_PART'" class="flex-vert-center">
        <img src="assets/img/vehicles/parts/{{model.getVehiclePart(loot.value).type}}_{{model.getVehiclePart(loot.value).quality}}.png">
        <div class="font-small ion-text-center">{{converter.readableIdentifier(model.getVehiclePart(loot.value).type)}}</div>
      </div>
  `
})
export class LootItemDirective {
    @Input() loot: LootedItem;

    constructor(public model: Model,
                public propertyService: PropertyService,
                public converter: ConverterService) {}

    getGear() {
        if (this.loot.type === 'GEAR') {
            return this.model.getGear(this.loot.value);
        }
    }

    getProgressStatText(progressStat: string, bonus: number): string {
        switch (progressStat) {
            case 'PLAYER_XP': return '+' + bonus + ' XP';
            case 'EXPEDITION_LEVEL': return '+' + bonus + ' Expedition Lvl';
            case 'GARAGE_SLOT': return '+' + bonus + ' Garage slot';
            case 'MISSION_SPEED': return '+' + bonus + '% Mission speed';
            case 'MISSION_MAX_BATTLES': return '+' + bonus + ' Mission battles';
            case 'BUILDER_QUEUE': return '+' + bonus + ' Upgrade queue';
            case 'BUILDER_SPEED': return '+' + bonus + '% Upgrade speed';
            case 'BARRACKS_SIZE': return '+' + bonus + ' Barracks space';
            case 'INCUBATORS': return '+' + bonus + ' Incubator';
            case 'LAB_SPEED': return '+' + bonus + '% Lab speed';
        }
    }
}
