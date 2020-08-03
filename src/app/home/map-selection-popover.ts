import {Component} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {ConverterService} from '../services/converter.service';
import {PlayerMap} from '../domain/playerMap.model';

@Component({
    selector: 'map-selection-modal',
    template: `
        <div class="ma-2" style="max-height: 70vh; overflow-y: scroll;">
          <div class="strong">Your <ion-icon name="heart" color="danger"></ion-icon> maps</div>
          <ion-segment [(ngModel)]="mapType" *ngIf="hasDungeonDiscovered() || hasMineDiscovered()">
            <ion-segment-button value="CAMPAIGN">
              <ion-label>Maps</ion-label>
            </ion-segment-button>
            <ion-segment-button value="DUNGEON" *ngIf="hasDungeonDiscovered()">
              <ion-label>Dungeons</ion-label>
            </ion-segment-button>
            <ion-segment-button value="MINE" *ngIf="hasMineDiscovered()">
              <ion-label>Mines</ion-label>
            </ion-segment-button>
          </ion-segment>
          <div *ngFor="let map of getFavoriteMaps()" class="pointer mt-1" (click)="close(map.mapId)">
            {{map.name}}
            <span *ngIf="map.secondsToReset" class="font-small color-grey ml-05"> (reset in {{converter.timeWithUnit(map.secondsToReset)}})</span>
          </div>
        </div>
    `
})
export class MapSelectionPopover {

    mapType = 'CAMPAIGN';

    constructor(private popoverController: PopoverController,
                public converter: ConverterService,
                private model: Model) {}

    hasDungeonDiscovered(): boolean {
        return !!this.model.playerMaps.find(p => p.type === 'DUNGEON');
    }

    hasMineDiscovered(): boolean {
        return !!this.model.playerMaps.find(p => p.type === 'MINE');
    }

    getFavoriteMaps(): PlayerMap[] {
        return this.model.playerMaps.filter(m => m.favorite && m.type === this.mapType).sort((a, b) => {
            if (a.secondsToReset && !b.secondsToReset) {
                return -1;
            }
            if (!a.secondsToReset && b.secondsToReset) {
                return 1;
            }
            if (a.secondsToReset && b.secondsToReset) {
                return a.secondsToReset - b.secondsToReset;
            }
            return 0;
        });
    }

    close(mapId?: number) {
        this.popoverController.dismiss(mapId);
    }
}