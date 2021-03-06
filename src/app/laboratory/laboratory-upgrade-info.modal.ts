import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {ConverterService} from '../services/converter.service';
import {Building} from '../domain/building.model';
import {BuildingService} from '../services/building.service';

@Component({
    selector: 'laboratory-upgrade-info-modal',
    template: `
      <div class="ma-2 popover-scrollable" *ngIf="building">
        <div class="flex-space-between">
          <strong>The Laboratory</strong>
          <ion-button size="small" fill="clear" color="dark" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </div>
        <div class="mt-2">Upgrade Laboratory to gain incubators, speedier and improved incubation</div>
        
        <div *ngFor="let level of levels" [class.color-grey]="level <= building.level" class="mt-3">
          <div class="flex-space-between">
            <strong>Level {{level}}</strong>
            <div class="flex-grow flex-end">
              <div *ngFor="let cost of buildingService.getUpgradeCosts(buildingType, level)" class="flex ml-1">
                <img src="assets/icon/resources/{{cost.resourceType}}.png" class="resource-icon">{{converter.readableAmount(cost.value1)}}
              </div>
            </div>
          </div>
          <div *ngFor="let upgrade of getUpgrades(level)" class="font-small">
            <i>{{upgrade}}</i>
          </div>
        </div>

      </div>
    `
})
export class LaboratoryUpgradeInfoModal {

    buildingType = "LABORATORY";
    building: Building;
    levels = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    constructor(private modalCtrl: ModalController,
                public model: Model,
                public buildingService: BuildingService,
                public converter: ConverterService,
                private propertyService: PropertyService) {
    }

    ionViewWillEnter() {
        this.building = this.model.buildings.find(b => b.type === this.buildingType);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getUpgrades(level: number): string[] {
        return this.propertyService.getProps(this.buildingType + '_BUILDING', level)
            .map(p => this.converter.readableProgressStat(p.progressStat, p.value1));
    }
}
