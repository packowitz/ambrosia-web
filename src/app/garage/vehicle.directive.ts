import {Component, Input} from '@angular/core';
import {Vehicle} from '../domain/vehicle.model';

@Component({
  selector: 'vehicle',
  template: `
      <div class="vehicle-avatar border-grey" [class.small]="small">
        <div class="position-relative">
          <ion-img src="/assets/img/vehicles/{{vehicle.baseVehicle.avatar}}.png"></ion-img>
          <div class="top-left-bubble level-bubble background-black">{{vehicle.level}}</div>
          <div *ngIf="showMission && vehicle.missionId" class="on-mission flex-vert-center">
            <div class="text">On Mission</div>
          </div>
        </div>
        <div class="ion-text-center">{{vehicle.baseVehicle.name}}</div>
        <div class="flex-space-around">
          <ion-img class="vehicle-part" src="/assets/img/vehicles/parts/ENGINE_{{vehicle.engine ? vehicle.engine.quality : 'NONE'}}.png"></ion-img>
          <ion-img class="vehicle-part" src="/assets/img/vehicles/parts/FRAME_{{vehicle.frame ? vehicle.frame.quality : 'NONE'}}.png"></ion-img>
          <ion-img class="vehicle-part" src="/assets/img/vehicles/parts/COMPUTER_{{vehicle.computer ? vehicle.computer.quality : 'NONE'}}.png"></ion-img>
        </div>
        <div class="mt-05 flex-space-around">
          <ion-img class="vehicle-part" src="/assets/img/vehicles/parts/{{vehicle.specialPart1 ? vehicle.specialPart1.type + '_' + vehicle.specialPart1.quality : (vehicle.baseVehicle.specialPart1Quality ? vehicle.baseVehicle.specialPart1 + '_NONE' : 'SPECIAL_NONE')}}.png"></ion-img>
          <ion-img class="vehicle-part" src="/assets/img/vehicles/parts/{{vehicle.specialPart2 ? vehicle.specialPart2.type + '_' + vehicle.specialPart2.quality : (vehicle.baseVehicle.specialPart2Quality ? vehicle.baseVehicle.specialPart2 + '_NONE' : 'SPECIAL_NONE')}}.png"></ion-img>
          <ion-img class="vehicle-part" src="/assets/img/vehicles/parts/{{vehicle.specialPart3 ? vehicle.specialPart3.type + '_' + vehicle.specialPart3.quality : (vehicle.baseVehicle.specialPart3Quality ? vehicle.baseVehicle.specialPart3 + '_NONE' : 'SPECIAL_NONE')}}.png"></ion-img>
        </div>
      </div>
  `
})
export class VehicleDirective {
  @Input() vehicle: Vehicle;
  @Input() small = false;
  @Input() showMission = false;
}