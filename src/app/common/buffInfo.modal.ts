import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Buff, EnumService} from '../services/enum.service';
import {ConverterService} from '../services/converter.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';

@Component({
    selector: 'buff-info-modal',
    template: `
        <div class="ma-2 scrollable-vert">
          <div class="flex-end">
            <ion-icon name="close" class="pointer" (click)="close()"></ion-icon>
          </div>
          
          <div class="mt-2 font-small">
            <ion-button color="success" [fill]="buffType == 'BUFF' ? 'solid' : 'outline'" (click)="selectType('BUFF')">Buffs</ion-button>
            <ion-button color="danger" [fill]="buffType == 'DEBUFF' ? 'solid' : 'outline'" (click)="selectType('DEBUFF')">Debuffs</ion-button>
          </div>

          <div class="mt-3 flex">
            <div class="flex-vert">
              <ion-button *ngFor="let buff of getBuffs()" [fill]="selectedBuff.buffName == buff.buffName ? 'outline' : 'clear'" size="small" (click)="selectBuff(buff)" [color]="buffType == 'BUFF' ? 'success' : 'danger'">{{converter.readableIdentifier(buff.buffName)}}</ion-button>
            </div>
            <div class="ml-2">
              <div class="bold mt-1">{{converter.readableIdentifier(selectedBuff.buffName)}}</div>
              <div class="mt-2"><i>{{selectedBuff.description}}</i></div>
              <div *ngIf="veryLight.length > 0" class="mt-3 flex-start">
                <div class="width-150 flex-start">
                  <ion-img src="assets/icon/buffs/{{selectedBuff.buffName}}_1.png" class="buff_icon_large mr-2"></ion-img>
                  Very Light
                </div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of veryLight">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="light.length > 0" class="mt-2 flex-start">
                <div class="width-150 flex-start">
                  <ion-img src="assets/icon/buffs/{{selectedBuff.buffName}}_2.png" class="buff_icon_large mr-2"></ion-img>
                  Light
                </div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of light">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="normal.length > 0" class="mt-2 flex-start">
                <div class="width-150 flex-start">
                  <ion-img src="assets/icon/buffs/{{selectedBuff.buffName}}_3.png" class="buff_icon_large mr-2"></ion-img>
                  Normal
                </div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of normal">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="strong.length > 0" class="mt-2 flex-start">
                <div class="width-150 flex-start">
                  <ion-img src="assets/icon/buffs/{{selectedBuff.buffName}}_4.png" class="buff_icon_large mr-2"></ion-img>
                  Strong
                </div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of strong">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
              <div *ngIf="veryStrong.length > 0" class="mt-2 flex-start">
                <div class="width-150 flex-start">
                  <ion-img src="assets/icon/buffs/{{selectedBuff.buffName}}_5.png" class="buff_icon_large mr-2"></ion-img>
                  Very Strong
                </div>
                <div class="ml-2 font-small">
                  <div *ngFor="let bonus of veryStrong">{{propertyService.statAsText(bonus)}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `
})
export class BuffInfoModal {

    buffType: string;

    selectedBuff: Buff;

    veryLight: DynamicProperty[] = [];
    light: DynamicProperty[] = [];
    normal: DynamicProperty[] = [];
    strong: DynamicProperty[] = [];
    veryStrong: DynamicProperty[] = [];

    constructor(private modalCtrl: ModalController,
                public enumService: EnumService,
                public converter: ConverterService,
                public propertyService: PropertyService) {
        this.selectType('BUFF');
    }

    selectType(type: string) {
        this.buffType = type;
        this.selectBuff(this.enumService.getBuffs().find(b => b.type === this.buffType));
    }

    selectBuff(buff: Buff) {
        this.selectedBuff = buff;
        this.propertyService.getProperties(this.selectedBuff.propertyType).subscribe(d => {
            this.veryLight = d.filter(p => p.level === 1);
            this.light = d.filter(p => p.level === 2);
            this.normal = d.filter(p => p.level === 3);
            this.strong = d.filter(p => p.level === 4);
            this.veryStrong = d.filter(p => p.level === 5);
        });
    }

    getBuffs(): Buff[] {
        return this.enumService.getBuffs().filter(b => b.type === this.buffType);
    }

    close() {
        this.modalCtrl.dismiss();
    }
}