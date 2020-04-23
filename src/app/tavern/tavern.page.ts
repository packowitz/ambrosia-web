import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {EnumService, JewelType} from '../services/enum.service';
import {Gear} from '../domain/gear.model';

@Component({
  selector: 'tavern',
  templateUrl: 'tavern.page.html'
})
export class TavernPage {

  saving = false;

  gearAmount = 10;
  gearSet: string = null;

  jewelAmount = 10;
  jewelType: JewelType = null;

  specificGear: Gear;
  specificGearSlots: string[] = [];
  selectJewelSlotValue;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              private converter: ConverterService,
              public model: Model,
              public enumService: EnumService) {
    this.gearSet = enumService.getGearSets()[0];
    this.jewelType = enumService.getJewelTypes()[0];
    this.specificGear = new Gear();
  }

  buyGear() {
    this.saving = true;
    this.backendService.getGear(this.gearAmount, this.gearSet).subscribe(gear => {
      this.saving = false;
    });
  }

  buyJewel() {
    this.saving = true;
    this.backendService.getJewel(this.jewelAmount, this.jewelType).subscribe(jewelry => {
      this.saving = false;
    });
  }

  addSpecificGearSlot(event) {
    if (event.detail.value) {
      this.specificGearSlots.push(event.detail.value);
      setTimeout(() => this.selectJewelSlotValue = null, 10);
    }

  }

  removeSpecificGearSlot(i) {
    this.specificGearSlots.splice(i, 1);
  }

  craftSpecificGear() {
    this.saving = true;
    this.specificGearSlots.forEach((slot, idx) => {this.specificGear['jewelSlot' + (idx+1)] = slot;});
    this.backendService.craftGear(this.specificGear).subscribe(gear => {
      this.specificGear.jewelSlot1 = null;
      this.specificGear.jewelSlot2 = null;
      this.specificGear.jewelSlot3 = null;
      this.specificGear.jewelSlot4 = null;
      this.saving = false;
      this.alertCtrl.create({
        header: 'You got ' + gear.set + ' ' + gear.type + ' ' + ' (' + this.converter.rarityStars(gear.rarity) + '*)',
        buttons: [{text: 'Okay'}]
      }).then(data => data.present());
    });
  }
}
