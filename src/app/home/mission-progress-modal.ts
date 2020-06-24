import {Component} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Vehicle} from '../domain/vehicle.model';
import {Mission} from '../domain/mission.model';
import {Hero} from '../domain/hero.model';
import {OfflineBattle} from '../domain/offlineBattle.model';
import {BackendService} from '../services/backend.service';

@Component({
    selector: 'mission-progress-popover',
    template: `
        <div class="ma-2 popover-scrollable">
          <div>{{mapName}} {{mission.posX + 'x' + mission.posY}}</div>
          <div class="flex-space-between mt-2">
            <div *ngIf="vehicle">
              <vehicle [vehicle]="vehicle" [small]="true"></vehicle>
            </div>
            <div *ngIf="hero1">
              <div class="bar-outer xp">
                <span class="bar-filled" [style.width]="(100 * hero1.xp / hero1.maxXp) + '%'"></span>
              </div>
              <div class="bar-outer thin asc mt-01">
                <span class="bar-filled" [style.width]="(100 * hero1.ascPoints / hero1.ascPointsMax) + '%'"></span>
              </div>
              <div class="mt-01 hero-tile-small border-grey flex-vert-center">
                <ion-img [src]="'assets/icon/chars/' + hero1.heroBase.avatar + '.png'" class="border-bottom-grey"></ion-img>
                <div class="top-left-bubble level-bubble background-{{hero1.heroBase.color}}">{{hero1.level}}</div>
                <ion-img [src]="'assets/img/star_' + hero1.stars + '.png'" class="hero-stars"></ion-img>
              </div>
            </div>
            <div *ngIf="hero2">
              <div class="bar-outer xp">
                <span class="bar-filled" [style.width]="(100 * hero2.xp / hero2.maxXp) + '%'"></span>
              </div>
              <div class="bar-outer thin asc mt-01">
                <span class="bar-filled" [style.width]="(100 * hero2.ascPoints / hero2.ascPointsMax) + '%'"></span>
              </div>
              <div class="mt-01 hero-tile-small border-grey flex-vert-center">
                <ion-img [src]="'assets/icon/chars/' + hero2.heroBase.avatar + '.png'" class="border-bottom-grey"></ion-img>
                <div class="top-left-bubble level-bubble background-{{hero2.heroBase.color}}">{{hero2.level}}</div>
                <ion-img [src]="'assets/img/star_' + hero2.stars + '.png'" class="hero-stars"></ion-img>
              </div>
            </div>
            <div *ngIf="hero3">
              <div class="bar-outer xp">
                <span class="bar-filled" [style.width]="(100 * hero3.xp / hero3.maxXp) + '%'"></span>
              </div>
              <div class="bar-outer thin asc mt-01">
                <span class="bar-filled" [style.width]="(100 * hero3.ascPoints / hero3.ascPointsMax) + '%'"></span>
              </div>
              <div class="mt-01 hero-tile-small border-grey flex-vert-center">
                <ion-img [src]="'assets/icon/chars/' + hero3.heroBase.avatar + '.png'" class="border-bottom-grey"></ion-img>
                <div class="top-left-bubble level-bubble background-{{hero3.heroBase.color}}">{{hero3.level}}</div>
                <ion-img [src]="'assets/img/star_' + hero3.stars + '.png'" class="hero-stars"></ion-img>
              </div>
            </div>
            <div *ngIf="hero4">
              <div class="bar-outer xp">
                <span class="bar-filled" [style.width]="(100 * hero4.xp / hero4.maxXp) + '%'"></span>
              </div>
              <div class="bar-outer thin asc mt-01">
                <span class="bar-filled" [style.width]="(100 * hero4.ascPoints / hero4.ascPointsMax) + '%'"></span>
              </div>
              <div class="mt-01 hero-tile-small border-grey flex-vert-center">
                <ion-img [src]="'assets/icon/chars/' + hero4.heroBase.avatar + '.png'" class="border-bottom-grey"></ion-img>
                <div class="top-left-bubble level-bubble background-{{hero4.heroBase.color}}">{{hero4.level}}</div>
                <ion-img [src]="'assets/img/star_' + hero4.stars + '.png'" class="hero-stars"></ion-img>
              </div>
            </div>
          </div>

          <div class="ma-2 time-bar">
            <span class="time-bar-inner" [style.width]="(100 * (mission.duration - mission.secondsUntilDone) / mission.duration) + '%'"></span>
          </div>
          
          <ion-list>
            <ion-item *ngFor="let battle of mission.battles; let idx = index">
              <div class="flex-space-between full-width">
                {{idx + 1}}. Battle:
                <span *ngIf="!battle.lootedItems && battle.battleSuccess">WON</span>
                <span *ngIf="battle.battleFinished && !battle.battleSuccess">LOST</span>
                <span *ngIf="battle.cancelled">CANCELLED</span>
                <span *ngIf="!battle.cancelled && !battle.battleStarted && !battle.battleFinished">Starting soon</span>
                <span *ngIf="!battle.cancelled && battle.battleStarted && !battle.battleFinished">{{progressInPercent(battle)}}%</span>
                <div *ngIf="battle.lootedItems" class="flex-space-around">
                  <loot-item *ngFor="let loot of battle.lootedItems" [loot]="loot" class="loot-item"></loot-item>
                </div>
              </div>
            </ion-item>
          </ion-list>
          
          <div class="flex-space-around">
            <ion-button color="medium" fill="clean" (click)="closeModal()">Close</ion-button>
            <ion-button *ngIf="!mission.lootCollected && mission.missionFinished" color="success" size="small" (click)="finishMission()" [disabled]="saving">Finish</ion-button>
            <ion-button *ngIf="!mission.missionFinished" color="danger" size="small" (click)="finishMission()" [disabled]="saving">Abort</ion-button>
          </div>
        </div>
    `
})
export class MissionProgressModal {

