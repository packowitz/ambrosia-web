import {Component} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'gear-upgrade-modal',
    template: `
      <div class="ma-2" *ngIf="gearId">
        <div class="flex-space-around">
          <div class="flex">{{model.resources.wood}}/{{model.resources.woodMax}}
            <ion-img src="assets/icon/resources/WOOD.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.brownCoal}}/{{model.resources.brownCoalMax}}
            <ion-img src="assets/icon/resources/BROWN_COAL.png" class="resource-icon"></ion-img>
          </div>
          <div class="flex">{{model.resources.blackCoal}}/{{model.resources.blackCoalMax}}
            <ion-img src="assets/icon/resources/BLACK_COAL.png" class="resource-icon"></ion-img>
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
          {{upgradeText[modification]}}
        </div>
        <div *ngIf="!getGear().modificationInProgress">
          <div class="mt-2 flex-center" *ngIf="!upgradeSeconds">Cannot perform modification as there was no configuration found</div>
          <div class="mt-3" *ngIf="upgradeSeconds">
            <div class="flex-space-around">
              <div *ngIf="hasEnoughResources">Modification costs</div>
              <div *ngIf="!hasEnoughResources">Insufficient resources</div>
              <div *ngFor="let cost of upgradeCosts" class="flex">
                <div [class.color-red]="!model.hasEnoughResources(cost.resourceType, cost.value1)">{{model.getResourceAmount(cost.resourceType)}}</div>/{{cost.value1}}
                <ion-img src="assets/icon/resources/{{cost.resourceType}}.png" class="resource-icon"></ion-img>
              </div>
            </div>
            <div class="mt-2 flex-center">
              <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
              <ion-button [disabled]="!hasEnoughResources || saving || model.upgrades.length >= model.progress.builderQueueLength" (click)="performUpgrade()">Modify ({{converter.timeWithUnit(upgradeSeconds)}})</ion-button>
            </div>
          </div>
        </div>

        <div *ngIf="getGear().modificationInProgress">
          <div class="mt-2 flex-center">
            <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
          </div>
        </div>

      </div>
    `
})
export class GearUpgradeModal {

    gearId;
    modification: string;

    upgradeSeconds: number = null;
    upgradeCosts: DynamicProperty[] = [];
    hasEnoughResources = true;

    saving = false;

    upgradeText = {
        REROLL_QUALITY: "Try your luck and re roll the item's quality (this modification is repeatable)",
        REROLL_STAT: "Try your luck and re roll the item's stat (this modification is repeatable)",
        INC_RARITY: "Upgrade the item's rarity by one (can only be done a single time)",
        ADD_JEWEL: 'Add another jewel slot to the item (after this modification you re roll that slot but not add another one)',
        REROLL_JEWEL_1: 'Try your luck and re roll jewel slot 1 (this modification is repeatable)',
        REROLL_JEWEL_2: 'Try your luck and re roll jewel slot 2 (this modification is repeatable)',
        REROLL_JEWEL_3: 'Try your luck and re roll jewel slot 3 (this modification is repeatable)',
        REROLL_JEWEL_4: 'Try your luck and re roll jewel slot 4 (this modification is repeatable)',
        ADD_SPECIAL_JEWEL: 'Add a set jewel slot to the item (can only be done a single time)'
    };

    constructor(private modalCtrl: ModalController,
                private navParams: NavParams,
                public model: Model,
                public converter: ConverterService,
                private backendService: BackendService,
                private propertyService: PropertyService) {
        this.modification = navParams.get('modification');
        this.gearId = navParams.get('gearId');
        this.init();
    }

    getProp() {
        if (this.modification === 'REROLL_QUALITY') { return 'GEAR_QUAL'; }
        if (this.modification === 'REROLL_STAT') { return 'GEAR_STAT'; }
        if (this.modification === 'INC_RARITY') { return 'GEAR_INC'; }
        if (this.modification === 'ADD_JEWEL') { return 'GEAR_ADD_JEWEL'; }
        if (this.modification === 'REROLL_JEWEL_1') { return 'GEAR_JEWEL'; }
        if (this.modification === 'REROLL_JEWEL_2') { return 'GEAR_JEWEL'; }
        if (this.modification === 'REROLL_JEWEL_3') { return 'GEAR_JEWEL'; }
        if (this.modification === 'REROLL_JEWEL_4') { return 'GEAR_JEWEL'; }
        if (this.modification === 'ADD_SPECIAL_JEWEL') { return 'GEAR_ADD_SPECIAL'; }
    }

    init() {
        let gear = this.getGear();
        let rarity = this.converter.rarityStars(gear.rarity);
        if (this.modification === 'INC_RARITY') {
            rarity ++;
        }
        let prop = this.getProp();
        let upTimes = this.propertyService.getUpgradeTime(prop, rarity);
        if (upTimes.length === 1) {
            this.upgradeSeconds = upTimes[0].value1 * 100 / this.model.progress.gearModificationSpeed;
        }
        this.upgradeCosts = this.propertyService.getUpgradeCosts(prop, rarity);
        this.hasEnoughResources = true;
        this.upgradeCosts.forEach(c => {
            if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
                this.hasEnoughResources = false;
            }
        });
    }

    getGear() {
        return this.model.getGear(this.gearId);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    performUpgrade() {
        if (this.hasEnoughResources && this.upgradeSeconds && this.model.upgrades.length < this.model.progress.builderQueueLength && !this.getGear().modificationInProgress) {
            this.saving = true;
            this.backendService.upgradeGear(this.gearId, this.modification).subscribe(() => {
                this.saving = false;
            }, () => {
                this.saving = false;
            });

        }
    }
}