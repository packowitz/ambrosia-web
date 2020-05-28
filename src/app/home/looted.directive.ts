import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {ConverterService} from '../services/converter.service';
import {StoryService} from '../services/story.service';

@Component({
    selector: 'looted',
    template: `
      <div *ngIf="model.looted" class="loading-indicator" (click)="lootCollected()">
        <div class="loot-window pa-2">
          <div class="flex-center">You received</div>
          <div class="flex-space-between mt-1">
            <loot-item *ngFor="let loot of model.looted" [loot]="loot"></loot-item>
          </div>
          <div class="flex-center mt-1"><i>(click anywhere to close)</i></div>
        </div>
      </div>
  `
})
export class LootedDirective {

    gearStory = 'GEAR_FOUND';
    jewelStory = 'JEWEL_FOUND';
    vehicleStory = 'VEHICLE_FOUND';
    genomeStory = 'GENOMES_FOUND';

    constructor(public model: Model,
                public propertyService: PropertyService,
                public converter: ConverterService,
                private storyService: StoryService) {
    }

    lootCollected() {
        if (this.storyService.storyUnknown(this.gearStory) && this.gearLooted()) {
            this.storyService.showStory(this.gearStory).subscribe(() => console.log(this.gearStory + ' story finished'));
        }
        if (this.storyService.storyUnknown(this.jewelStory) && this.jewelLooted()) {
            this.storyService.showStory(this.jewelStory).subscribe(() => console.log(this.jewelStory + ' story finished'));
        }
        if (this.storyService.storyUnknown(this.vehicleStory) && this.vehicleLooted()) {
            this.storyService.showStory(this.vehicleStory).subscribe(() => console.log(this.vehicleStory + ' story finished'));
        }
        if (this.storyService.storyUnknown(this.genomeStory) && this.genomesLooted()) {
            this.storyService.showStory(this.genomeStory).subscribe(() => console.log(this.genomeStory + ' story finished'));
        }

        this.model.looted = null;
    }

    gearLooted(): boolean {
        return this.model.looted.findIndex(l => l.type === 'GEAR') >= 0;
    }

    jewelLooted(): boolean {
        return this.model.looted.findIndex(l => l.type === 'JEWEL') >= 0;
    }

    vehicleLooted(): boolean {
        return this.model.looted.findIndex(l => l.type === 'VEHICLE') >= 0;
    }

    genomesLooted(): boolean {
        return this.model.looted.findIndex(l => l.type === 'RESOURCE' && l.resourceType.endsWith('GENOME')) >= 0;
    }
}
