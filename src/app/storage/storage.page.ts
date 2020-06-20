import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {BuildingService} from '../services/building.service';

@Component({
  selector: 'storage',
  templateUrl: 'storage.page.html'
})
export class StoragePage {

  saving = false;

  buildingType = "STORAGE";

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              private propertyService: PropertyService,
              public buildingService: BuildingService,
              public model: Model,
              private router: Router,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    if (!this.buildingService.getBuilding(this.buildingType)) {
      this.close();
    }
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
