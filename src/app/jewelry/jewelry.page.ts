import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {EnumService} from '../services/enum.service';
import {JewelryService} from '../services/jewelry.service';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {JewelUpgradeModal} from './jewelUpgrade.modal';
import {StoryService} from '../services/story.service';
import {BuildingService} from '../services/building.service';
import {JewelryUpgradeInfoModal} from './jewelry-upgrade-info.modal';
import {Jewelry} from '../domain/jewelry.model';

@Component({
  selector: 'jewelry',
  templateUrl: 'jewelry.page.html'
})
export class JewelryPage {

  saving = false;

  buildingType = "JEWELRY";
  enterStory = this.buildingType + '_ENTERED';

  levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              public propertyService: PropertyService,
              public buildingService: BuildingService,
              public model: Model,
              public enumService: EnumService,
              private router: Router,
              private modalCtrl: ModalController,
              public jewelryService: JewelryService,
              private storyService: StoryService) {
    if (!this.buildingService.getBuilding(this.buildingType)) {
      this.close();
    }
  }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
    }
    this.jewelryService.getAllJewelries().forEach(j => j.expanded = false);
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  showUpgradeInfo() {
    this.modalCtrl.create({component: JewelryUpgradeInfoModal}).then(m => m.present() );
  }

  hasJewelsToMerge(jewelry: Jewelry): boolean {
    let jewelUpgradeLevel = this.model.progress.maxJewelUpgradingLevel;
    return (jewelry.lvl1 >= 4 && jewelUpgradeLevel >= 1) ||
        (jewelry.lvl2 >= 4 && jewelUpgradeLevel >= 2) ||
        (jewelry.lvl3 >= 4 && jewelUpgradeLevel >= 3) ||
        (jewelry.lvl4 >= 4 && jewelUpgradeLevel >= 4) ||
        (jewelry.lvl5 >= 4 && jewelUpgradeLevel >= 5) ||
        (jewelry.lvl6 >= 4 && jewelUpgradeLevel >= 6) ||
        (jewelry.lvl7 >= 4 && jewelUpgradeLevel >= 7) ||
        (jewelry.lvl8 >= 4 && jewelUpgradeLevel >= 8) ||
        (jewelry.lvl9 >= 4 && jewelUpgradeLevel >= 9);
  }

  openUpgradeModal() {
    this.modalCtrl.create({
      component: BuildingUpgradeModal,
      componentProps: {
        buildingType: this.buildingType
      }
    }).then(modal => modal.present() );
  }

  openJewelUpgradeModal(type: string, level: number) {
    this.modalCtrl.create({
      component: JewelUpgradeModal,
      componentProps: {
        jewelType: type,
        jewelLevel: level
      }
    }).then(modal => modal.present() );
  }
}
