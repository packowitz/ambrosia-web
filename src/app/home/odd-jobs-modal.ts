import {Component} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Vehicle} from '../domain/vehicle.model';
import {Mission} from '../domain/mission.model';
import {Hero} from '../domain/hero.model';
import {OfflineBattle} from '../domain/offlineBattle.model';
import {BackendService} from '../services/backend.service';
import {OddJob} from '../domain/oddJob.model';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';

@Component({
    selector: 'odd-jobs-modal',
    template: `
        <div class="ma-2">
          <div class="flex-space-between">
            <div class="strong">Activity board</div>
            <ion-button size="small" fill="clear" color="dark" (click)="closeModal()">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </div>
          <ion-list class="mt-3">
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
                  <div class="flex-grow flex-wrap">{{getJobDescription(oddJob.jobType, oddJob.jobAmount)}}</div>
                  <div class="color-grey mr-2">{{oddJob.jobAmountDone}}/{{oddJob.jobAmount}}</div>
                  <div class="flex-center flex-no-shrink">
                    <div *ngFor="let item of oddJob.reward" class="ml-05">
                      <span>{{item.value}}</span>
                      <img *ngIf="item.resourceType" src="assets/icon/resources/{{item.resourceType}}.png" class="resource-icon">
                      <img *ngIf="item.progressStat" src="assets/icon/progress/{{item.progressStat}}.png" class="resource-icon">
                    </div>
                    <ion-button *ngIf="oddJob.jobAmountDone < oddJob.jobAmount" size="small" fill="clear" color="dark" (click)="removeOddJob(oddJob)">
                      <ion-icon name="trash-outline"></ion-icon>
                    </ion-button>
                    <ion-button *ngIf="oddJob.jobAmountDone >= oddJob.jobAmount" size="small" color="success" (click)="claimOddJob(oddJob)">
                      Claim
                    </ion-button>
                  </div>
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
        </div>
    `
})
export class OddJobsModal {

    saving = false;

    oneToFive = [1, 2, 3, 4, 5];
    sixToTen = [6, 7, 8, 9, 10];

    constructor(private modalCtrl: ModalController,
                private navParams: NavParams,
                private model: Model,
                private propertyService: PropertyService,
                private backendService: BackendService,
                private alertCtrl: AlertController) {
    }

    closeModal() {
        this.modalCtrl.dismiss();
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

    getJobDescription(jobType: string, number: number): string {
        switch (jobType) {
            case 'SPEND_STEAM': return 'Spend ' + number + ' Steam for either battles or map discovery.';
            case 'SPEND_COGWHEELS': return 'Spend ' + number + ' Cogwheels for battles in dungeons.';
            case 'SPEND_TOKENS': return 'Spend ' + number + ' Tokens in the arena';
            case 'FINISH_MISSIONS': return 'Finish ' + number + ' mission battles';
            case 'OPEN_CHESTS': return 'Open ' + number + ' chests anywhere on the map';
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
            default: return 'Unknown job ' + jobType;
        }
    }
}