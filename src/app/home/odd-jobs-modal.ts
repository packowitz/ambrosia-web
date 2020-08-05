import {Component} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {OddJob} from '../domain/oddJob.model';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {AchievementReward} from '../domain/achievementReward.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'odd-jobs-modal',
    template: `
        <div class="ma-2">
          <div class="flex-end">
            <ion-button size="small" fill="clear" color="dark" (click)="closeModal()">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </div>
          <ion-segment [(ngModel)]="tab">
            <ion-segment-button value="activity">
              <ion-label class="position-relative">Activity<div *ngIf="tab != 'activity' && hasClaimableActivity()" class="upgrade-bubble upgrade-possible">!</div></ion-label>
            </ion-segment-button>
            <ion-segment-button value="progress">
              <ion-label class="position-relative">Progress<div *ngIf="tab != 'progress' && hasClaimableAchievement()" class="upgrade-bubble upgrade-possible">!</div></ion-label>
            </ion-segment-button>
          </ion-segment>
          
          <ion-list *ngIf="tab == 'activity'" class="mt-3">
            <ion-item *ngIf="model.dailyActivity">
              <div class="full-width">
                <div class="flex-space-between pa-1">
                  <div *ngFor="let day of oneToFive" class="position-relative">
                    <div class="avatar daily flex-center" [class.small]="day != 5" [class.today]="isToday(day)" [class.claimed]="(dayClaimed(day) || dayClaimable(day)) && !isToday(day)" [class.pointer]="dayClaimable(day)" (click)="claimDaily(day)">
                      <img src="assets/img/equip.png" *ngIf="dayClaimed(day)">
                      <div *ngIf="dailyReward(day) as reward" class="flex-center">
                        {{reward.value1}}
                        <img src="assets/icon/resources/{{reward.resourceType}}.png" class="resource-icon">
                      </div>
                    </div>
                    <div class="avatar-bubble info" *ngIf="dayClaimable(day)">!</div>
                  </div>
                </div>
                <div class="flex-space-between pa-1 mb-3">
                  <div *ngFor="let day of sixToTen" class="position-relative">
                    <div class="avatar daily flex-center" [class.small]="day != 10" [class.today]="isToday(day)" [class.claimed]="(dayClaimed(day) || dayClaimable(day)) && !isToday(day)" [class.pointer]="dayClaimable(day)" (click)="claimDaily(day)">
                      <img src="assets/img/equip.png" *ngIf="dayClaimed(day)">
                      <div *ngIf="dailyReward(day) as reward" class="flex-center">
                        {{reward.value1}}
                        <img src="assets/icon/resources/{{reward.resourceType}}.png" class="resource-icon">
                      </div>
                    </div>
                    <div class="avatar-bubble info" *ngIf="dayClaimable(day)">!</div>
                  </div>
                </div>
              </div>
            </ion-item>
            <ion-item *ngFor="let oddJob of model.oddJobs">
              <div class="mt-3 mb-3 full-width">
                <div class="flex-space-between">
                  <div class="strong">{{oddJob.name}}</div>
                  <div class="flex-center">
                    <div *ngFor="let item of oddJob.reward" class="ml-05 flex-center">
                      <span *ngIf="item.resourceType">{{item.value}}</span>
                      <span *ngIf="item.progressStat">{{converter.readableProgressStatBonus(item.progressStat, item.value)}}</span>
                      <img *ngIf="item.resourceType" src="assets/icon/resources/{{item.resourceType}}.png" class="resource-icon">
                      <img *ngIf="item.progressStat" src="assets/icon/progress/{{item.progressStat}}.png" class="resource-icon">
                    </div>
                  </div>
                </div>
                <div class="flex-space-between mt-05">
                  <div class="flex-grow flex-wrap">{{getJobDescription(oddJob.jobType, oddJob.jobAmount)}}</div>
                  <div *ngIf="oddJob.jobAmountDone < oddJob.jobAmount" class="color-grey">{{oddJob.jobAmountDone}}/{{oddJob.jobAmount}}</div>
                  <ion-button *ngIf="oddJob.jobAmountDone >= oddJob.jobAmount" size="small" color="success" (click)="claimOddJob(oddJob)">
                    Claim
                  </ion-button>
                </div>
                <div class="time-bar light-border">
                  <span class="time-bar-inner" [style.width]="(100 * oddJob.jobAmountDone / oddJob.jobAmount) + '%'"></span>
                </div>
              </div>
            </ion-item>
            <ion-item *ngFor="let x of emptyJobs()">
              <div class="mt-3 mb-3 full-width color-grey">
                Send teams on an expedition to gain odd jobs
              </div>
            </ion-item>
          </ion-list>
          
          <ion-list *ngIf="tab == 'progress'" class="mt-3">
            <ion-item *ngFor="let reward of model.achievementRewards">
              <div class="mt-3 mb-3 full-width">
                <div class="flex-space-between">
                  <div class="strong">{{reward.name}}</div>
                  <div class="flex-center">
                    <div *ngFor="let item of reward.reward" class="ml-05 flex-center">
                      <span *ngIf="item.resourceType">{{item.value}}</span>
                      <span *ngIf="item.progressStat">{{converter.readableProgressStatBonus(item.progressStat, item.value)}}</span>
                      <img *ngIf="item.resourceType" src="assets/icon/resources/{{item.resourceType}}.png" class="resource-icon">
                      <img *ngIf="item.progressStat" src="assets/icon/progress/{{item.progressStat}}.png" class="resource-icon">
                    </div>
                  </div>
                </div>
                <div class="flex-space-between mt-05">
                  <div class="flex-grow flex-wrap">{{getRewardDescription(reward.achievementType, reward.achievementAmount)}}</div>
                  <div *ngIf="model.getAchievementAmount(reward.achievementType) < reward.achievementAmount" class="color-grey">{{model.getAchievementAmount(reward.achievementType)}}/{{reward.achievementAmount}}</div>
                  <ion-button *ngIf="model.getAchievementAmount(reward.achievementType) >= reward.achievementAmount" size="small" color="success" (click)="claimAchievementReward(reward)">
                    Claim
                  </ion-button>
                </div>
                <div class="time-bar light-border mt-05">
                  <span class="time-bar-inner" [style.width]="(100 * model.getAchievementAmount(reward.achievementType) / reward.achievementAmount) + '%'"></span>
                </div>
              </div>
            </ion-item>
          </ion-list>
        </div>
    `
})
export class OddJobsModal {

