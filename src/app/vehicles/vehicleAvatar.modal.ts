import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
    selector: 'skill-icon-modal',
    template: `
        <div class="scrollable-vert">
            <div class="flex-center mt-2">
                <ion-img [src]="'assets/img/vehicles/' + currentIcon + '.png'" class="hero-avatar-small pointer border-grey" (click)="closeModal(currentIcon)"></ion-img>
                <div class="ml-4">Current Avatar</div>
            </div>
            <div class="flex flex-wrap">
                <ion-img *ngFor="let icon of avatars" [src]="'assets/img/vehicles/' + icon + '.png'" class="hero-avatar-small pointer border-grey ma-1" (click)="closeModal(icon)"></ion-img>
            </div>
        </div>
    `
})
export class VehicleAvatarModal implements OnInit {

    currentIcon = "";

    avatarCount = 12;
    avatars = [];

    constructor(private modalController: ModalController, private navParams: NavParams) {
        let counter = 1;
        while (counter <= this.avatarCount) {
            let nr = ('00' + counter).slice(-3);
            this.avatars.push('vehicle_' + nr);
            counter ++;
        }
    }

    ngOnInit(): void {
        this.currentIcon = this.navParams.data.currentIcon;
    }

    async closeModal(icon: string) {
        this.modalController.dismiss(icon);
    }
}