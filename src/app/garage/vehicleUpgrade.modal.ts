import {Component, Input} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {Vehicle} from '../domain/vehicle.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'vehicle-upgrade-modal',
    template: `
        <div class="ma-2">
          <div class="flex-space-around">
            <div class="flex">{{model.resources.metal}}/{{model.resources.metalMax}}<ion-img src="assets/icon/resources/METAL.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.iron}}/{{model.resources.ironMax}}<ion-img src="assets/icon/resources/IRON.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.steal}}/{{model.resources.stealMax}}<ion-img src="assets/icon/resources/STEAL.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.coins}}<ion-img src="assets/icon/resources/COINS.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.rubies}}<ion-img src="assets/icon/resources/RUBIES.png" class="resource-icon"></ion-img></div>
          </div>
          <ion-item class="mt-2">
            <div class="flex-center full-width" *ngIf="model.upgrades.length == 0">
              Your current upgrade queue is&nbsp;<i>empty</i>
            </div>
            <div class="flex-center full-width" *ngIf="model.upgrades.length > 0">
              Your current upgrade queue {{model.upgrades.length}}/{{model.progress.builderQueueLength}}
            </div>
          </ion-item>
          <upgrade-item *ngFor="let item of model.upgrades" [item]="item"></upgrade-item>
          <div class="mt-2 flex-center">
            Upgrade Vehicles to level {{getVehicle().level + 1}} to allow to plugin level {{getVehicle().level + 1}} parts
          </div>
          <div *ngIf="!getVehicle().upgradeTriggered">
            <div class="mt-2 flex-center" *ngIf="!upgradeSeconds">Cannot upgrade Vehicle higher than level {{getVehicle().level}}</div>
            <div class="mt-3" *ngIf="upgradeSeconds">
              <div class="flex-space-between">
                <div *ngIf="hasEnoughResources">Upgrade costs</div>
                <div *ngIf="!hasEnoughResources">Insufficient resources</div>
                <div *ngFor="let cost of upgradeCosts" class="flex">
                  <div [class.color-red]="!model.hasEnoughResources(cost.resourceType, cost.value1)">{{model.getResourceAmount(cost.resourceType)}}</div>/{{cost.value1}}<ion-img src="assets/icon/resources/{{cost.resourceType}}.png" class="resource-icon"></ion-img>
                </div>
              </div>
              <div class="mt-2 flex-center">
                <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
                <ion-button [disabled]="!hasEnoughResources || saving || model.upgrades.length >= model.progress.builderQueueLength" (click)="performUpgrade()">Upgrade ({{converter.timeWithUnit(upgradeSeconds)}})</ion-button>
              </div>
            </div>
          </div>

          <div *ngIf="getVehicle().upgradeTriggered">
            <div class="mt-2 flex-center">
              <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
            </div>
          </div>
          
        </div>
    `
})
export class VehicleUpgradeModal {

    @Input() vehicleId: number;

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
        let vehicle = this.getVehicle();
        let nrSpecialParts = 0;
        if (vehicle.specialPart3) {
            nrSpecialParts = 3;
        } else if (vehicle.specialPart2) {
            nrSpecialParts = 2;
        } else if (vehicle.specialPart1) {
            nrSpecialParts = 1;
        }
        let type = 'VEHICLE_' + nrSpecialParts;

        let upTimes = this.propertyService.getUpgradeTime(type, vehicle.level + 1);
        if (upTimes.length === 1) {
            this.upgradeSeconds = upTimes[0].value1;
        }
        this.upgradeCosts = this.propertyService.getUpgradeCosts(type, vehicle.level + 1);
        this.hasEnoughResources = true;
        this.upgradeCosts.forEach(c => {
            if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
                this.hasEnoughResources = false;
            }
        });
    }

    getVehicle(): Vehicle {
        return this.model.getVehicle(this.vehicleId);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    performUpgrade() {
        if (this.hasEnoughResources && this.upgradeSeconds && this.model.upgrades.length < this.model.progress.builderQueueLength && !this.getVehicle().upgradeTriggered) {
            this.saving = true;
            this.backendService.upgradeVehicle(this.vehicleId).subscribe(data => {
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