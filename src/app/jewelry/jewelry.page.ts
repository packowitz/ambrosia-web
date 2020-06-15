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
              public model: Model,
              public enumService: EnumService,
              private router: Router,
              private modalCtrl: ModalController,
              public jewelryService: JewelryService,
              private storyService: StoryService) {
    if (!this.getBuilding()) {
      this.close();
    }
  }

  ionViewWillEnter() {
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.showStory();
    }
  }

  showStory() {
    this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
  }

  canUpgradeBuilding(): boolean {
    return this.propertyService.getUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
  }

  upgradeInProgress(): boolean {
    return this.getBuilding().upgradeTriggered && !this.model.upgrades.find(u => u.buildingType === this.buildingType && u.finished);
  }

  upgradeFinished(): boolean {
    return this.getBuilding().upgradeTriggered && !!this.model.upgrades.find(u => u.buildingType === this.buildingType && u.finished);
  }

  close() {
    this.router.navigateByUrl('/home');
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
