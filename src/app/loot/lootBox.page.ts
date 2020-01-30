import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService, MapTileStructure, ResourceType} from '../services/enum.service';
import {ActivatedRoute} from '@angular/router';
import {Map} from '../domain/map.model';
import {MapTile} from '../domain/mapTile.model';
import {AlertController} from '@ionic/angular';
import {LootBox} from '../domain/lootBox.model';
import {LootItem} from '../domain/lootItem.model';

@Component({
  selector: 'loot-box',
  templateUrl: 'lootBox.page.html'
})
export class LootBoxPage implements OnInit {

  saving = false;

  lootBox: LootBox;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              public model: Model,
              public enumService: EnumService,
              public alertCtrl: AlertController) {
  }

  ngOnInit() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.model.lootBoxes) {
      this.saving = true;
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
        this.lootBox = this.model.lootBoxes.find(m => m.id === id);
        this.saving = false;
      });
    } else {
      this.lootBox = this.model.lootBoxes.find(m => m.id === id);
    }
    if (!this.model.gearLoots) {
      this.backendService.loadAllGearLoots().subscribe(data => {
        this.model.gearLoots = data;
      });
    }
    if (!this.model.baseHeroes) {
      this.backendService.getHeroBases().subscribe(data => {
        this.model.baseHeroes = data;
      });
    }
  }

  orderItems() {
    this.lootBox.items = this.lootBox.items.sort((a, b) => {
      if (a.slotNumber === b.slotNumber) {
        return a.itemOrder - b.itemOrder;
      } else {
        return a.slotNumber - b.slotNumber;
      }
    });
  }

  save() {
    this.saving = true;
    this.backendService.saveLootBox(this.lootBox).subscribe(data => {
      this.lootBox = data;
      this.model.updateLootBox(data);
      this.saving = false;
    }, error => {
      this.saving = false;
      this.alertCtrl.create({
        header: 'Server error',
        message: error.error.message,
        buttons: [{text: 'Okay'}]
      }).then(data => data.present());
    });
  }

  isLastSlot(number: number): boolean {
    return this.lootBox.items[this.lootBox.items.length - 1].slotNumber === number;
  }

  isLastInSlot(slot: number, number: number): boolean {
    let max = -1;
    this.lootBox.items.filter(i => i.slotNumber === slot).forEach(i => { if (i.itemOrder > max) { max = i.itemOrder; } } );
    return number === max;
  }

  getResourceTypes(): ResourceType[] {
    return this.enumService.getResourceTypes().filter(r => r.category !== 'BATTLE_FEE');
  }

  newItem() {
    let item = new LootItem();
    item.slotNumber = this.lootBox.items.length > 0 ? this.lootBox.items[this.lootBox.items.length - 1].slotNumber + 1 : 1;
    item.itemOrder = 1;
    item.chance = 100;
    item.type = 'RESOURCE';
    item.resourceAmount = 5;
    item.resourceType = 'COINS';
    this.lootBox.items.push(item);
  }

  slotUp(item: LootItem) {
    let oldSlot = item.slotNumber;
    let oldPos = item.itemOrder;
    item.slotNumber ++;
    let max = 0;
    this.lootBox.items.filter(i => i.slotNumber === item.slotNumber).forEach(i => { if (i.itemOrder > max) { max = i.itemOrder; } } );
    item.itemOrder = max + 1;
    this.lootBox.items.filter(i => i.slotNumber === oldSlot && i.itemOrder > oldPos).forEach(i => i.itemOrder--);
    this.orderItems();
  }

  slotDown(item: LootItem) {
    let oldSlot = item.slotNumber;
    let oldPos = item.itemOrder;
    let newslot = item.slotNumber - 1;
    let max = 0;
    this.lootBox.items.filter(i => i.slotNumber === newslot).forEach(i => { if (i.itemOrder > max) { max = i.itemOrder; } } );
    item.slotNumber = newslot;
    item.itemOrder = max + 1;
    this.lootBox.items.filter(i => i.slotNumber === oldSlot && i.itemOrder > oldPos).forEach(i => i.itemOrder--);
    this.orderItems();
  }

  posUp(item: LootItem) {
    let newPos = item.itemOrder + 1;
    this.lootBox.items.filter(i => i.slotNumber === item.slotNumber && i.itemOrder === newPos).forEach(i => i.itemOrder--);
    item.itemOrder = newPos;
    this.orderItems();
  }

  posDown(item: LootItem) {
    let newPos = item.itemOrder - 1;
    this.lootBox.items.filter(i => i.slotNumber === item.slotNumber && i.itemOrder === newPos).forEach(i => i.itemOrder++);
    item.itemOrder = newPos;
    this.orderItems();
  }

  deleteItem(item: LootItem) {
    let idx = this.lootBox.items.indexOf(item);
    if (idx >= 0) {
      this.lootBox.items.splice(idx, 1);
    }
    this.lootBox.items.filter(i => i.slotNumber === item.slotNumber && i.itemOrder > item.itemOrder).forEach(i => i.itemOrder--);
  }
}
