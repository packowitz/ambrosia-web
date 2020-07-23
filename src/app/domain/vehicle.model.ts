import {VehicleBase} from './vehicleBase.model';
import {VehiclePart} from './vehiclePart.model';

export class Vehicle {
    id: number;
    playerId: number;
    missionId: number;
    playerExpeditionId: number;
    baseVehicle: VehicleBase;
    baseVehicleId: number;
    level: number;
    upgradeTriggered: boolean;
    slot?: number;
    engine?: VehiclePart;
    frame?: VehiclePart;
    computer?: VehiclePart;
    specialPart1?: VehiclePart;
    specialPart2?: VehiclePart;
    specialPart3?: VehiclePart;
}