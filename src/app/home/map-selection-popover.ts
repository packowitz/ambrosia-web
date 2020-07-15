import {Component} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'map-selection-modal',
    template: `
        <div class="ma-2" style="max-height: 70vh; overflow-y: scroll;">
          <div class="strong">Your marked maps</div>
          <div *ngFor="let map of getFavoriteMaps()" class="pointer mt-1" (click)="close(map.mapId)">
            {{map.name}}
            <span *ngIf="map.secondsToReset" class="font-small color-grey ml-05"> (reset in {{converter.timeWithUnit(map.secondsToReset)}})</span>
          </div>
        </div>
    `
})
export class MapSelectionPopover {

    constructor(private popoverController: PopoverController,
                public converter: ConverterService,
                private model: Model) {}

    getFavoriteMaps() {
        return this.model.playerMaps.filter(m => m.favorite);
    }

    close(mapId?: number) {
        this.popoverController.dismiss(mapId);
    }
}