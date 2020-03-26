import {Component, Input} from '@angular/core';
import {Looted} from '../services/backend.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'looted',
    template: `
      <div>
        <div class="loot-window pa-2">
          <div class="flex-center">You received</div>
          <div class="flex-space-between mt-1">
            <loot-item *ngFor="let loot of looted" [loot]="loot"></loot-item>
          </div>
          <div class="flex-center mt-1"><i>(click anywhere to close)</i></div>
        </div>
      </div>
  `
})
export class LootedDirective {
    @Input() looted: Looted[];

    constructor(public model: Model,
                public propertyService: PropertyService,
                public converter: ConverterService) {}
}
