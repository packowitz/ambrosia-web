import {Component, Input} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService, LootedItem} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {ConverterService} from '../services/converter.service';
import {Building} from '../domain/building.model';
import {BuildingService} from '../services/building.service';

@Component({
    selector: 'player-level-info-modal',
    template: `
      <div class="ma-2 popover-scrollable">
        <div class="flex-space-between">
          <strong>Player Level</strong>
          <ion-button size="small" fill="clear" color="dark" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </div>
        <div class="mt-2">Level up your player level by accomplishing odd jobs.</div>
        
        <div *ngFor="let level of levels" [class.color-grey]="level <= model.progress.level" class="mt-3">
          <div class="flex-space-between">
            <strong>Level {{level}}</strong>
            <div class="flex-grow flex-end">
              <div class="flex ml-1">
                {{getLevelXp(level)}}<img src="assets/icon/progress/PLAYER_XP.png" class="resource-icon">
              </div>
            </div>
          </div>
          <div *ngFor="let reward of getRewards(level)" class="font-small">
            <i *ngIf="reward.resourceType">+ {{reward.value1}} {{converter.readableIdentifier(reward.resourceType)}}</i>
            <i *ngIf="reward.progressStat" class="strong">{{converter.readableProgressStat(reward.progressStat, reward.value1)}}</i>
          </div>
        </div>

      </div>
    `
})
export class PlayerLevelInfoModal {

    levels = [];

    constructor(private modalCtrl: ModalController,
                public model: Model,
                public buildingService: BuildingService,
                public converter: ConverterService,
                private propertyService: PropertyService) {
        this.levels = [];
        for (let i = 2; i <= 60; i++) {
            this.levels.push(i);
        }
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getLevelXp(level: number): number {
        let prop = this.propertyService.getProps('XP_MAX_PLAYER', level);
        if (prop && prop.length > 0) {
            return prop[0].value1;
        }
        return -1;
    }

    getRewards(level: number): DynamicProperty[] {
        return this.propertyService.getProps('LEVEL_REWARD_PLAYER', level);
    }
}