import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {ModalController} from '@ionic/angular';
import {StorageUpgradeModal} from './storageUpgrade.modal';
import {Router} from '@angular/router';

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
              private modalCtrl: ModalController) {
    console.log("StoragePage.constructor");
  }

  ionViewWillEnter() {
    this.canUpgradeBuilding = this.propertyService.getBuildingUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  openUpgradeModal() {
    this.modalCtrl.create({
      component: StorageUpgradeModal
    }).then(modal => {
      modal.onDidDismiss().then(() => this.ionViewWillEnter());
      modal.present();
    });
  }

  gain(type: string) {
    this.saving = true;
    this.backendService.adminGainResources(type).subscribe(() => {
      this.saving = false;
    });
  }
}
