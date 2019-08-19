import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {ConverterService} from '../services/converter.service';

@Component({
  selector: 'tavern',
  templateUrl: 'tavern.page.html'
})
export class TavernPage {

  saving = false;

  constructor(private backendService: BackendService, private alertCtrl: AlertController, private converter: ConverterService) {}

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
}
