import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';

@Component({
  selector: 'storage',
  templateUrl: 'storage.page.html'
})
export class StoragePage {

  saving = false;

  buildingType = "STORAGE";
  canUpgradeBuilding = false;

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              private propertyService: PropertyService,
              public model: Model,
              private router: Router,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    if (!this.getBuilding()) {
      this.close();
    }
  }

  ionViewWillEnter() {
    this.canUpgradeBuilding = this.propertyService.getUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;
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

  info(text: string) {
    this.alertCtrl.create({
      subHeader: text
    }).then(a => a.present());
  }

  openUpgradeModal() {
    this.modalCtrl.create({
      component: BuildingUpgradeModal,
      componentProps: {
        buildingType: this.buildingType
      }
    }).then(modal => {
      modal.onDidDismiss().then(() => this.ionViewWillEnter());
      modal.present();
    });
  }

  gain(type: string) {
    this.saving = true;
    this.backendService.betaTesterGainResources(type).subscribe(() => {
      this.saving = false;
    });
  }
}