    saving = false;

    tab = 'activity';

    oneToFive = [1, 2, 3, 4, 5];
    sixToTen = [6, 7, 8, 9, 10];

    constructor(private modalCtrl: ModalController,
                private navParams: NavParams,
                public model: Model,
                public converter: ConverterService,
                private propertyService: PropertyService,
                private backendService: BackendService,
                private alertCtrl: AlertController) {
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    hasClaimableActivity(): boolean {
        if (!!this.model.oddJobs.find(o => o.jobAmountDone >= o.jobAmount)) {
            return true;
        }
        for (let i = 1; i <= this.model.dailyActivity.today; i++) {
            if (!!this.model.dailyActivity['day' + i] && !this.model.dailyActivity['day' + i + 'claimed']) {
                return true;
            }
        }
        return false;
    }

    hasClaimableAchievement(): boolean {
        return !!this.model.achievementRewards.find(a => this.model.getAchievementAmount(a.achievementType) >= a.achievementAmount);
    }

    claimDaily(day: number) {
        this.saving = true;
        if (this.dayClaimable(day)) {
            this.backendService.claimDaily(day).subscribe(() => {
                this.saving = false;
            }, () => this.saving = false );
        }
    }

    dayClaimed(day: number): boolean {
        return this.model.dailyActivity['day' + day + 'claimed'];
    }

    dayClaimable(day: number): boolean {
        return !!this.model.dailyActivity['day' + day] && !this.dayClaimed(day);
    }

    dailyReward(day: number): DynamicProperty {
        if (!this.dayClaimed(day)) {
            return this.propertyService.getProps('DAILY_REWARD', day)[0];
        }
    }

    isToday(day: number): boolean {
        return day === this.model.dailyActivity.today;
    }

    emptyJobs(): number[] {
        let emptyJobs = [];
        for (let i = 1; i <= this.model.progress.numberOddJobs; i++) {
            if (i > this.model.oddJobs.length) {
                emptyJobs.push(i);
            }
        }
        return emptyJobs;
    }

    claimOddJob(oddJob: OddJob) {
        this.saving = true;
        this.backendService.claimOddJob(oddJob).subscribe(() => {
            this.saving = false;
        }, () => this.saving = false );
    }

    removeOddJob(oddJob: OddJob) {
        this.alertCtrl.create({
            subHeader: 'Are you sure to reject this odd job?',
            buttons: [
                {text: 'Back'},
                {
                    text: 'Reject', handler: () => {
                        this.saving = true;
                        this.backendService.removeOddJob(oddJob).subscribe(() => {
                            this.saving = false;
                        }, () => this.saving = false);
                    }
                }
            ]
        }).then(a => a.present());
    }

    claimAchievementReward(reward: AchievementReward) {
        this.saving = true;
        this.backendService.claimAchievementReward(reward).subscribe(() => {
            this.saving = false;
        }, () => this.saving = false);
    }

    getJobDescription(jobType: string, number: number): string {
        switch (jobType) {
            case 'SPEND_STEAM': return 'Spend ' + number + ' Steam for either battles or map discovery';
            case 'SPEND_COGWHEELS': return 'Spend ' + number + ' Cogwheels for battles in dungeons';
            case 'SPEND_TOKENS': return 'Spend ' + number + ' Tokens in the arena';
            case 'FINISH_MISSIONS': return 'Finish ' + number + ' mission battles';
            case 'OPEN_CHESTS': return 'Open ' + number + ' chests anywhere on any map';
            case 'DISCOVER_TILES': return 'Discover ' + number + ' tiles on any map';
            case 'UPGRADE_BUILDING': return 'Finish ' + number + ' building upgrade' + (number > 1 ? 's' : '');
            case 'UPGRADE_VEHICLE': return 'Finish ' + number + ' vehicle upgrade' + (number > 1 ? 's' : '');
            case 'UPGRADE_PARTS': return 'Finish ' + number + ' vehicle part upgrade' + (number > 1 ? 's' : '');
            case 'MERGE_JEWELS': return 'Merge ' + number + ' jewel' + (number > 1 ? 's' : '') + ' to a higher one';
            case 'MODIFY_GEAR': return 'Perform ' + number + ' gear modification' + (number > 1 ? 's' : '');
            case 'BREAKDOWN_GEAR': return 'Break down ' + number + ' gear item' + (number > 1 ? 's' : '');
            case 'FINISH_EXPEDITIONS': return 'Finish ' + number + ' expedition' + (number > 1 ? 's' : '');
            case 'LOOT_GEAR': return 'Loot ' + number + ' gear item' + (number > 1 ? 's' : '') + ' from battles or chests';
            case 'LOOT_PARTS': return 'Loot ' + number + ' vehicle part' + (number > 1 ? 's' : '') + ' from battles or chests';
            case 'LOOT_COINS': return 'Loot ' + number + ' coin' + (number > 1 ? 's' : '') + ' from battles or chests';
            case 'LOOT_JEWELS': return 'Loot ' + number + ' jewels' + (number > 1 ? 's' : '') + ' from battles or chests';
            default: return 'Unknown job ' + jobType;
        }
    }

    getRewardDescription(type: string, number: number): string {
        switch (type) {
            case 'STEAM_USED': return 'Spend ' + number + ' Steam';
            case 'COGWHEELS_USED': return 'Spend ' + number + ' Cogwheels';
            case 'TOKENS_USED': return 'Spend ' + number + ' Tokens';
            case 'COINS_USED': return 'Spend ' + number + ' Coins';
            case 'RUBIES_USED': return 'Spend ' + number + ' Rubies';
            case 'METAL_USED': return 'Use ' + number + ' Metal';
            case 'IRON_USED': return 'Use ' + number + ' Iron';
            case 'STEEL_USED': return 'Use ' + number + ' Steel';
            case 'WOOD_USED': return 'Use ' + number + ' Wood';
            case 'BROWN_COAL_USED': return 'Use ' + number + ' Brown Coal';
            case 'BLACK_COAL_USED': return 'Use ' + number + ' Black Coal';
            case 'SIMPLE_INCUBATIONS': return 'Perform ' + number + ' simple incubations';
            case 'COMMON_INCUBATIONS': return 'Perform ' + number + ' common incubations';
            case 'UNCOMMON_INCUBATIONS': return 'Perform ' + number + ' uncommon incubations';
            case 'RARE_INCUBATIONS': return 'Perform ' + number + ' rare incubations';
            case 'EPIC_INCUBATIONS': return 'Perform ' + number + ' epic incubations';
            case 'EXPEDITIONS': return 'Finish ' + number + ' expeditions';
            case 'ODD_JOBS': return 'Complete ' + number + ' odd jobs';
            case 'DAILY_ACTIVITY': return 'Claim ' + number + ' daily activity rewards';
            case 'ACADEMY_XP': return 'Gain ' + number + ' XP in the academy';
            case 'ACADEMY_ASC': return 'Gain ' + number + ' ASC points in the academy';
            case 'MERCHANT_ITEMS_BOUGHT': return 'Purchase ' + number + ' items from the merchant';
            case 'MAP_TILES_DISCOVERED': return 'Discover ' + number + ' map tiles';
            case 'GEAR_MODIFICATIONS': return 'Perform ' + number + ' gear modifications';
            case 'JEWELS_MERGED': return 'Merge ' + number + ' jewels';
            case 'BUILDING_UPGRADES': return 'Perform ' + number + ' building upgrades';
            case 'VEHICLE_UPGRADES': return 'Perform ' + number + ' vehicle upgrades';
            case 'VEHICLE_PART_UPGRADES': return 'Perform ' + number + ' vehicle part upgrades';
            case 'BUILDING_MIN_LEVEL': return 'Have all buildings upgraded to level ' + number;
            case 'WOODEN_KEYS_COLLECTED': return 'Collect ' + number + ' wooden keys';
            case 'BRONZE_KEYS_COLLECTED': return 'Collect ' + number + ' bronze keys';
            case 'SILVER_KEYS_COLLECTED': return 'Collect ' + number + ' silver keys';
            case 'GOLDEN_KEYS_COLLECTED': return 'Collect ' + number + ' golden keys';
            case 'CHESTS_OPENED': return 'Open ' + number + ' chests';

            default: return 'Unknown progress type ' + type;
        }
    }
}