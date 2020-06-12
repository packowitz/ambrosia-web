import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {EnumService} from '../services/enum.service';
import {ConverterService} from '../services/converter.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';

@Component({
    selector: 'sets-info-modal',
    template: `
        <div class="ma-2">
          <div class="flex-end">
            <ion-icon name="close" class="pointer" (click)="close()"></ion-icon>
          </div>
          
          <div class="mt-2 font-small">
            Wearing multiple items of the same set will grant a set bonus to the hero. The more items of the same gear a hero is wearing the better the set bonus. Click on a set to review the bonuses.
          </div>
          
          <div class="mt-3 pa-05 flex-space-between scrollable-vert">
            <img *ngFor="let set of enumService.getGearSets()" src="assets/icon/gear/{{set}}.png" (click)="selectSet(set)" class="mr-1 large-icon pointer" [class.icon-selected]="selectedSet == set">
          </div>

          <div class="mt-3 flex">
            <div class="ml-2">
              <div class="bold mt-1 mb-2">{{converter.readableIdentifier(selectedSet)}}</div>
              <div *ngIf="pcs1.length > 0" class="mt-2 flex-start">
                1 piece:
                <div class="ml-2">
                  <div *ngFor="let bonus of pcs1">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="pcs2.length > 0" class="mt-2 flex-start">
                2 pieces:
                <div class="ml-2">
                  <div *ngFor="let bonus of pcs2">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="pcs3.length > 0" class="mt-2 flex-start">
                3 pieces:
                <div class="ml-2">
                  <div *ngFor="let bonus of pcs3">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="pcs4.length > 0" class="mt-2 flex-start">
                4 pieces:
                <div class="ml-2">
                  <div *ngFor="let bonus of pcs4">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="pcs5.length > 0" class="mt-2 flex-start">
                5 pieces:
                <div class="ml-2">
                  <div *ngFor="let bonus of pcs5">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="pcs6.length > 0" class="mt-2 flex-start">
                6 pieces:
                <div class="ml-2">
                  <div *ngFor="let bonus of pcs6">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `
})
export class SetsInfoModal {

    selectedSet: string;

    pcs1: DynamicProperty[] = [];
    pcs2: DynamicProperty[] = [];
    pcs3: DynamicProperty[] = [];
    pcs4: DynamicProperty[] = [];
    pcs5: DynamicProperty[] = [];
    pcs6: DynamicProperty[] = [];

    constructor(private modalCtrl: ModalController,
                public enumService: EnumService,
                public converter: ConverterService,
                public propertyService: PropertyService) {
        this.selectSet(enumService.getGearSets()[0]);
    }

    selectSet(set: string) {
        this.selectedSet = set;
        this.propertyService.getProperties(this.selectedSet + '_SET').subscribe(d => {
            this.pcs1 = d.filter(p => p.level === 1);
            this.pcs2 = d.filter(p => p.level === 2);
            this.pcs3 = d.filter(p => p.level === 3);
            this.pcs4 = d.filter(p => p.level === 4);
            this.pcs5 = d.filter(p => p.level === 5);
            this.pcs6 = d.filter(p => p.level === 6);
        });
    }

    close() {
        this.modalCtrl.dismiss();
    }
}