import {Component, Input} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'building-upgrade-modal',
    template: `
      <div class="ma-2" *ngIf="_buildingType">
        <div class="flex-space-around">
          <div class="flex">{{model.resources.metal}}/{{model.resources.metalMax}}
            <ion-img src="assets/img/resources/METAL.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.iron}}/{{model.resources.ironMax}}
            <ion-img src="assets/img/resources/IRON.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.steal}}/{{model.resources.stealMax}}
            <ion-img src="assets/img/resources/STEAL.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.coins}}
            <ion-img src="assets/img/resources/COINS.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.rubies}}
            <ion-img src="assets/img/resources/RUBIES.png" class="resource-icon"></ion-img>
          </div>
        </div>
        <div class="mt-2 flex-center">
          {{upgradeText[_buildingType]}}
        </div>
        <ion-item class="mt-2">
          <div class="flex-center full-width">
            Your current upgrade queue {{model.upgrades.length}}/{{model.progress.builderQueueLength}}
          </div>
        </ion-item>
        <upgrade-item *ngFor="let item of model.upgrades" [item]="item"></upgrade-item>
        <div *ngIf="!getBuilding().upgradeTriggered">
          <div class="mt-2 flex-center" *ngIf="!upgradeSeconds">Cannot upgrade {{converter.readableIdentifier(_buildingType)}} higher than level {{getBuilding().level}}</div>
          <div class="mt-3" *ngIf="upgradeSeconds">
            <div class="flex-space-around">
              <div *ngIf="hasEnoughResources">Upgrade costs</div>
              <div *ngIf="!hasEnoughResources">Insufficient resources</div>
              <div *ngFor="let cost of upgradeCosts" class="flex">
                <div [class.color-red]="!model.hasEnoughResources(cost.resourceType, cost.value1)">{{model.getResourceAmount(cost.resourceType)}}</div>/{{cost.value1}}
                <ion-img src="assets/img/resources/{{cost.resourceType}}.png" class="resource-icon"></ion-img>
              </div>
            </div>
            <div class="mt-2 flex-center">
              <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
              <ion-button [disabled]="!hasEnoughResources || saving || model.upgrades.length >= model.progress.builderQueueLength" (click)="performUpgrade()">Upgrade {{converter.readableIdentifier(_buildingType)}} to level {{getBuilding().level + 1}}</ion-button>
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
export class BuildingUpgradeModal {

    _buildingType;
    upgradeSeconds: number = null;
    upgradeCosts: DynamicProperty[] = [];
    hasEnoughResources = true;

    saving = false;

    upgradeText = {
        ACADEMY: 'Upgraded Academy can train your heroes to a higher level',
        BARRACKS: 'Upgraded Barracks provides more space for heroes',
        GARAGE: 'Upgraded Garage can store more vehicles and parts that are not parked in a slot or plugged into a vehicle',
        JEWELRY: 'Upgraded Jewelry allows you to upgrade jewels to a higher level',
        STORAGE: 'Upgraded Storage provides more space for your resources'
    };

    constructor(private modalCtrl: ModalController,
                public model: Model,
                public converter: ConverterService,
                private backendService: BackendService,
                private propertyService: PropertyService,
                private alertCtrl: AlertController) {
    }

    @Input('_buildingType')
    set buildingType(buildingType: string) {
        this._buildingType = buildingType;
        this.init();
    }

    init() {
        let upTimes = this.propertyService.getUpgradeTime(this._buildingType, this.getBuilding().level + 1);
        if (upTimes.length === 1) {
            this.upgradeSeconds = upTimes[0].value1;
        }
        this.upgradeCosts = this.propertyService.getUpgradeCosts(this._buildingType, this.getBuilding().level + 1);
        this.hasEnoughResources = true;
        this.upgradeCosts.forEach(c => {
            if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
                this.hasEnoughResources = false;
            }
        });
    }

    getBuilding() {
        return this.model.getBuilding(this._buildingType);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    performUpgrade() {
        if (this.hasEnoughResources && this.upgradeSeconds && this.model.upgrades.length < this.model.progress.builderQueueLength && !this.getBuilding().upgradeTriggered) {
            this.saving = true;
            this.backendService.upgradeBuilding(this._buildingType).subscribe(data => {
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