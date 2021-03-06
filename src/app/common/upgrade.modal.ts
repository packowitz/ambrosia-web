import {Component, Input} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {PropertyService} from '../services/property.service';
import {DynamicProperty} from '../domain/property.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'upgrade-modal',
    template: `
      <div class="ma-2">
        <div class="flex-space-around">
          <div class="flex">
            <ion-img src="assets/icon/resources/METAL.png" class="resource-icon"></ion-img>
            {{model.resources.metal}}/{{model.resources.metalMax}}
          </div>
          <div class="flex">
            <ion-img src="assets/icon/resources/IRON.png" class="resource-icon"></ion-img>
            {{model.resources.iron}}/{{model.resources.ironMax}}
          </div>
          <div class="flex">
            <ion-img src="assets/icon/resources/STEEL.png" class="resource-icon"></ion-img>
            {{model.resources.steel}}/{{model.resources.steelMax}}
          </div>
          <div class="flex">
            <ion-img src="assets/icon/resources/COINS.png" class="resource-icon"></ion-img>
            {{model.resources.coins}}
          </div>
          <div class="flex">
            <ion-img src="assets/icon/resources/RUBIES.png" class="resource-icon"></ion-img>
            {{model.resources.rubies}}
          </div>
        </div>
        <ion-item class="mt-2">
          <div class="flex-center full-width">
            Your current upgrade queue {{model.upgrades.length}}/{{model.progress.builderQueueLength}}
          </div>
        </ion-item>
        <upgrade-item *ngFor="let item of model.upgrades" [item]="item"></upgrade-item>

        <div>
          <div class="mt-2 flex-center">
            <ion-button color="danger" fill="outline" (click)="closeModal()">Close</ion-button>
          </div>
        </div>

      </div>
    `
})
export class UpgradeModal {

    constructor(private modalCtrl: ModalController,
                public model: Model,
                public converter: ConverterService) {
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }
}
