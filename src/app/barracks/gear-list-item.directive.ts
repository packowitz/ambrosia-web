import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';
import {Hero} from '../domain/hero.model';
import {BackendService} from '../services/backend.service';
import {GearModal} from './gear.modal';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'gear-list-item',
  template: `
      <div class="flex-start" [class.color-grey]="!gear" (click)="showGearDetails()" [class.pointer]="canShowDetails()">
        <gear-icon [gear]="gear" [type]="type"></gear-icon>
        <div *ngIf="gear" class="flex-vert gear-text flex-grow">
          <div>{{converter.readableIdentifier(gear.gearQuality)}} {{converter.readableIdentifier(gear.set)}} {{converter.readableIdentifier(gear.type)}}</div>
          <gear-stat [stat]="gear.stat" [value]="gear.statValue"></gear-stat>
        </div>
        <div *ngIf="gear && !gear.equippedTo && !hero.missionId">
          <ion-button fill="clear" size="small" (click)="equipGear($event)"><ion-img class="equip-icon" src="/assets/img/equip.png"></ion-img></ion-button>
        </div>
        <div *ngIf="gear && gear.equippedTo && !hero.missionId">
          <ion-button fill="clear" size="small" (click)="unequipGear($event)"><ion-img class="equip-icon" src="/assets/img/unequip.png"></ion-img></ion-button>
        </div>
      </div>
  `,
  styleUrls: ['gear-list-item.scss']
})
export class GearListItem {
  @Input() hero: Hero;
  @Input() gear: Gear;
  @Input() type: string;
  @Output() callback = new EventEmitter();

  constructor(private converter: ConverterService,
              private backendService: BackendService,
              private modalCtrl: ModalController) { }

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

  canShowDetails(): boolean {
    return this.gear && !(this.hero.missionId && this.gear.equippedTo);
  }

  showGearDetails() {
    if (this.canShowDetails()) {
      this.modalCtrl.create({
        component: GearModal,
        componentProps: {
          gear: this.gear,
          heroCallback: this.callback
        }
      }).then(modal => modal.present());
    }
  }

}
