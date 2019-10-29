import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {Gear} from '../domain/gear.model';

@Component({
  selector: 'tavern',
  templateUrl: 'tavern.page.html'
})
export class TavernPage {

  saving = false;
  specificGear: Gear;
  specificGearSlots: string[] = [];
  selectJewelSlotValue;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              private converter: ConverterService,
              private model: Model,
              private enumService: EnumService) {
    this.specificGear = new Gear();
  }

  recruit(type: String) {
    this.saving = true;
    this.backendService.recruitRandomHero(type).subscribe(hero => {
      this.saving = false;
      this.alertCtrl.create({
        header: 'You recruited ' + hero.heroBase.name + ' (' + this.converter.rarityStars(hero.heroBase.rarity) + '*)',
        buttons: [{text: 'Okay'}]
      }).then(data => data.present());
    });
  }

  buyGear() {
    this.saving = true;
    this.backendService.getRandomGear().subscribe(gear => {
      this.saving = false;
      this.alertCtrl.create({
        header: 'You got ' + gear.set + ' ' + gear.type + ' ' + ' (' + this.converter.rarityStars(gear.rarity) + '*)',
        buttons: [{text: 'Okay'}]
      }).then(data => data.present());
    });
  }

  buyJewel() {
    this.saving = true;
    this.backendService.getRandomJewel().subscribe(jewelry => {
      this.saving = false;
      this.alertCtrl.create({
        header: 'You got a jewel of type ' + jewelry.type,
        buttons: [{text: 'Okay'}]
      }).then(data => data.present());
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
