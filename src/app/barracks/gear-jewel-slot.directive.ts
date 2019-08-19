import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';
import {Hero} from '../domain/hero.model';
import {BackendService} from '../services/backend.service';
import {GearModal} from './gear.modal';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'gear-jewel-slot',
    template: `
        <i *ngIf="slotType == 'STRENGTH'" class="jewel-slot ra ra-sword {{pluggedInType ? 'color-jewel-' + slotType : 'color-grey'}}"></i>
        <i *ngIf="slotType == 'HP'" class="jewel-slot ra ra-hearts {{pluggedInType ? 'color-jewel-' + slotType : 'color-grey'}}"></i>
        <i *ngIf="slotType == 'ARMOR'" class="jewel-slot ra ra-shield {{pluggedInType ? 'color-jewel-' + slotType : 'color-grey'}}"></i>
        <i *ngIf="slotType == 'BUFFING'" class="jewel-slot ra ra-doubled {{pluggedInType ? 'color-jewel-' + slotType : 'color-grey'}}"></i>
        <i *ngIf="slotType == 'SPEED'" class="jewel-slot ra ra-lightning-bolt {{pluggedInType ? 'color-jewel-' + slotType : 'color-grey'}}"></i>
        <i *ngIf="slotType == 'CRIT'" class="jewel-slot ra ra-hydra-shot {{pluggedInType ? 'color-jewel-' + slotType : 'color-grey'}}"></i>
  `,
    styleUrls: ['gear-jewel-slot.directice.scss']
})
export class GearJewelSlot {
    @Input() slotType: string;
    @Input() pluggedInType: string;

    constructor() { }

}
