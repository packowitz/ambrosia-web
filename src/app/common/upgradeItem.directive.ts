import {Component, Input} from '@angular/core';
import {ConverterService} from '../services/converter.service';
import {Upgrade} from '../domain/upgrade.model';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {Vehicle} from '../domain/vehicle.model';
import {VehiclePart} from '../domain/vehiclePart.model';
import {Gear} from '../domain/gear.model';

@Component({
    selector: 'upgrade-item',
    template: `
      <ion-item>
        <div class="flex-space-between full-width">
          <div>{{item.position}}.</div>
          <div *ngIf="item.buildingType" class="building-avatar ma-2">
            <ion-img src="assets/icon/buildings/{{item.buildingType}}.png"></ion-img>
          </div>
          <div *ngIf="item.vehicleId" class="ma-2">
            <ion-img class="vehicle-only-avatar" src="assets/img/vehicles/{{getVehicle().baseVehicle.avatar}}.png"></ion-img>
          </div>
          <div *ngIf="item.vehiclePartId" class="ma-2">
            <ion-img src="/assets/img/vehicles/parts/{{getVehiclePart().type + '_' + getVehiclePart().quality}}.png"></ion-img>
          </div>
          <div *ngIf="item.gearId" class="ma-2">
            <gear-icon [gear]="getGear()" [type]="getGear().type"></gear-icon>
          </div>
          <div *ngIf="item.jewelType" class="ma-2">
            <img src="assets/img/jewels/{{item.jewelType.slot}}_{{item.jewelLevel}}.png" class="jewel-icon">
          </div>
          <div *ngIf="item.buildingType">
            Upgrading {{converter.readableIdentifier(item.buildingType)}} to level {{getNextLevel()}}
          </div>
          <div *ngIf="item.vehicleId">
            Upgrading {{getVehicle().baseVehicle.name}} to level {{getNextLevel()}}
          </div>
          <div *ngIf="item.vehiclePartId">
            Upgrading {{converter.readableIdentifier(getVehiclePart().type)}} to level {{getNextLevel()}}
          </div>
          <div *ngIf="item.jewelType">
            Upgrading {{converter.readableIdentifier(item.jewelType.name)}} jewel to level {{item.jewelLevel + 1}}
          </div>
          <div *ngIf="item.gearId">
            {{getGearModificationText()}}
          </div>
          <div class="flex-grow">&nbsp;</div>
          <div class="progress-bar-with-time" *ngIf="item.inProgress">
            <span class="bar-inner" [style.width]="progressInPercent() + '%'">&nbsp;</span>
            <span class="bar-text">{{item.secondsUntilDone > 0 ? converter.time(item.secondsUntilDone) : 'Done'}}</span>
            &nbsp;
          </div>
          <div *ngIf="!item.inProgress">{{progressInPercent()}}%</div>
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
                public converter: ConverterService) {
    }

    getVehicle(): Vehicle {
        if (this.item.vehicleId) {
            return this.model.getVehicle(this.item.vehicleId);
        }
    }

    getVehiclePart(): VehiclePart {
        if (this.item.vehiclePartId) {
            return this.model.getVehiclePart(this.item.vehiclePartId);
        }
    }

    getGear(): Gear {
        if (this.item.gearId) {
            return this.model.getGear(this.item.gearId);
        }
    }

    getGearModificationText(): string {
        if (this.item.gearModification === 'REROLL_QUALITY') { return 'Modifying Quality'; }
        if (this.item.gearModification === 'REROLL_STAT') { return 'Modifying Stat'; }
        if (this.item.gearModification === 'INC_RARITY') { return 'Increasing Rarity'; }
        if (this.item.gearModification === 'ADD_JEWEL') { return 'Adding Jewel Slot'; }
        if (this.item.gearModification === 'REROLL_JEWEL_1') { return 'Modifying Jewel Slot 1'; }
        if (this.item.gearModification === 'REROLL_JEWEL_2') { return 'Modifying Jewel Slot 2'; }
        if (this.item.gearModification === 'REROLL_JEWEL_3') { return 'Modifying Jewel Slot 3'; }
        if (this.item.gearModification === 'REROLL_JEWEL_4') { return 'Modifying Jewel Slot 4'; }
        if (this.item.gearModification === 'ADD_SPECIAL_JEWEL') { return 'Adding Set Jewel Slot'; }
    }

    getNextLevel() {
        if (this.item.buildingType) {
            return this.model.buildings.find(b => b.type === this.item.buildingType).level + 1;
        } else if (this.item.vehicleId) {
            return this.getVehicle().level + 1;
        } else if (this.item.vehiclePartId) {
            return this.getVehiclePart().level + 1;
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
        }, () => {
            this.saving = false;
        });
    }

    cancelUpgrade() {
        this.saving = true;
        this.backendService.cancelUpgrade(this.item.id).subscribe(data => {
            this.saving = false;
        }, () => {
            this.saving = false;
        });
    }

    moveUpgradeUp() {
        this.saving = true;
        this.backendService.moveUpgradeUp(this.item.id).subscribe(data => {
            this.saving = false;
        }, () => {
            this.saving = false;
        });
    }

}
