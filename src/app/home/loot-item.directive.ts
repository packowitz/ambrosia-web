import {Component, Input} from '@angular/core';
import {Looted} from '../services/backend.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'loot-item',
    template: `
      <div *ngIf="loot.type == 'RESOURCE'" class="loot-item flex-vert-center">
        <img src="assets/img/resources/{{loot.resourceType}}.png" class="loot-image">
        <div class="font-small">{{loot.value}}x</div>
      </div>
      <div *ngIf="loot.type == 'HERO'" class="hero-tile-very-small border-grey flex-vert-center loot-item">
        <ion-img [src]="'assets/img/chars/' + model.getHero(loot.value).heroBase.avatar + '.png'" class="hero-avatar-very-small border-bottom-grey"></ion-img>
        <ion-img [src]="'assets/img/star_' + model.getHero(loot.value).stars + '.png'" class="hero-stars"></ion-img>
      </div>
      <gear-icon *ngIf="loot.type == 'GEAR'" [gear]="model.getGear(loot.value)" [type]="model.getGear(loot.value).type" class="loot-item"></gear-icon>
      <div *ngIf="loot.type == 'JEWEL'" class="loot-item flex-vert">
        <img src="assets/img/jewels/{{loot.jewelType.slot}}_{{loot.value}}.png" class="loot-image">
        <div *ngFor="let bonus of propertyService.getJewelValueAndName(loot.jewelType.name, loot.value)" class="font-small ion-text-center">{{bonus}}</div>
      </div>
      <div *ngIf="loot.type == 'VEHICLE'" class="loot-item flex-vert">
        <img src="assets/img/vehicles/{{model.getVehicle(loot.value).baseVehicle.avatar}}.png" class="loot-image">
        <div class="font-small ion-text-center">{{model.getVehicle(loot.value).baseVehicle.name}}</div>
      </div>
      <div *ngIf="loot.type == 'VEHICLE_PART'" class="loot-item flex-vert">
        <img src="assets/img/vehicles/parts/{{model.getVehiclePart(loot.value).type}}_{{model.getVehiclePart(loot.value).quality}}.png" class="loot-image">
        <div class="font-small ion-text-center">{{converter.readableIdentifier(model.getVehiclePart(loot.value).type)}}</div>
      </div>
  `
})
export class LootItemDirective {
    @Input() loot: Looted;

    constructor(public model: Model,
                public propertyService: PropertyService,
                public converter: ConverterService) {}
}
