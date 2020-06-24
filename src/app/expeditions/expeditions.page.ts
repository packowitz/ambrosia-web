import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {ExpeditionBase} from '../domain/expeditionBase.model';

@Component({
  selector: 'expeditions',
  templateUrl: 'expeditions.page.html'
})
export class ExpeditionsPage implements OnInit {

  saving = false;

  newExpedition: ExpeditionBase;

  constructor(private backendService: BackendService,
              public model: Model,
              public enumService: EnumService) {
    this.initNewExpedition();
  }

  ngOnInit(): void {
    if (!this.model.expeditionBases) {
      this.backendService.loadExpeditionBases().subscribe(data => {
        this.model.expeditionBases = data;
      });
    }
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  initNewExpedition() {
    this.newExpedition = new ExpeditionBase();
    this.newExpedition.level = 1;
    this.newExpedition.durationMinutes = 60;
  }

  expeditionIncomplete(expedition: ExpeditionBase): boolean {
    return !expedition.name ||
        !expedition.description ||
        !expedition.level ||
        expedition.level <= 0 ||
        expedition.level > 6 ||
        !expedition.durationMinutes ||
        !expedition.rarity ||
        !expedition.lootBox;
  }

  saveExpedition(expedition: ExpeditionBase) {
    this.saving = true;
    this.backendService.saveExpeditionBases(expedition).subscribe(data => {
      let idx = -1;
      if (expedition.id) {
        idx = this.model.expeditionBases.findIndex(e => e.id === expedition.id);
      } else {
        this.initNewExpedition();
      }
      if (idx !== -1) {
        this.model.expeditionBases[idx] = data;
      } else {
        this.model.expeditionBases.push(data);
      }
      this.saving = false;
    });
  }
}