    mission: Mission;
    vehicle: Vehicle;
    hero1: Hero;
    hero2: Hero;
    hero3: Hero;
    hero4: Hero;

    mapName: string;

    saving = false;
    interval: number;

    constructor(private modalCtrl: ModalController,
                private navParams: NavParams,
                private model: Model,
                private backendService: BackendService) {
        this.mission = navParams.get('mission');
        this.init();

        this.interval = setInterval(() => {
            if (!this.mission.missionFinished) {
                let mission = this.model.missions.find(m => m.id === this.mission.id);
                if (mission) {
                    this.mission = mission;
                }
            }
        }, 200);
    }

    ionViewWillLeave() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    init() {
        this.vehicle = this.model.getVehicle(this.mission.vehicleId);
        this.hero1 = this.mission.hero1Id ? this.model.getHero(this.mission.hero1Id) : null;
        this.hero2 = this.mission.hero2Id ? this.model.getHero(this.mission.hero2Id) : null;
        this.hero3 = this.mission.hero3Id ? this.model.getHero(this.mission.hero3Id) : null;
        this.hero4 = this.mission.hero4Id ? this.model.getHero(this.mission.hero4Id) : null;
        let playerMap = this.model.playerMaps.find(m => m.mapId === this.mission.mapId);
        this.mapName = playerMap ? playerMap.name : 'Unknown';
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    progressInPercent(battle: OfflineBattle) {
        if (battle.secondsUntilDone <= 0) {
            return "100";
        }
        if (battle.secondsUntilDone >= battle.duration) {
            return "0";
        }
        return Math.floor((battle.duration - battle.secondsUntilDone) * 100 / battle.duration) + "";
    }

    finishMission() {
        this.saving = true;
        this.backendService.finishMission(this.mission.id).subscribe(data => {
            this.init();
            this.saving = false;
            if (data.missions && data.missions.length > 0) {
                this.mission = data.missions[0];
            } else {
                this.closeModal();
            }
        });
    }
}