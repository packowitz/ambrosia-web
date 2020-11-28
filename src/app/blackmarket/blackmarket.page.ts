import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {LootSelectionPopover} from '../common/loot-selection.popover';
import {PopoverController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BlackMarketItem} from '../domain/blackMarketItem.model';

@Component({
  selector: 'blackmarket',
  templateUrl: 'blackmarket.page.html'
})
export class BlackmarketPage implements OnInit {

  saving = false;

  newBlackMarketItem: BlackMarketItem;

  constructor(private backendService: BackendService,
              public enumService: EnumService,
              public model: Model,
              private popoverCtrl: PopoverController,
              private router: Router) {
    this.initNewBlackMarketItem();
  }

  ngOnInit(): void {
    if (!this.model.allBlackMarketItems) {
      this.backendService.getAllBlackMarketItems().subscribe(data => {
        this.model.allBlackMarketItems = data;
      });
    }
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  lootBoxSelection(item: BlackMarketItem) {
    this.popoverCtrl.create({
      component: LootSelectionPopover,
      componentProps: {
        lootBoxType: 'BLACK_MARKET',
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

  initNewBlackMarketItem() {
    this.newBlackMarketItem = new BlackMarketItem();
    this.newBlackMarketItem.active = true;
    this.newBlackMarketItem.sortOrder = 1;
    this.newBlackMarketItem.priceType = 'WOODEN_KEYS';
    this.newBlackMarketItem.priceAmount = 10;
  }

  itemIncomplete(item: BlackMarketItem): boolean {
    return item.sortOrder <= 0 ||
        item.priceAmount <= 0 ||
        !item.priceType ||
        !item.lootBoxId;
  }

  saveItem(item: BlackMarketItem) {
    this.saving = true;
    this.backendService.saveBlackMarketItem(item).subscribe(data => {
      let idx = -1;
      if (item.id) {
        idx = this.model.allBlackMarketItems.findIndex(m => m.id === item.id);
      } else {
        this.initNewBlackMarketItem();
      }
      if (idx !== -1) {
        this.model.allBlackMarketItems[idx] = data;
      } else {
        this.model.allBlackMarketItems.push(data);
      }
      this.saving = false;
    });
  }
}
