import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
    selector: 'skill-icon-modal',
    template: `
        <div class="scrollable-vert">
            <div class="flex-center mt-2">
                <ion-img [src]="'assets/icon/skills/' + currentIcon + '.png'" class="skill_icon pointer" (click)="closeModal(currentIcon)"></ion-img>
                <div class="ml-4">Current Skill Icon</div>
            </div>
            <ion-segment [(ngModel)]="tab">
                <ion-segment-button value="BLUE">
                    <ion-label>Blue</ion-label>
                </ion-segment-button>
                <ion-segment-button value="GREEN">
                    <ion-label>Green</ion-label>
                </ion-segment-button>
                <ion-segment-button value="RED">
                    <ion-label>Red</ion-label>
                </ion-segment-button>
                <ion-segment-button value="NEUTRAL">
                    <ion-label>Neutral</ion-label>
                </ion-segment-button>
            </ion-segment>
            <div *ngIf="tab == 'BLUE'" class="flex flex-wrap">
                <ion-img *ngFor="let icon of blueIcons" [src]="'assets/icon/skills/' + icon + '.png'" class="skill_icon pointer ma-1" (click)="closeModal(icon)"></ion-img>
            </div>
            <div *ngIf="tab == 'GREEN'" class="flex flex-wrap">
                <ion-img *ngFor="let icon of greenIcons" [src]="'assets/icon/skills/' + icon + '.png'" class="skill_icon pointer ma-1" (click)="closeModal(icon)"></ion-img>
            </div>
            <div *ngIf="tab == 'RED'" class="flex flex-wrap">
                <ion-img *ngFor="let icon of redIcons" [src]="'assets/icon/skills/' + icon + '.png'" class="skill_icon pointer ma-1" (click)="closeModal(icon)"></ion-img>
            </div>
            <div *ngIf="tab == 'NEUTRAL'" class="flex flex-wrap">
                <ion-img *ngFor="let icon of neutralIcons" [src]="'assets/icon/skills/' + icon + '.png'" class="skill_icon pointer ma-1" (click)="closeModal(icon)"></ion-img>
            </div>
        </div>
    `
})
export class SkillIconModal implements OnInit {

    currentIcon = "";
    tab = "BLUE";

    blueIconCount = 224;
    blueIcons = [];
    greenIconCount = 224;
    greenIcons = [];
    redIconCount = 224;
    redIcons = [];
    neutralIconCount = 30;
    neutralIcons = [];

    constructor(private modalController: ModalController, private navParams: NavParams) {
        let counter = 1;
        while (counter <= this.blueIconCount) {
            let nr = ('00' + counter).slice(-3);
            this.blueIcons.push('blue_' + nr);
            counter ++;
        }
        counter = 1;
        while (counter <= this.greenIconCount) {
            let nr = ('00' + counter).slice(-3);
            this.greenIcons.push('green_' + nr);
            counter ++;
        }
        counter = 1;
        while (counter <= this.redIconCount) {
            let nr = ('00' + counter).slice(-3);
            this.redIcons.push('red_' + nr);
            counter ++;
        }
        counter = 1;
        while (counter <= this.neutralIconCount) {
            let nr = ('00' + counter).slice(-3);
            this.neutralIcons.push('neutral_' + nr);
            counter ++;
        }
    }

    ngOnInit(): void {
        this.currentIcon = this.navParams.data.currentIcon;
        this.tab = this.navParams.data.color;
    }

    async closeModal(icon: string) {
        this.modalController.dismiss(icon);
    }
}