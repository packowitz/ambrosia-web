import {Component} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {LootBox} from '../domain/lootBox.model';
import {BackendService} from '../services/backend.service';

@Component({
    selector: 'loot-selection-popup',
    template: `
        <div class="ma-1" style="min-height: 350px">
          <ion-searchbar [(ngModel)]="searchTerm"></ion-searchbar>
          <div class="mt-1 pointer" [class.strong]="lootBox.id == currentSelectedId" *ngFor="let lootBox of getLootBoxes()" (click)="close(lootBox)">{{lootBox.name}}</div>
          <div class="mt-2 flex-center"><ion-button size="small" (click)="createLootBox()">create</ion-button></div>
        </div>
    `
})
export class LootSelectionPopover {

    searchTerm = '';
    lootBoxType: string;
    currentSelectedId = 0;

    constructor(private model: Model,
                private backendService: BackendService,
                private popoverController: PopoverController,
                private navParams: NavParams) {
        this.lootBoxType = navParams.get('lootBoxType');
        let selected = navParams.get('selected');
        if (selected) {
            this.currentSelectedId = selected;
        }
    }

    close(lootBox: LootBox) {
        this.popoverController.dismiss(lootBox);
    }

    getLootBoxes(): LootBox[] {
        if (!this.searchTerm) {
            return this.model.lootBoxes;
        }
        let terms = this.searchTerm.trim().toLowerCase().split(' ');
        return this.model.lootBoxes.filter(box => {
            if (box.type !== this.lootBoxType) {
                return false;
            }
            let name = box.name.toLowerCase();
            for (let i = 0; i < terms.length; i++) {
                if (name.indexOf(terms[i]) === -1) {
                    return false;
                }
            }
            return true;
        });
    }

    createLootBox() {
        if (this.searchTerm) {
            this.backendService.saveLootBox({name: this.searchTerm, type: this.lootBoxType}).subscribe(lootBox => {
                this.model.lootBoxes.push(lootBox);
                this.close(lootBox);
            });
        }
    }
}