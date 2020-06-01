import {Component} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {ConverterService} from '../services/converter.service';

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
          <div class="flex">{{model.resources.steal}}/{{model.resources.stealMax}}
            <ion-img src="assets/icon/resources/STEAL.png" class="resource-icon"></ion-img>
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
          <div class="mt-2 flex-center" *ngIf="!getUpgradeSeconds()">Cannot upgrade {{converter.readableIdentifier(buildingType)}} higher than level {{getBuilding().level}}</div>
          <div class="mt-3" *ngIf="getUpgradeSeconds()">
            Upgrade {{converter.readableIdentifier(buildingType)}} to level {{getBuilding().level + 1}} to get:
            <ul>
              <li *ngFor="let upgrade of getUpgrades()">{{upgrade}}</li>
            </ul>
            <div class="flex-space-between">
              <div *ngIf="hasEnoughResources()">Upgrade costs</div>
              <div *ngIf="!hasEnoughResources()">Insufficient resources</div>
              <div *ngFor="let cost of getUpgradeCosts()" class="flex">
                <div [class.color-red]="!model.hasEnoughResources(cost.resourceType, cost.value1)" [class.color-green]="model.hasEnoughResources(cost.resourceType, cost.value1)">{{model.getResourceAmount(cost.resourceType)}}</div>/{{cost.value1}}
                <ion-img src="assets/icon/resources/{{cost.resourceType}}.png" class="resource-icon"></ion-img>
              </div>
            </div>
            <div class="mt-2 flex-center">
              <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
              <ion-button [disabled]="!hasEnoughResources() || saving || model.upgrades.length >= model.progress.builderQueueLength" (click)="performUpgrade()">Upgrade ({{converter.timeWithUnit(getUpgradeSeconds())}})</ion-button>
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
        FORGE: 'Upgrade Forge to improve your modification skills',
        GARAGE: 'Upgrade Garage to increase space for unused vehicles and parts',
        JEWELRY: 'Upgrade Jewelry to learn how to upgrade jewels to a higher level',
        LABORATORY: 'Upgrade Laboratory to gain more incubators and speed up cloning',
        STORAGE: 'Upgrade Storage to increase space for resources'
    };

    constructor(private modalCtrl: ModalController,
                private navParams: NavParams,
                public model: Model,
                public converter: ConverterService,
                private backendService: BackendService,
                private propertyService: PropertyService) {
        this.buildingType = navParams.get('buildingType');
    }

    getUpgradeSeconds(): number {
        let upTimes = this.propertyService.getUpgradeTime(this.buildingType, this.getBuilding().level + 1);
        if (upTimes.length === 1) {
            return upTimes[0].value1;
        }
    }

    getUpgradeCosts(): DynamicProperty[] {
        return this.propertyService.getUpgradeCosts(this.buildingType, this.getBuilding().level + 1);
    }

    hasEnoughResources(): boolean {
        this.getUpgradeCosts().forEach(c => {
            if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
                return false;
            }
        });
        return true;
    }

    getBuilding() {
        return this.model.getBuilding(this.buildingType);
    }

    getUpgrades(): string[] {
        let upgrades: string[] = [];
        let nextLevel = this.getBuilding().level + 1;
        if (this.buildingType === 'ACADEMY') {
            this.propertyService.getProps('ACADEMY_BUILDING', nextLevel).forEach(p => {
                upgrades.push('Max hero training level ' + p.value1);
            });
        }
        if (this.buildingType === 'BARRACKS') {
            this.propertyService.getProps('BARRACKS_BUILDING', nextLevel).forEach(p => {
                upgrades.push('+' + p.value1 + ' space for heroes');
            });
        }
        if (this.buildingType === 'FORGE') {
            this.propertyService.getProps('FORGE_MOD_RARITY', nextLevel).forEach(p => {
                upgrades.push('Modification level ' + p.value1);
            });
            this.propertyService.getProps('FORGE_MOD_SPEED', nextLevel).forEach(p => {
                upgrades.push('+' + p.value1 + '% modification speed');
            });
            this.propertyService.getProps('FORGE_BREAKDOWN_RARITY', nextLevel).forEach(p => {
                upgrades.push('Breakdown level ' + p.value1);
            });
            this.propertyService.getProps('FORGE_BREAKDOWN_RES', nextLevel).forEach(p => {
                upgrades.push('+' + p.value1 + '% resources when breaking down');
            });
            this.propertyService.getProps('FORGE_REROLL_QUAL', nextLevel).forEach(p => {
                upgrades.push('New modification: Re roll quality');
            });
            this.propertyService.getProps('FORGE_REROLL_STAT', nextLevel).forEach(p => {
                upgrades.push('New modification: Re roll stat');
            });
            this.propertyService.getProps('FORGE_INC_RARITY', nextLevel).forEach(p => {
                upgrades.push('New modification: Increase rarity');
            });
            this.propertyService.getProps('FORGE_REROLL_JEWEL', nextLevel).forEach(p => {
                upgrades.push('New modification: Re roll jewel slots');
            });
            this.propertyService.getProps('FORGE_ADD_JEWEL', nextLevel).forEach(p => {
                upgrades.push('New modification: Add jewel slot');
            });
            this.propertyService.getProps('FORGE_ADD_SP_JEWEL', nextLevel).forEach(p => {
                upgrades.push('New modification: Add set jewel slot');
            });
        }
        if (this.buildingType === 'GARAGE') {
            this.propertyService.getProps('GARAGE_BUILDING', nextLevel).forEach(p => {
                upgrades.push('+' + p.value1 + ' space for unused vehicles');
                if (p.value2) {
                    upgrades.push('+' + p.value2 + ' space for unused vehicle parts');
                }
            });
        }
        if (this.buildingType === 'JEWELRY') {
            this.propertyService.getProps('JEWELRY_BUILDING', nextLevel).forEach(p => {
                upgrades.push('Jewel upgrade level ' + p.value1);
            });
        }
        if (this.buildingType === 'LABORATORY') {
            this.propertyService.getProps('LABORATORY_INCUBATORS', nextLevel).forEach(p => {
                upgrades.push('+' + p.value1 + ' incubator');
            });
            this.propertyService.getProps('LABORATORY_SPEED', nextLevel).forEach(p => {
                upgrades.push('+' + p.value1 + '% cloning speed');
            });
        }
        if (this.buildingType === 'STORAGE') {
            this.propertyService.getProps('STORAGE_BUILDING', nextLevel).forEach(p => {
                upgrades.push('+' + p.value1 + ' ' + this.converter.readableIdentifier(p.resourceType));
            });
        }
        return upgrades;
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    performUpgrade() {
        if (this.hasEnoughResources() && this.getUpgradeSeconds() && this.model.upgrades.length < this.model.progress.builderQueueLength && !this.getBuilding().upgradeTriggered) {
            this.saving = true;
            this.backendService.upgradeBuilding(this.buildingType).subscribe(data => {
                this.saving = false;
            }, () => {
                this.saving = false;
            });

        }
    }
}