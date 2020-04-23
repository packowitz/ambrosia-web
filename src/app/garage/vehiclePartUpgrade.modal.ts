import {Component, Input} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {VehiclePart} from '../domain/vehiclePart.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'vehicle-part-upgrade-modal',
    template: `
        <div class="ma-2">
          <div class="flex-space-around">
            <div class="flex">{{model.resources.metal}}/{{model.resources.metalMax}}<ion-img src="assets/img/resources/METAL.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.iron}}/{{model.resources.ironMax}}<ion-img src="assets/img/resources/IRON.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.steal}}/{{model.resources.stealMax}}<ion-img src="assets/img/resources/STEAL.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.coins}}<ion-img src="assets/img/resources/COINS.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.rubies}}<ion-img src="assets/img/resources/RUBIES.png" class="resource-icon"></ion-img></div>
          </div>
          <ion-item class="mt-2">
            <div class="flex-center full-width">
              Your current upgrade queue {{model.upgrades.length}}/{{model.progress.builderQueueLength}}
            </div>
          </ion-item>
          <upgrade-item *ngFor="let item of model.upgrades" [item]="item"></upgrade-item>
          <div *ngIf="!getPart().upgradeTriggered">
            <div class="mt-2 flex-center" *ngIf="!upgradeSeconds">Cannot upgrade Vehicle Part higher than level {{getPart().level}}</div>
            <div class="mt-3" *ngIf="upgradeSeconds">
              Level {{getPart().level + 1}} {{converter.readableIdentifier(getPart().type)}}:
              <ul>
                <li *ngFor="let upgrade of getUpgrades()">{{upgrade}}</li>
              </ul>
              <div class="flex-space-between">
                <div *ngIf="hasEnoughResources">Upgrade costs</div>
                <div *ngIf="!hasEnoughResources">Insufficient resources</div>
                <div *ngFor="let cost of upgradeCosts" class="flex">
                  <div [class.color-red]="!model.hasEnoughResources(cost.resourceType, cost.value1)">{{model.getResourceAmount(cost.resourceType)}}</div>/{{cost.value1}}<ion-img src="assets/img/resources/{{cost.resourceType}}.png" class="resource-icon"></ion-img>
                </div>
              </div>
              <div class="mt-2 flex-center">
                <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
                <ion-button [disabled]="!hasEnoughResources || saving || model.upgrades.length >= model.progress.builderQueueLength" (click)="performUpgrade()">Upgrade Part to level {{getPart().level + 1}}</ion-button>
              </div>
            </div>
          </div>

          <div *ngIf="getPart().upgradeTriggered">
            <div class="mt-2 flex-center">
              <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
            </div>
          </div>
          
        </div>
    `
})
export class VehiclePartUpgradeModal {

    @Input() partId: number;

    upgradeSeconds: number = null;
    upgradeCosts: DynamicProperty[] = [];
    hasEnoughResources = true;

    saving = false;

    constructor(private modalCtrl: ModalController,
                public model: Model,
                public converter: ConverterService,
                private backendService: BackendService,
                private propertyService: PropertyService,
                private alertCtrl: AlertController) {
    }

    ionViewWillEnter() {
        let part = this.getPart();
        let type = 'PART_' + part.quality;

        let upTimes = this.propertyService.getUpgradeTime(type, part.level + 1);
        if (upTimes.length === 1) {
            this.upgradeSeconds = upTimes[0].value1;
        }
        this.upgradeCosts = this.propertyService.getUpgradeCosts(type, part.level + 1);
        this.hasEnoughResources = true;
        this.upgradeCosts.forEach(c => {
            if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
                this.hasEnoughResources = false;
            }
        });
    }

    getPart(): VehiclePart {
        return this.model.getVehiclePart(this.partId);
    }

    getUpgrades(): string[] {
        let upgrades: string[] = [];
        let part = this.getPart();
        this.propertyService.getProps(part.type + '_PART_' + part.quality, part.level + 1).forEach(p => {
            upgrades.push('+' + p.value1 + ' ' + this.converter.readableIdentifier(p.vehicleStat));
        });
        return upgrades;
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    performUpgrade() {
        if (this.hasEnoughResources && this.upgradeSeconds && this.model.upgrades.length < this.model.progress.builderQueueLength && !this.getPart().upgradeTriggered) {
            this.saving = true;
            this.backendService.upgradeVehiclePart(this.partId).subscribe(data => {
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