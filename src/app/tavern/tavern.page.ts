import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {EnumService, JewelType} from '../services/enum.service';
import {Gear} from '../domain/gear.model';
import {PropertyService} from '../services/property.service';

@Component({
  selector: 'tavern',
  templateUrl: 'tavern.page.html'
})
export class TavernPage {

  saving = false;

  gearAmount = 10;
  gearRarity = 'SIMPLE';
  gearSet: string = null;

  jewelAmount = 10;
  jewelLevel = 1;
  jewelType: JewelType = null;

  specificGear: Gear;
  specificGearSlots: string[] = [];
  selectJewelSlotValue;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              public converter: ConverterService,
              public model: Model,
              public enumService: EnumService,
              public propertyService: PropertyService) {
    this.gearSet = enumService.getGearSets()[0];
    this.jewelType = enumService.getJewelTypes()[0];
    this.specificGear = new Gear();
  }

  buyGear() {
    this.saving = true;
    this.backendService.getGear(this.gearAmount, this.gearRarity, this.gearSet).subscribe(gear => {
      this.saving = false;
    }, () => { this.saving = false; });
  }

  buyJewel() {
    this.saving = true;
    this.backendService.getJewel(this.jewelAmount, this.jewelLevel, this.jewelType).subscribe(jewelry => {
      this.saving = false;
    }, () => { this.saving = false; });
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

  checkStat() {
    if (this.specificGear.type && this.specificGear.rarity && this.specificGear.stat) {
      let stats = this.propertyService.getPossibleGearStats(this.specificGear.type, this.converter.rarityStars(this.specificGear.rarity));
      if (stats.indexOf(this.specificGear.stat) >= 0) {
        return;
      }
    }
    this.specificGear.stat = null;
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
    }, () => { this.saving = false; });
  }
}
