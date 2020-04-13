import {Component} from '@angular/core';
import {Model} from '../services/model.service';
import {Location} from '@angular/common';
import {Vehicle} from '../domain/vehicle.model';
import {BackendService} from '../services/backend.service';
import {ModalController, PopoverController} from '@ionic/angular';
import {VehicleSelectionPopover} from './vehicle-selection-popover';
import {VehiclePart} from '../domain/vehiclePart.model';
import {ConverterService} from '../services/converter.service';
import {PropertyService} from '../services/property.service';
import {GarageUpgradeModal} from './garageUpgrade.modal';

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
  canUpgradeBuilding = false;

  slots: GarageSlot[] = [];
  vehicle: Vehicle;

  spareParts: VehiclePart[] = [];

  constructor(public model: Model,
              private location: Location,
              private backendService: BackendService,
              private popoverCtrl: PopoverController,
              public converter: ConverterService,
              public propertyService: PropertyService,
              private modalCtrl: ModalController) {
  }

  ionViewWillEnter() {
    this.canUpgradeBuilding = this.propertyService.getBuildingUpgradeTime(this.buildingType, this.getBuilding().level + 1).length > 0;
    this.initSlots();
  }

  getBuilding() {
    return this.model.getBuilding(this.buildingType);
  }

  getVehicleStorage(): number {
    return this.model.vehicles.filter(v => !v.slot).length;
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
    this.initSpareParts();
  }

  openUpgradeModal() {
    this.modalCtrl.create({
      component: GarageUpgradeModal
    }).then(modal => {
      modal.onDidDismiss().then(() => this.ionViewWillEnter());
      modal.present();
    });
  }

  reloadVehicle() {
    this.vehicle = this.model.vehicles.find(v => v.id === this.vehicle.id);
    this.initSpareParts();
  }

  initSpareParts() {
    if (this.vehicle) {
      this.spareParts = this.model.vehicleParts.filter(p => {
        if (p.equippedTo == null) {
          if (p.level <= this.vehicle.level) {
            return true;
          }
        }
        return false;
      });
    } else {
      this.spareParts = [];
    }
  }

  close() {
    this.location.back();
  }

  selectVehicle(vehicle: Vehicle) {
    this.vehicle = vehicle;
    this.initSpareParts();
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

  deactivate() {
    this.saving = true;
    this.backendService.deactivateVehicle(this.vehicle).subscribe(() => {
      this.saving = false;
      this.vehicle = null;
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
