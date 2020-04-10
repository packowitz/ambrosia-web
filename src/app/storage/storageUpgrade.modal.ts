import {Component} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Vehicle} from '../domain/vehicle.model';
import {Mission} from '../domain/mission.model';
import {Hero} from '../domain/hero.model';
import {OfflineBattle} from '../domain/offlineBattle.model';
import {BackendService} from '../services/backend.service';
import {Building} from '../domain/building.model';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';

@Component({
    selector: 'storage-upgrade-modal',
    template: `
        <div class="ma-2">
          <div class="flex-space-around">
            <div class="flex">{{model.resources.metal}}/{{model.resources.metalMax}}<ion-img src="assets/img/resources/METAL.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.iron}}/{{model.resources.ironMax}}<ion-img src="assets/img/resources/IRON.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.steal}}/{{model.resources.stealMax}}<ion-img src="assets/img/resources/STEAL.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.coins}}<ion-img src="assets/img/resources/COINS.png" class="resource-icon"></ion-img></div>
            <div class="flex">{{model.resources.rubies}}<ion-img src="assets/img/resources/RUBIES.png" class="resource-icon"></ion-img></div>
          </div>
          <div class="mt-2 flex-center">
            Upgraded Storage provides more space for your resources
          </div>
          <ion-item class="mt-2">
            <div class="flex-center full-width">
              Your current building queue {{model.upgrades.length}}/{{model.progress.builderQueueLength}}
            </div>
          </ion-item>
          <upgrade-item *ngFor="let item of model.upgrades" [item]="item"></upgrade-item>
          <div *ngIf="!getBuilding().upgradeTriggered">
            <div class="mt-2 flex-center" *ngIf="!upgradeSeconds">Cannot upgrade Storage higher than level {{getBuilding().level}}</div>
            <div class="mt-3" *ngIf="upgradeSeconds">
              <div class="flex-space-around">
                <div *ngIf="hasEnoughResources">Upgrade costs</div>
                <div *ngIf="!hasEnoughResources">Insufficient resources</div>
                <div *ngFor="let cost of upgradeCosts" class="flex">
                  <div [class.color-red]="!model.hasEnoughResources(cost.resourceType, cost.value1)">{{model.getResourceAmount(cost.resourceType)}}</div>/{{cost.value1}}<ion-img src="assets/img/resources/{{cost.resourceType}}.png" class="resource-icon"></ion-img>
                </div>
              </div>
              <div class="mt-2 flex-center">
                <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
                <ion-button [disabled]="!hasEnoughResources || saving || model.upgrades.length >= model.progress.builderQueueLength" (click)="performUpgrade()">Upgrade Barracks to level {{getBuilding().level + 1}}</ion-button>
              </div>
            </div>
          </div>

          <div *ngIf="getBuilding().upgradeTriggered">
            <div class="mt-2 flex-center">
              <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
            </div>
          </div>
          
        </div>
    `
})
export class StorageUpgradeModal {

    buildingType = "STORAGE";
    upgradeSeconds: number = null;
    upgradeCosts: DynamicProperty[] = [];
    hasEnoughResources = true;

    saving = false;

    constructor(private modalCtrl: ModalController,
                private model: Model,
                private backendService: BackendService,
                private propertyService: PropertyService,
                private alertCtrl: AlertController) {
        this.init();
    }

    init() {
        let upTimes = this.propertyService.getBuildingUpgradeTime(this.buildingType, this.getBuilding().level + 1);
        if (upTimes.length === 1) {
            this.upgradeSeconds = upTimes[0].value1;
        }
        this.upgradeCosts = this.propertyService.getBuildingUpgradeCosts(this.buildingType, this.getBuilding().level + 1);
        this.hasEnoughResources = true;
        this.upgradeCosts.forEach(c => {
            if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
                this.hasEnoughResources = false;
            }
        });
    }

    getBuilding() {
        return this.model.getBuilding(this.buildingType);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    performUpgrade() {
        if (this.hasEnoughResources && this.upgradeSeconds && this.model.upgrades.length < this.model.progress.builderQueueLength && !this.getBuilding().upgradeTriggered) {
            this.saving = true;
            this.backendService.upgradeBuilding(this.buildingType).subscribe(data => {
                this.saving = false;
                this.init();
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