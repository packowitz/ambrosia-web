import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Vehicle} from '../domain/vehicle.model';

@Component({
    selector: 'vehicle-selection-modal',
    template: `
        <div class="scrollable-list ma-2">
          <div *ngIf="showNoVehicle" class="vehicle-avatar small mr-2 flex-center">
            <img class="vehicle-avatar small pointer" (click)="closeModal(null)" src="/assets/img/vehicles/EMPTY_SLOT.png">
          </div>
          <vehicle *ngFor="let vehicle of vehicles" [vehicle]="vehicle" [small]="true" (click)="closeModal(vehicle)" class="pointer mr-2"></vehicle>
        </div>
    `
})
export class VehicleSelectionPopover implements OnInit {

    vehicles: Vehicle[] = [];
    showNoVehicle = false;
    vehiclesInSlot = false;
    showBusyVehicles = true;

    constructor(private popoverController: PopoverController,
                private navParams: NavParams,
                private model: Model) {
        this.showNoVehicle = navParams.get('noVehicle') === true;
        this.vehiclesInSlot = navParams.get('vehiclesInSlot') === true;
    }

    ngOnInit(): void {
        if (this.vehiclesInSlot) {
            if (this.showBusyVehicles) {
                this.vehicles = this.model.vehicles.filter(v => v.slot != null);
            } else {
                this.vehicles = this.model.vehicles.filter(v => v.slot != null && !v.missionId && !v.upgradeTriggered && !v.playerExpeditionId);
            }
        } else {
            this.vehicles = this.model.vehicles.filter(v => v.slot == null);
        }
    }

    closeModal(vehicle?: Vehicle) {
        this.popoverController.dismiss(vehicle);
    }
}