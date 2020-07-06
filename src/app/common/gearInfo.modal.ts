import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {EnumService} from '../services/enum.service';
import {ConverterService} from '../services/converter.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';

@Component({
    selector: 'gear-info-modal',
    template: `
        <div class="ma-2 scrollable-vert">
          <div class="flex-end">
            <ion-icon name="close" class="pointer" (click)="close()"></ion-icon>
          </div>
          
          <div class="mt-2 font-small">
            Each gear give a bonus to one stat. Which stat depends on the gear type and the amount depends on the gear's rarity and quality.
          </div>

          <div class="mt-3 flex">
            <div class="flex-vert">
              <ion-button *ngFor="let type of enumService.getGearTypes()" [fill]="selectedType == type ? 'outline' : 'clear'" size="small" (click)="selectType(type)" color="dark">{{converter.readableIdentifier(type)}}</ion-button>
            </div>
            <div class="ml-2">
              <div class="bold mt-1 mb-2">{{converter.readableIdentifier(selectedType)}}</div>
              <div *ngIf="simple.length > 0" class="mt-2 flex-start">
                <div class="width-150">Simple (1*):</div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of simple">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="common.length > 0" class="mt-2 flex-start">
                <div class="width-150">Common (2*):</div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of common">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="uncommon.length > 0" class="mt-2 flex-start">
                <div class="width-150">Uncommon (3*):</div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of uncommon">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="rare.length > 0" class="mt-2 flex-start">
                <div class="width-150">Rare (4*):</div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of rare">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="epic.length > 0" class="mt-2 flex-start">
                <div class="width-150">Epic (5*):</div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of epic">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="legendary.length > 0" class="mt-2 flex-start">
                <div class="width-150">Legendary (6*):</div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of legendary">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `
})
export class GearInfoModal {

    selectedType: string;

    simple: DynamicProperty[] = [];
    common: DynamicProperty[] = [];
    uncommon: DynamicProperty[] = [];
    rare: DynamicProperty[] = [];
    epic: DynamicProperty[] = [];
    legendary: DynamicProperty[] = [];

    constructor(private modalCtrl: ModalController,
                public enumService: EnumService,
                public converter: ConverterService,
                public propertyService: PropertyService) {
        this.selectType(enumService.getGearTypes()[0]);
    }

    selectType(type: string) {
        this.selectedType = type;
        this.simple = this.propertyService.getProps(this.selectedType + '_GEAR', 1);
        this.common = this.propertyService.getProps(this.selectedType + '_GEAR', 2);
        this.uncommon = this.propertyService.getProps(this.selectedType + '_GEAR', 3);
        this.rare = this.propertyService.getProps(this.selectedType + '_GEAR', 4);
        this.epic = this.propertyService.getProps(this.selectedType + '_GEAR', 5);
        this.legendary = this.propertyService.getProps(this.selectedType + '_GEAR', 6);
    }

    close() {
        this.modalCtrl.dismiss();
    }
}