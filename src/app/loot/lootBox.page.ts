import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService, ResourceType} from '../services/enum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LootBox} from '../domain/lootBox.model';
import {LootItem} from '../domain/lootItem.model';
import {ConverterService} from '../services/converter.service';

@Component({
    selector: 'loot-box',
    templateUrl: 'lootBox.page.html'
})
export class LootBoxPage {

    saving = false;
    editName = false;

    lootBox: LootBox;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private backendService: BackendService,
                public model: Model,
                public enumService: EnumService,
                private converter: ConverterService) {
    }

    ionViewWillEnter() {
        this.editName = false;
        let id = Number(this.route.snapshot.paramMap.get('id'));
        if (!this.model.lootBoxes) {
            this.saving = true;
            this.backendService.loadAllLootBoxes().subscribe(data => {
                this.model.lootBoxes = data;
                this.lootBox = this.converter.dataClone(this.model.lootBoxes.find(m => m.id === id));
                this.saving = false;
            });
        } else {
            this.lootBox = this.converter.dataClone(this.model.lootBoxes.find(m => m.id === id));
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
        if (!this.model.baseVehicles) {
            this.backendService.loadAllBaseVehicles().subscribe(data => {
                this.model.baseVehicles = data;
            });
        }
    }

    compareNullable(o1, o2): boolean {
        return o1 && o2 ? o1 === o2 : !o1 && !o2;
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
            this.lootBox = this.converter.dataClone(data);
            this.model.updateLootBox(data);
            this.saving = false;
        }, () => { this.saving = false; });
    }

    cancel() {
        this.router.navigateByUrl('/loot');
    }

    copy() {
        this.saving = true;
        let newLootBox: LootBox = this.converter.dataClone(this.lootBox);
        newLootBox.id = null;
        newLootBox.name += ' (c)';
        newLootBox.items.forEach(i => i.id = null);
        this.backendService.saveLootBox(newLootBox).subscribe(data => {
            this.model.updateLootBox(data);
            this.saving = false;
            this.router.navigateByUrl('/loot/box/' + data.id);
        }, () => { this.saving = false; });
    }

    isLastSlot(number: number): boolean {
        return this.lootBox.items[this.lootBox.items.length - 1].slotNumber === number;
    }

    isLastInSlot(slot: number, number: number): boolean {
        let max = -1;
        this.lootBox.items.filter(i => i.slotNumber === slot).forEach(i => {
            if (i.itemOrder > max) {
                max = i.itemOrder;
            }
        });
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
        item.resourceTo = 5;
        item.resourceType = 'COINS';
        item.jewelTypes = [];
        this.lootBox.items.push(item);
    }

    slotUp(item: LootItem) {
        let oldSlot = item.slotNumber;
        let oldPos = item.itemOrder;
        item.slotNumber++;
        let max = 0;
        this.lootBox.items.filter(i => i.slotNumber === item.slotNumber).forEach(i => {
            if (i.itemOrder > max) {
                max = i.itemOrder;
            }
        });
        item.itemOrder = max + 1;
        this.lootBox.items.filter(i => i.slotNumber === oldSlot && i.itemOrder > oldPos).forEach(i => i.itemOrder--);
        this.orderItems();
    }

    slotDown(item: LootItem) {
        let oldSlot = item.slotNumber;
        let oldPos = item.itemOrder;
        let newslot = item.slotNumber - 1;
        let max = 0;
        this.lootBox.items.filter(i => i.slotNumber === newslot).forEach(i => {
            if (i.itemOrder > max) {
                max = i.itemOrder;
            }
        });
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

    jewelTypeEnabled(item: LootItem, type: string): boolean {
        return item.jewelTypes.indexOf(type) !== -1;
    }

    toggleJewelType(item: LootItem, type: string) {
        let idx = item.jewelTypes.indexOf(type);
        if (idx >= 0) {
            item.jewelTypes.splice(idx, 1);
        } else {
            item.jewelTypes.push(type);
        }
    }
}
