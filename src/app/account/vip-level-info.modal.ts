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
    selector: 'vip-level-info-modal',
    template: `
      <div class="ma-2 popover-scrollable">
        <div class="flex-space-between">
          <strong>VIP rewards</strong>
          <ion-button size="small" fill="clear" color="dark" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </div>
        <div class="mt-2">Level up your VIP level by buying packs in the store.</div>
        
        <div *ngFor="let level of levels" [class.color-grey]="level <= model.progress.vipLevel" class="mt-3">
          <div class="flex-space-between">
            <strong>Level {{level}}</strong>
            <div class="flex-grow flex-end">
              <div class="flex ml-1">
                {{getLevelVipPoints(level)}} VIP
              </div>
            </div>
          </div>
          <div *ngFor="let reward of getRewards(level)" class="font-small">
            <i *ngIf="reward.resourceType">+{{reward.value1}} {{converter.readableIdentifier(reward.resourceType)}}</i>
            <i *ngIf="reward.progressStat">{{converter.readableProgressStat(reward.progressStat, reward.value1)}}</i>
          </div>
        </div>

      </div>
    `
})
export class VipLevelInfoModal {

    levels = [];

    constructor(private modalCtrl: ModalController,
                public model: Model,
                public buildingService: BuildingService,
                public converter: ConverterService,
                private propertyService: PropertyService) {
        this.levels = [];
        for (let i = 1; i <= 20; i++) {
            this.levels.push(i);
        }
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getLevelVipPoints(level: number): number {
        let prop = this.propertyService.getProps('VIP_MAX_PLAYER', level);
        if (prop && prop.length > 0) {
            return prop[0].value1;
        }
        return -1;
    }

    getRewards(level: number): DynamicProperty[] {
        return this.propertyService.getProps('VIP_LEVEL_REWARD_PLAYER', level);
    }
}