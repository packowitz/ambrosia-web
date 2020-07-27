import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {Vehicle} from '../domain/vehicle.model';
import {BackendService} from '../services/backend.service';
import {ModalController, PopoverController} from '@ionic/angular';
import {VehicleSelectionPopover} from './vehicle-selection-popover';
import {VehiclePart} from '../domain/vehiclePart.model';
import {ConverterService} from '../services/converter.service';
import {PropertyService} from '../services/property.service';
import {VehicleUpgradeModal} from './vehicleUpgrade.modal';
import {Router} from '@angular/router';
import {VehiclePartUpgradeModal} from './vehiclePartUpgrade.modal';
import {BuildingUpgradeModal} from '../common/buildingUpgrade.modal';
import {StoryService} from '../services/story.service';
import {BuildingService} from '../services/building.service';
import {GarageUpgradeInfoModal} from './garage-upgrade-info.modal';

export class GarageSlot {
  slot: number;
  vehicle?: Vehicle;

  constructor(slot: number, vehicle: Vehicle) {
    this.slot = slot;
    this.vehicle = vehicle;
  }
}

@Component({
  selector: 'garage',
  templateUrl: 'garage.page.html'
})
export class GaragePage {

  saving = false;

  buildingType = "GARAGE";
  enterStory = this.buildingType + '_ENTERED';

  slots: GarageSlot[] = [];
  vehicle: Vehicle;

  constructor(public model: Model,
              private router: Router,
              private backendService: BackendService,
              private popoverCtrl: PopoverController,
              public converter: ConverterService,
              public propertyService: PropertyService,
              public buildingService: BuildingService,
              private modalCtrl: ModalController,
              private storyService: StoryService) {
    if (!this.buildingService.getBuilding(this.buildingType)) {
      this.close();
    }
  }

  ionViewWillEnter() {
    this.vehicle = null;
    this.initSlots();
    if (this.storyService.storyUnknown(this.enterStory)) {
      this.storyService.showStory(this.enterStory).subscribe(() => console.log(this.enterStory + ' story finished'));
    }
  }

  initSlots() {
    let slot = 1;
    this.slots = [];
    while (slot <= this.model.progress.garageSlots) {
      let vehicle = this.model.vehicles.find(v => v.slot === slot);
      this.slots.push(new GarageSlot(slot, vehicle));
      this.vehicle = this.vehicle || vehicle;
      slot ++;
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

  openUpgradeVehicleModal() {
    if (this.vehicle) {
      this.modalCtrl.create({
        component: VehicleUpgradeModal,
        componentProps: {
          vehicleId: this.vehicle.id
        }
      }).then(modal => {
        modal.onDidDismiss().then(() => this.selectVehicle(this.model.getVehicle(this.vehicle.id)));
        modal.present();
      });
    }
  }

  openUpgradeVehiclePartModal(part: VehiclePart) {
    if (part) {
      this.modalCtrl.create({
        component: VehiclePartUpgradeModal,
        componentProps: {
          partId: part.id
        }
      }).then(modal => modal.present());
    }
  }

  canUpgradeVehicle(): boolean {
    return this.vehicle && this.model.progress.vehicleUpgradeLevel > this.vehicle.level && !this.vehicle.missionId && !this.vehicle.playerExpeditionId && this.vehicle.level < this.model.getVehicleBase(this.vehicle.baseVehicleId).maxLevel;
  }

  canUpgradeVehiclePart(part: VehiclePart): boolean {
    return this.model.progress.vehicleUpgradeLevel > part.level && !!this.propertyService.getUpgradeTime('PART_' + part.quality, part.level + 1);
  }

  canPluginPart(part: VehiclePart): boolean {
    if (part.level <= this.vehicle.level) {
      if (part.type === 'ENGINE' || part.type === 'FRAME' || part.type === 'COMPUTER') {
        return true;
      }
      let baseVehicle = this.model.getVehicleBase(this.vehicle.baseVehicleId);
      if (part.type === baseVehicle.specialPart1) {
        switch(part.quality) {
          case 'BASIC': return true;
          case 'MODERATE': return baseVehicle.specialPart1Quality !== 'BASIC';
          case 'GOOD': return baseVehicle.specialPart1Quality === 'GOOD';
        }
      }
      if (part.type === baseVehicle.specialPart2) {
        switch(part.quality) {
          case 'BASIC': return true;
          case 'MODERATE': return baseVehicle.specialPart2Quality !== 'BASIC';
          case 'GOOD': return baseVehicle.specialPart2Quality === 'GOOD';
        }
      }
      if (part.type === baseVehicle.specialPart3) {
        switch(part.quality) {
          case 'BASIC': return true;
          case 'MODERATE': return baseVehicle.specialPart3Quality !== 'BASIC';
          case 'GOOD': return baseVehicle.specialPart3Quality === 'GOOD';
        }
      }
    }
    return false;
  }

  reloadVehicle() {
    this.vehicle = this.model.vehicles.find(v => v.id === this.vehicle.id);
  }

  getSpareParts(): VehiclePart[] {
    return this.model.vehicleParts.filter(p => p.equippedTo == null);
  }

  close() {
    this.router.navigateByUrl('/home');
  }

  showUpgradeInfo() {
    this.modalCtrl.create({component: GarageUpgradeInfoModal}).then(m => m.present() );
  }

  selectVehicle(vehicle: Vehicle) {
    this.vehicle = vehicle;
  }

  emptySlot(slot: number) {
    this.popoverCtrl.create({
      component: VehicleSelectionPopover
    }).then(modal => {
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null && dataReturned.data) {
          this.saving = true;
          this.backendService.activateVehicle(dataReturned.data, slot).subscribe(() => {
            this.saving = false;
            this.initSlots();
            this.vehicle = this.model.vehicles.find(v => v.slot === slot) || this.vehicle;
          });
        }
      });
      modal.present();
    });
  }

  deactivate(vehicle: Vehicle) {
    this.saving = true;
    this.backendService.deactivateVehicle(vehicle).subscribe(() => {
      if (vehicle.slot === this.vehicle.slot) {
        this.vehicle = null;
      }
      this.saving = false;
      this.initSlots();
    });
  }

  plugin(part: VehiclePart) {
    this.saving = true;
    this.backendService.pluginPart(part, this.vehicle).subscribe(() => {
      this.saving = false;
      this.reloadVehicle();
    });
  }

  unplug(part: VehiclePart) {
    this.saving = true;
    this.backendService.unplugPart(part, this.vehicle).subscribe(() => {
      this.saving = false;
      this.reloadVehicle();
    });
  }
}
