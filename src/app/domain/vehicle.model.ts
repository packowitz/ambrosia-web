import {VehicleBase} from './vehicleBase.model';
import {VehiclePart} from './vehiclePart.model';

export class Vehicle {
    id: number;
    playerId: number;
    baseVehicle: VehicleBase;
    level: number;
    slot?: number;
    engine?: VehiclePart;
    frame?: VehiclePart;
    computer?: VehiclePart;
    specialPart1?: VehiclePart;
    specialPart2?: VehiclePart;
    specialPart3?: VehiclePart;
}