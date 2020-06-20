import {Injectable} from '@angular/core';
import {Model} from './model.service';
import {DynamicProperty} from '../domain/property.model';
import {PropertyService} from './property.service';


@Injectable({
    providedIn: 'root'
})
export class BuildingService {

    constructor(private model: Model,
                private propertyService: PropertyService) {}

    getBuilding(buildingType: string) {
        return this.model.getBuilding(buildingType);
    }

    getUpgradeCosts(buildingType: string): DynamicProperty[] {
        return this.propertyService.getUpgradeCosts(buildingType, this.getBuilding(buildingType).level + 1);
    }

    getUpgradeSeconds(buildingType: string): number {
        let upTimes = this.propertyService.getUpgradeTime(buildingType, this.getBuilding(buildingType).level + 1);
        if (upTimes.length === 1) {
            return upTimes[0].value1;
        }
        return -1;
    }

    getUpgradeCss(buildingType: string): string {
        if (this.upgradeInProgress(buildingType)) { return 'upgrade-in-progress'; }
        if (this.upgradeFinished(buildingType)) { return 'upgrade-done'; }
        if (this.canEffortUpgradeBuilding(buildingType)) { return 'upgrade-possible'; }
        return 'upgrade-not-possible';
    }

    canEffortUpgradeBuilding(buildingType: string): boolean {
        if (this.getUpgradeSeconds(buildingType) < 0) {
            return false;
        }
        let enoughResources = true;
        this.getUpgradeCosts(buildingType).forEach(c => {
            if (!this.model.hasEnoughResources(c.resourceType, c.value1)) {
                enoughResources = false;
            }
        });
        return enoughResources;
    }

    upgradeInProgress(buildingType: string): boolean {
        return this.getBuilding(buildingType).upgradeTriggered && !this.model.upgrades.find(u => u.buildingType === buildingType && u.finished);
    }

    upgradeFinished(buildingType: string): boolean {
        return this.getBuilding(buildingType).upgradeTriggered && !!this.model.upgrades.find(u => u.buildingType === buildingType && u.finished);
    }
}