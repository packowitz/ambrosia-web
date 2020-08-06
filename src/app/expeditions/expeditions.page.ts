import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {ExpeditionBase} from '../domain/expeditionBase.model';
import {AchievementReward} from '../domain/achievementReward.model';
import {LootSelectionPopover} from '../common/loot-selection.popover';
import {PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'expeditions',
  templateUrl: 'expeditions.page.html'
})
export class ExpeditionsPage implements OnInit {

  saving = false;

  newExpedition: ExpeditionBase;

  constructor(private backendService: BackendService,
              public model: Model,
              public enumService: EnumService,
              private popoverCtrl: PopoverController,
              private router: Router) {
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

  lootBoxSelection(expedition: ExpeditionBase) {
    this.popoverCtrl.create({
      component: LootSelectionPopover,
      componentProps: {
        lootBoxType: 'EXPEDITION',
        selected: expedition.lootBoxId
      }
    }).then(p => {
      p.onDidDismiss().then(data => {
        if (data && data.data && data.data.id) {
          expedition.lootBoxId = data.data.id;
        }
      });
      p.present();
    });
  }

  lootBoxName(id: number): string {
    let box = this.model.lootBoxes.find(l => l.id === id);
    return box ? box.name : 'unknown';
  }

  gotoLootBox(lootBoxId: number) {
    this.router.navigateByUrl('/loot/box/' + lootBoxId);
  }

  initNewExpedition() {
    this.newExpedition = new ExpeditionBase();
    this.newExpedition.level = 1;
    this.newExpedition.durationMinutes = 60;
    this.newExpedition.xp = 500;
  }

  compareById(o1, o2): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  expeditionIncomplete(expedition: ExpeditionBase): boolean {
    return !expedition.name ||
        !expedition.description ||
        !expedition.level ||
        expedition.level <= 0 ||
        expedition.level > 6 ||
        !expedition.durationMinutes ||
        !expedition.xp ||
        !expedition.rarity ||
        !expedition.lootBoxId;
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
