import {Component} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {ConverterService} from '../services/converter.service';
import {BuildingService} from '../services/building.service';

@Component({
    selector: 'building-upgrade-modal',
    template: `
      <div class="ma-2" *ngIf="buildingType">
        <div class="flex-space-around">
          <div class="flex">{{model.resources.metal}}/{{model.resources.metalMax}}
            <ion-img src="assets/icon/resources/METAL.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.iron}}/{{model.resources.ironMax}}
            <ion-img src="assets/icon/resources/IRON.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.steel}}/{{model.resources.steelMax}}
            <ion-img src="assets/icon/resources/STEEL.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.coins}}
            <ion-img src="assets/icon/resources/COINS.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.rubies}}
            <ion-img src="assets/icon/resources/RUBIES.png" class="resource-icon"></ion-img>
          </div>
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
          {{upgradeText[buildingType]}}
        </div>
        <div *ngIf="!getBuilding().upgradeTriggered">
          <div class="mt-2 flex-center" *ngIf="buildingService.getUpgradeSeconds(buildingType) < 0">Cannot upgrade {{converter.readableIdentifier(buildingType)}} higher
            than level {{getBuilding().level}}</div>
          <div class="mt-3" *ngIf="buildingService.getUpgradeSeconds(buildingType) > 0">
            Upgrade {{converter.readableIdentifier(buildingType)}} to level {{getBuilding().level + 1}} to get:
            <ul>
              <li *ngFor="let upgrade of getUpgrades()">{{upgrade}}</li>
            </ul>
            <div class="flex-space-between">
              <div *ngIf="buildingService.canEffortUpgradeBuilding(buildingType)">Upgrade costs</div>
              <div *ngIf="!buildingService.canEffortUpgradeBuilding(buildingType)">Insufficient resources</div>
              <div *ngFor="let cost of buildingService.getUpgradeCosts(buildingType)" class="flex">
                <div [class.color-red]="!model.hasEnoughResources(cost.resourceType, cost.value1)"
                     [class.color-green]="model.hasEnoughResources(cost.resourceType, cost.value1)">{{model.getResourceAmount(cost.resourceType)}}</div>
                /{{cost.value1}}
                <ion-img src="assets/icon/resources/{{cost.resourceType}}.png" class="resource-icon"></ion-img>
              </div>
            </div>
            <div class="mt-2 flex-center">
              <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
              <ion-button [disabled]="!buildingService.canEffortUpgradeBuilding(buildingType) || saving || model.upgrades.length >= model.progress.builderQueueLength"
                          (click)="performUpgrade()">Upgrade ({{converter.timeWithUnit(buildingService.getUpgradeSeconds(buildingType))}})
              </ion-button>
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

    buildingType;

    saving = false;

    upgradeText = {
        ACADEMY: 'Upgrade Academy to increase the level of heroes that can be trained',
        BARRACKS: 'Upgrade Barracks to increase space for heroes',
        BAZAAR: 'Upgrade Bazaar to get access to restricted areas and better deals',
        FORGE: 'Upgrade Forge to improve your modification skills',
        GARAGE: 'Upgrade Garage to increase upgrade level for vehicles and parts',
        JEWELRY: 'Upgrade Jewelry to learn how to upgrade jewels to a higher level',
        LABORATORY: 'Upgrade Laboratory to gain more incubators and speed up cloning',
        STORAGE: 'Upgrade Storage to increase space for resources'
    };

    constructor(private modalCtrl: ModalController,
                private navParams: NavParams,
                public model: Model,
                public converter: ConverterService,
                public buildingService: BuildingService,
                private backendService: BackendService,
                private propertyService: PropertyService) {
        this.buildingType = navParams.get('buildingType');
    }

    getBuilding() {
        return this.buildingService.getBuilding(this.buildingType);
    }

    getUpgrades(): string[] {
        let upgrades: string[] = [];
        let nextLevel = this.getBuilding().level + 1;

        if (this.buildingType === 'STORAGE') {
            this.propertyService.getProps('STORAGE_BUILDING', nextLevel).forEach(p => {
                upgrades.push('+' + p.value1 + ' ' + this.converter.readableIdentifier(p.resourceType));
            });
        } else {
            this.propertyService.getProps(this.buildingType + '_BUILDING', nextLevel).forEach(p => {
                upgrades.push(this.converter.readableProgressStat(p.progressStat, p.value1));
            });
        }
        return upgrades;
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    performUpgrade() {
        if (this.buildingService.canEffortUpgradeBuilding(this.buildingType) && this.model.upgrades.length < this.model.progress.builderQueueLength && !this.getBuilding().upgradeTriggered) {
            this.saving = true;
            this.backendService.upgradeBuilding(this.buildingType).subscribe(data => {
                this.saving = false;
            }, () => {
                this.saving = false;
            });

        }
    }
}