import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';
import {Hero} from '../domain/hero.model';
import {BackendService} from '../services/backend.service';
import {GearModal} from './gear.modal';
import {ModalController} from '@ionic/angular';
import {PropertyService} from '../services/property.service';

@Component({
  selector: 'gear-list-item',
  template: `
      <div class="flex-start" [class.color-grey]="!gear">
        <gear-icon [gear]="gear" [type]="type" (click)="showGearDetails($event)" class="pointer"></gear-icon>
        <div *ngIf="gear" class="flex-vert font-small flex-grow ml-1">
          <div>{{converter.readableIdentifier(gear.gearQuality)}} {{converter.readableIdentifier(gear.set)}} {{converter.readableIdentifier(gear.type)}}</div>
          <gear-stat [stat]="gear.stat" [value]="gear.statValue"></gear-stat>
          <div class="font-small">
            <i *ngFor="let bonus of propertyService.getJewelValueAndName(gear.jewel1Type, gear.jewel1Level)">{{bonus}} </i>
            <i *ngFor="let bonus of propertyService.getJewelValueAndName(gear.jewel2Type, gear.jewel2Level)">{{bonus}} </i>
            <i *ngFor="let bonus of propertyService.getJewelValueAndName(gear.jewel3Type, gear.jewel3Level)">{{bonus}} </i>
            <i *ngFor="let bonus of propertyService.getJewelValueAndName(gear.jewel4Type, gear.jewel4Level)">{{bonus}} </i>
            <i *ngFor="let bonus of propertyService.getJewelValueAndName(gear.specialJewelType, gear.specialJewelLevel)">{{bonus}}</i>
          </div>
        </div>
        <div *ngIf="!readonly && gear && !gear.equippedTo">
          <ion-button fill="clear" size="small" (click)="equipGear($event)"><ion-img class="equip-icon" src="/assets/img/equip.png"></ion-img></ion-button>
        </div>
        <div *ngIf="!readonly && gear && gear.equippedTo">
          <ion-button fill="clear" size="small" (click)="unequipGear($event)"><ion-img class="equip-icon" src="/assets/img/unequip.png"></ion-img></ion-button>
        </div>
      </div>
  `
})
export class GearListItem {
  @Input() hero: Hero;
  @Input() gear: Gear;
  @Input() type: string;
  @Input() readonly = false;
  @Output() callback = new EventEmitter();

  constructor(public converter: ConverterService,
              private backendService: BackendService,
              private modalCtrl: ModalController,
              public propertyService: PropertyService) { }

  equipGear(ev) {
    ev.stopPropagation();
    this.backendService.equipGear(this.hero, this.gear).subscribe(data => {
      this.callback.emit(data);
    });
  }

  unequipGear(ev) {
    ev.stopPropagation();
    this.backendService.unequipGear(this.hero, this.gear).subscribe(data => {
      this.callback.emit(data);
    });
  }

  async showGearDetails(ev) {
    ev.stopPropagation();
    const modal = await this.modalCtrl.create({
      component: GearModal,
      componentProps: {
        gear: this.gear,
        heroCallback: this.callback
      }
    });
    modal.present();
  }

}
