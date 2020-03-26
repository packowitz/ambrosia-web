import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Vehicle} from '../domain/vehicle.model';
import {Fight} from '../domain/fight.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'start-mission-popover',
    template: `
        <div class="ma-2">
          <div class="flex-space-between mb-2">
            <div class="flex-grow">&nbsp;</div>
            <div class="flex" *ngIf="fight.resourceType == 'STEAM'">
              <div class="flex ml-2 mr-2">{{model.resources.premiumSteam}}/{{model.resources.premiumSteamMax}}<ion-img src="assets/img/resources/PREMIUM_STEAM.png" class="resource-icon" alt="premium steam"></ion-img></div>
              <div class="flex pointer" (click)="timer = !timer">{{timer ? ( model.resources.steam >= model.resources.steamMax ? 'max' : converter.time(model.resources.steamProduceIn) ) : model.resources.steam + '/' + model.resources.steamMax}}<ion-img src="assets/img/resources/STEAM.png" class="resource-icon" alt="steam"></ion-img></div>
            </div>
          </div>
          <ion-range min="1" [max]="max" [(ngModel)]="numberOfBattles">
            <ion-badge slot="end">{{numberOfBattles}}</ion-badge>
          </ion-range>
          <div class="flex-space-between mt-2">
            <div class="flex-grow">&nbsp;</div>
            <div class="flex">
              <ion-button color="medium" fill="clean" (click)="closeModal()">Cancel</ion-button>
              <ion-button color="success" size="small" (click)="closeModal(numberOfBattles)">Start ({{numberOfBattles * fight.costs}}<ion-img src="assets/img/resources/{{fight.resourceType}}.png" class="resource-icon"></ion-img>)</ion-button>
            </div>
          </div>
        </div>
    `
})
export class StartMissionPopover {

    fight: Fight;
    max: number;
    numberOfBattles: number;

    timer = false;

    constructor(private popoverController: PopoverController,
                private navParams: NavParams,
                private model: Model,
                private converter: ConverterService) {
        this.fight = navParams.get('fight');
        this.max = Math.min(this.maxNumberOfBattles(), this.model.progress.maxOfflineBattlesPerMission)
        this.numberOfBattles = this.max;
    }

    closeModal(number?: number) {
        this.popoverController.dismiss(number);
    }

    maxNumberOfBattles(): number {
        if (this.fight.resourceType === 'STEAM') {
            return Math.floor((this.model.resources.premiumSteam + this.model.resources.steam) / this.fight.costs);
        }
        if (this.fight.resourceType === 'COGWHEELS') {
            return Math.floor((this.model.resources.premiumCogwheels + this.model.resources.cogwheels) / this.fight.costs);
        }
        if (this.fight.resourceType === 'TOKENS') {
            return Math.floor((this.model.resources.premiumTokens + this.model.resources.tokens) / this.fight.costs);
        }
        return 0;
    }
}