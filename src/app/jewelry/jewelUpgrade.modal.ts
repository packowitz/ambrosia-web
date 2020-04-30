import {Component, Input} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {Vehicle} from '../domain/vehicle.model';
import {VehiclePart} from '../domain/vehiclePart.model';
import {ConverterService} from '../services/converter.service';
import {JewelryService} from '../services/jewelry.service';
import {Jewelry} from '../domain/jewelry.model';

@Component({
    selector: 'jewel-upgrade-modal',
    template: `
        <div class="ma-2">
          <div class="flex-space-around">
            <div class="flex-center">{{getJewelry()['lvl' + jewelLevel]}}<ion-img src="assets/img/jewels/{{getJewelry().slot}}_{{jewelLevel}}.png" class="jewel-icon"></ion-img></div>
            <div class="flex">{{model.resources.coins}}<ion-img src="assets/icon/resources/COINS.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.rubies}}<ion-img src="assets/icon/resources/RUBIES.png" class="resource-icon"></ion-img></div>
          </div>
          <div class="mt-2 flex-center">
            Upgraded Jewels grant higher bonuses
          </div>
          <ion-item class="mt-2">
            <div class="flex-center full-width">
              Your current upgrade queue {{model.upgrades.length}}/{{model.progress.builderQueueLength}}
            </div>
          </ion-item>
          <upgrade-item *ngFor="let item of model.upgrades" [item]="item"></upgrade-item>
          <div>
            <div class="mt-2 flex-center" *ngIf="!upgradeSeconds">Cannot upgrade Jewels higher than level {{jewelLevel}}</div>
            <div class="mt-3" *ngIf="upgradeSeconds">
              <div class="flex-space-around">
                <div *ngIf="hasEnoughResources">Upgrade costs</div>
                <div *ngIf="!hasEnoughResources">Insufficient resources</div>
                <div class="flex-center">
                  <div [class.color-red]="!getJewelry()['lvl' + jewelLevel] < 4">{{getJewelry()['lvl' + jewelLevel]}}</div>/4<ion-img src="assets/img/jewels/{{getJewelry().slot}}_{{jewelLevel}}.png" class="jewel-icon"></ion-img>
                </div>
                <div *ngFor="let cost of upgradeCosts" class="flex">
                  <div [class.color-red]="!model.hasEnoughResources(cost.resourceType, cost.value1)">{{model.getResourceAmount(cost.resourceType)}}</div>/{{cost.value1}}<ion-img src="assets/icon/resources/{{cost.resourceType}}.png" class="resource-icon"></ion-img>
                </div>
              </div>
              <div class="mt-2 flex-center">
                <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
                <ion-button [disabled]="!hasEnoughResources || saving || model.upgrades.length >= model.progress.builderQueueLength" (click)="performUpgrade()">Upgrade {{converter.readableIdentifier(jewelType)}} to level {{jewelLevel + 1}}</ion-button>
              </div>
            </div>
          </div>
          
        </div>
    `
})
export class JewelUpgradeModal {

    @Input() jewelType: string;
    @Input() jewelLevel: number;

    upgradeSeconds: number = null;
    upgradeCosts: DynamicProperty[] = [];
    hasEnoughResources = true;

    saving = false;

    constructor(private modalCtrl: ModalController,
                public model: Model,
                public converter: ConverterService,
                public jewelryService: JewelryService,
                private backendService: BackendService,
                private propertyService: PropertyService,
                private alertCtrl: AlertController) {
    }

    ionViewWillEnter() {
        let upTimes = this.propertyService.getUpgradeTime('JEWEL', this.jewelLevel + 1);
        if (upTimes.length === 1) {
            this.upgradeSeconds = upTimes[0].value1;
        }
        this.upgradeCosts = this.propertyService.getUpgradeCosts('JEWEL', this.jewelLevel + 1);
        this.hasEnoughResources = this.getJewelry()['lvl' + this.jewelLevel] >= 4;
        this.upgradeCosts.forEach(c => {
            if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
                this.hasEnoughResources = false;
            }
        });
    }

    getJewelry(): Jewelry {
        return this.jewelryService.getJewelry(this.jewelType);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    performUpgrade() {
        if (this.hasEnoughResources && this.upgradeSeconds && this.model.upgrades.length < this.model.progress.builderQueueLength) {
            this.saving = true;
            this.backendService.upgradeJewel(this.jewelType, this.jewelLevel).subscribe(data => {
                this.saving = false;
                this.ionViewWillEnter();
            }, error => {
                this.saving = false;
                this.alertCtrl.create({
                    header: 'Server error',
                    message: error.error.message,
                    buttons: [{text: 'Okay'}]
                }).then(data => data.present());
            });

        }
    }
}