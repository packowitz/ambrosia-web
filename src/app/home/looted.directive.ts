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
          <div class="flex-center" *ngIf="model.looted.type == 'CHEST'">Chest contained</div>
          <div class="flex-center" *ngIf="model.looted.type == 'BATTLE'">Battle trophy</div>
          <div class="flex-center" *ngIf="model.looted.type == 'BREAKDOWN'">Remnants collected</div>
          <div class="flex-center" *ngIf="model.looted.type == 'STORY'">Docs gift</div>
          <div class="flex-center" *ngIf="model.looted.type == 'LEVEL_UP'">You reached level {{model.progress.level}}</div>
          <div class="flex-center" *ngIf="model.looted.type == 'VIP_LEVEL_UP'">You reached vip level {{model.progress.vipLevel}}</div>
          <div class="flex-center" *ngIf="model.looted.type == 'MERCHANT'">You bought</div>
          <div class="mt-1" [class.flex-space-between]="model.looted.items.length > 1" [class.flex-center]="model.looted.items.length == 1">
            <loot-item *ngFor="let loot of model.looted.items" [loot]="loot" class="loot-item"></loot-item>
          </div>
          <div class="flex-center mt-1 color-grey font-small"><i>(click anywhere to close)</i></div>
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
        return this.model.looted.items.findIndex(l => l.type === 'GEAR') >= 0;
    }

    jewelLooted(): boolean {
        return this.model.looted.items.findIndex(l => l.type === 'JEWEL') >= 0;
    }

    vehicleLooted(): boolean {
        return this.model.looted.items.findIndex(l => l.type === 'VEHICLE') >= 0;
    }

    genomesLooted(): boolean {
        return this.model.looted.items.findIndex(l => l.type === 'RESOURCE' && l.resourceType.endsWith('GENOME')) >= 0;
    }
}
