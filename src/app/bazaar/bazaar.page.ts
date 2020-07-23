import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {BackendService} from '../services/backend.service';
import {Router} from '@angular/router';
import {StoryService} from '../services/story.service';
import {BuildingService} from '../services/building.service';
import {EnumService} from '../services/enum.service';
import {ConverterService} from '../services/converter.service';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {AlertController, ModalController} from '@ionic/angular';
import {BazaarUpgradeInfoModal} from './bazaar-upgrade-info.modal';
import {HeroBase} from '../domain/herobase.model';
import {MerchantPlayerItem} from '../domain/merchantPlayerItem.model';

@Component({
  selector: 'app-bazaar',
  templateUrl: './bazaar.page.html'
})
export class BazaarPage {

  tab = 'merchant';
  saving = false;
  
  buildingType = 'BAZAAR';
  enterStory = this.buildingType + '_ENTERED';

  constructor(private model: Model,
              public enumService: EnumService,
              public converter: ConverterService,
              private backendService: BackendService,
              private storyService: StoryService,
              public buildingService: BuildingService,
              private router: Router,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) { }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
    }
  }

  openUpgradeModal() {
    this.modalCtrl.create({
      component: BuildingUpgradeModal,
      componentProps: {
        buildingType: this.buildingType
      }
    }).then(modal => {
      modal.present();
    });
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  showUpgradeInfo() {
    this.modalCtrl.create({component: BazaarUpgradeInfoModal}).then(m => m.present() );
  }

  acceptTrade(tradeName: string) {
    this.saving = true;
    this.backendService.acceptTrade(tradeName).subscribe(() => {
      this.saving = false;
    }, () => this.saving = false );
  }

  renewMerchantItems() {
    this.alertCtrl.create({
      subHeader: 'Refresh items in the market for 50 Rubies',
      buttons: [
        {text: 'Cancel'},
        {text: 'Refresh', handler: () => {
            this.saving = true;
            this.backendService.renewMerchantItems().subscribe(() => {
              this.saving = false;
            }, () => this.saving = false );
          }}
      ]
    }).then(a => a.present() );
  }

  buyMerchantItem(item: MerchantPlayerItem) {
    this.saving = true;
    this.backendService.buyMerchantItem(item).subscribe(() => {
      this.saving = false;
    }, () => this.saving = false );
  }

  getHeroStars(heroBase: HeroBase, level: number): number {
    let levelStars = level / 10;
    if (level % 10 > 0) {
      levelStars ++;
    }
    let heroStars = this.converter.rarityStars(heroBase.rarity);
    if (levelStars > heroStars) {
      return levelStars;
    } else {
      return heroStars;
    }
  }

}
