import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {MerchantItem} from '../domain/merchantItem.model';
import {AchievementReward} from '../domain/achievementReward.model';
import {LootSelectionPopover} from '../common/loot-selection.popover';
import {PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'merchant',
  templateUrl: 'merchant.page.html'
})
export class MerchantPage implements OnInit {

  saving = false;

  newMerchantItem: MerchantItem;

  constructor(private backendService: BackendService,
              public enumService: EnumService,
              public model: Model,
              private popoverCtrl: PopoverController,
              private router: Router) {
    this.initNewMerchantItem();
  }

  ngOnInit(): void {
    if (!this.model.merchantItems) {
      this.backendService.getMerchantItems().subscribe(data => {
        this.model.merchantItems = data;
      });
    }
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  lootBoxSelection(item: MerchantItem) {
    this.popoverCtrl.create({
      component: LootSelectionPopover,
      componentProps: {
        searchPrefill: 'Mer',
        selected: item.lootBoxId
      }
    }).then(p => {
      p.onDidDismiss().then(data => {
        if (data && data.data && data.data.id) {
          item.lootBoxId = data.data.id;
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

  initNewMerchantItem() {
    this.newMerchantItem = new MerchantItem();
    this.newMerchantItem.merchantLevel = 1;
    this.newMerchantItem.sortOrder = 1;
    this.newMerchantItem.priceType = 'COINS';
    this.newMerchantItem.priceAmount = 1000;
  }

  itemIncomplete(item: MerchantItem): boolean {
    return !item.merchantLevel ||
        item.merchantLevel <= 0 ||
        item.merchantLevel > 4 ||
        item.sortOrder <= 0 ||
        item.priceAmount <= 0 ||
        !item.priceType ||
        !item.lootBoxId;
  }

  saveItem(item: MerchantItem) {
    this.saving = true;
    this.backendService.saveMerchantItem(item).subscribe(data => {
      let idx = -1;
      if (item.id) {
        idx = this.model.merchantItems.findIndex(m => m.id === item.id);
      } else {
        this.initNewMerchantItem();
      }
      if (idx !== -1) {
        this.model.merchantItems[idx] = data;
      } else {
        this.model.merchantItems.push(data);
      }
      this.saving = false;
    });
  }
}
