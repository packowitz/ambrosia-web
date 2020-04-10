import {Component, Input} from '@angular/core';
import {ConverterService} from '../services/converter.service';
import {Upgrade} from '../domain/upgrade.model';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'upgrade-item',
    template: `
      <ion-item>
        <div class="flex-space-between full-width">
          <div>{{item.position}}.</div>
          <div *ngIf="item.buildingType" class="building-avatar ma-2">
            <ion-img src="assets/img/buildings/{{item.buildingType}}.png"></ion-img>
          </div>
          <div *ngIf="item.buildingType">
            Upgrading {{converter.readableIdentifier(item.buildingType)}} to level {{getNextLevel()}}
          </div>
          <div class="flex-grow">&nbsp;</div>
          <div>
            {{progressInPercent()}}%
          </div>
          <ion-button *ngIf="!item.finished" (click)="moveUpgradeUp()" fill="clear" shape="round" size="small" [disabled]="saving || item.position == 1"><ion-icon slot="icon-only" name="chevron-up-circle-outline"></ion-icon></ion-button>
          <ion-button *ngIf="!item.finished" (click)="cancelUpgrade()" color="danger" fill="clear" shape="round" size="small" [disabled]="saving"><ion-icon slot="icon-only" name="close-circle-outline"></ion-icon></ion-button>
          <ion-button *ngIf="item.finished" (click)="finishUpgrade()" color="success" fill="clear" shape="round" size="small" [disabled]="saving"><ion-icon slot="icon-only" name="checkmark-circle-outline"></ion-icon></ion-button>
        </div>
      </ion-item>
    `
})
export class UpgradeItemDirective {
    @Input() item: Upgrade;

    saving = false;

    constructor(private model: Model,
                private backendService: BackendService,
                public converter: ConverterService,
                private alertCtrl: AlertController) {
    }

    getNextLevel() {
        if (this.item.buildingType) {
            return this.model.buildings.find(b => b.type === this.item.buildingType).level + 1;
        }
    }

    progressInPercent() {
        if (this.item.secondsUntilDone <= 0) {
            return "100";
        }
        if (this.item.secondsUntilDone >= this.item.duration) {
            return "0";
        }
        return Math.floor((this.item.duration - this.item.secondsUntilDone) * 100 / this.item.duration) + "";
    }

    finishUpgrade() {
        this.saving = true;
        this.backendService.finishUpgrade(this.item.id).subscribe(data => {
            this.saving = false;
        }, error => {
            this.saving = false;
            this.alertCtrl.create({
                header: 'Server error',
                message: error.error.message,
                buttons: [{text: 'Okay'}]
            }).then(data => data.present());
        });
    }

    cancelUpgrade() {
        this.saving = true;
        this.backendService.cancelUpgrade(this.item.id).subscribe(data => {
            this.saving = false;
        }, error => {
            this.saving = false;
            this.alertCtrl.create({
                header: 'Server error',
                message: error.error.message,
                buttons: [{text: 'Okay'}]
            }).then(data => data.present());
        });
    }

    moveUpgradeUp() {
        this.saving = true;
        this.backendService.moveUpgradeUp(this.item.id).subscribe(data => {
            this.saving = false;
        }, error => {
            this.saving = false;
            this.alertCtrl.create({
                header: 'Server error',
                message: error.error.message,
                buttons: [{text: 'Okay'}]
            }).then(data => data.present());
        });
    }

}
