import {Component} from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Vehicle} from '../domain/vehicle.model';
import {Hero} from '../domain/hero.model';
import {BackendService} from '../services/backend.service';
import {PlayerExpedition} from '../domain/playerExpedition.model';
import {ConverterService} from '../services/converter.service';
import {GearService} from '../services/gear.service';
import {Gear} from '../domain/gear.model';

@Component({
    selector: 'expedition-progress-popover',
    template: `
        <div class="ma-2 popover-scrollable">
          <div class="bold flex-space-between">
            <div>{{playerExpedition.name}}</div>
            <div *ngIf="playerExpedition.secondsUntilDone > 0">{{converter.timeWithUnit(playerExpedition.secondsUntilDone)}}</div>
            <div *ngIf="playerExpedition.secondsUntilDone <= 0">done</div>
          </div>
          <div class="flex-space-between mt-2">
            <div *ngIf="vehicle">
              <vehicle [vehicle]="vehicle" [small]="true" [showName]="false"></vehicle>
            </div>
            <div *ngIf="hero1">
              <div class="bar-outer xp">
                <span class="bar-filled" [style.width]="(100 * hero1.xp / hero1.maxXp) + '%'"></span>
              </div>
              <div class="mt-01 hero-tile-small border-grey flex-vert-center">
                <ion-img [src]="'assets/icon/chars/' + hero1.avatar + '.png'" class="border-bottom-grey"></ion-img>
                <div class="top-left-bubble level-bubble background-{{hero1.color}}">{{hero1.level}}</div>
                <ion-img [src]="'assets/img/star_' + hero1.stars + '.png'" class="hero-stars"></ion-img>
              </div>
            </div>
            <div *ngIf="hero2">
              <div class="bar-outer xp">
                <span class="bar-filled" [style.width]="(100 * hero2.xp / hero2.maxXp) + '%'"></span>
              </div>
              <div class="mt-01 hero-tile-small border-grey flex-vert-center">
                <ion-img [src]="'assets/icon/chars/' + hero2.avatar + '.png'" class="border-bottom-grey"></ion-img>
                <div class="top-left-bubble level-bubble background-{{hero2.color}}">{{hero2.level}}</div>
                <ion-img [src]="'assets/img/star_' + hero2.stars + '.png'" class="hero-stars"></ion-img>
              </div>
            </div>
            <div *ngIf="hero3">
              <div class="bar-outer xp">
                <span class="bar-filled" [style.width]="(100 * hero3.xp / hero3.maxXp) + '%'"></span>
              </div>
              <div class="mt-01 hero-tile-small border-grey flex-vert-center">
                <ion-img [src]="'assets/icon/chars/' + hero3.avatar + '.png'" class="border-bottom-grey"></ion-img>
                <div class="top-left-bubble level-bubble background-{{hero3.color}}">{{hero3.level}}</div>
                <ion-img [src]="'assets/img/star_' + hero3.stars + '.png'" class="hero-stars"></ion-img>
              </div>
            </div>
            <div *ngIf="hero4">
              <div class="bar-outer xp">
                <span class="bar-filled" [style.width]="(100 * hero4.xp / hero4.maxXp) + '%'"></span>
              </div>
              <div class="mt-01 hero-tile-small border-grey flex-vert-center">
                <ion-img [src]="'assets/icon/chars/' + hero4.avatar + '.png'" class="border-bottom-grey"></ion-img>
                <div class="top-left-bubble level-bubble background-{{hero4.color}}">{{hero4.level}}</div>
                <ion-img [src]="'assets/img/star_' + hero4.stars + '.png'" class="hero-stars"></ion-img>
              </div>
            </div>
          </div>

          <div class="ma-2 time-bar">
            <span class="time-bar-inner" [style.width]="(100 * (playerExpedition.duration - playerExpedition.secondsUntilDone) / playerExpedition.duration) + '%'"></span>
          </div>
          
          <div class="ma-2">{{playerExpedition.description}}</div>

          <div *ngIf="playerExpedition.lootedItems" class="ma-2 flex-space-around">
            <loot-item *ngFor="let loot of playerExpedition.lootedItems" [loot]="loot" class="loot-item"></loot-item>
          </div>
          
          <div class="mt-2 flex-space-around">
            <ion-button color="medium" fill="clean" (click)="closeModal()">Close</ion-button>
            <ion-button *ngIf="!playerExpedition.completed && playerExpedition.secondsUntilDone <= 0" color="success" size="small" (click)="finishExpedition()" [disabled]="saving">Finish</ion-button>
            <ion-button *ngIf="!playerExpedition.completed && playerExpedition.secondsUntilDone > 0" color="danger" size="small" (click)="abortExpedition()" [disabled]="saving">Abort</ion-button>
          </div>
        </div>
    `
})
export class ExpeditionProgressModal {

    playerExpedition: PlayerExpedition;
    vehicle: Vehicle;
    hero1: Hero;
    hero2: Hero;
    hero3: Hero;
    hero4: Hero;

    saving = false;
    interval: number;

    constructor(private modalCtrl: ModalController,
                private navParams: NavParams,
                public model: Model,
                private backendService: BackendService,
                private alertCtrl: AlertController,
                public converter: ConverterService,
                private gearService: GearService) {
        this.playerExpedition = navParams.get('playerExpedition');
        this.init();
    }

    init() {
        this.vehicle = this.model.getVehicle(this.playerExpedition.vehicleId);
        this.hero1 = this.playerExpedition.hero1Id ? this.model.getHero(this.playerExpedition.hero1Id) : null;
        this.hero2 = this.playerExpedition.hero2Id ? this.model.getHero(this.playerExpedition.hero2Id) : null;
        this.hero3 = this.playerExpedition.hero3Id ? this.model.getHero(this.playerExpedition.hero3Id) : null;
        this.hero4 = this.playerExpedition.hero4Id ? this.model.getHero(this.playerExpedition.hero4Id) : null;
    }

    closeModal() {
        if (this.playerExpedition.lootedItems) {
            let autoBreakdown: Gear[] = [];
            this.playerExpedition.lootedItems.forEach(item => {
                if (item.type === 'GEAR') {
                    const gear = this.model.getGear(item.value);
                    if (gear.markedToBreakdown) {
                        autoBreakdown.push(gear);
                    }
                }
            });
            if (autoBreakdown.length > 0) {
                this.saving = true;
                this.backendService.breakdownGear(autoBreakdown, true).subscribe(() => {
                    this.saving = false;
                    this.modalCtrl.dismiss();
                }, () => this.saving = false);
            } else {
                this.modalCtrl.dismiss();
            }
        } else {
            this.modalCtrl.dismiss();
        }
    }

    abortExpedition() {
        this.alertCtrl.create({
            subHeader: 'Are you sure to abort this expedition?',
            buttons: [
                {text: 'Back'},
                {text: 'Abort', handler: () => this.finishExpedition()}
            ]
        }).then(a => a.present());
    }

    finishExpedition() {
        this.saving = true;
        this.backendService.finishExpedition(this.playerExpedition.id).subscribe(() => {
            this.playerExpedition = this.model.playerExpeditions.find(p => p.id === this.playerExpedition.id);
            this.gearService.checkAutoBreakdown(this.playerExpedition.lootedItems);
            this.init();
            this.saving = false;
        }, () => this.saving = false );
    }
}
