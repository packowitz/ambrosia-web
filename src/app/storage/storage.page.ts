import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {ConverterService} from '../services/converter.service';
import {Model} from '../services/model.service';
import {PropertyService} from '../services/property.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {DynamicProperty} from '../domain/property.model';

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
              public model: Model,
              private router: Router,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    if (!this.getBuilding()) {
      this.close();
    }
  }

  getUpgradeState(): string {
    if (this.upgradeInProgress()) { return 'in-progress'; }
    if (this.upgradeFinished()) { return 'done'; }
    if (this.canUpgradeBuilding()) { return 'possible'; }
    return 'not-possible';
  }

  getUpgradeCosts(): DynamicProperty[] {
    return this.propertyService.getUpgradeCosts(this.buildingType, this.getBuilding().level + 1);
  }

  canUpgradeBuilding(): boolean {
    let enoughResources = true;
    this.getUpgradeCosts().forEach(c => {
      if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
        enoughResources = false;
      }
    });
    return enoughResources;
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
