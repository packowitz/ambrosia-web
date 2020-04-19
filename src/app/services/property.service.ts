import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DynamicProperty} from '../domain/property.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {API_URL} from '../../environments/environment';
import {VehiclePart} from '../domain/vehiclePart.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  initialCategories = ['JEWEL', 'HERO', 'VEHICLE', 'UPGRADE_TIME', 'UPGRADE_COST', 'BUILDING'];

  properties = {};

  constructor(private http: HttpClient) { }

  getProperties(type: string): Observable<DynamicProperty[]> {
    if (this.properties[type]) {
      return Observable.create(obs => obs.next(this.properties[type]));
    } else {
      return this.http.get<DynamicProperty[]>(API_URL + '/properties/type/' + type).pipe(map(p => {
        this.properties[type] = p;
        return p;
      }));
    }
  }

  loadInitialProperties() {
    this.initialCategories.forEach(category => {
      this.http.get<any>(API_URL + '/properties/category/' + category).subscribe(data => {
        // tslint:disable-next-line:forin
        for (let key in data) {
          this.properties[key] = data[key];
        }
      });
    });
  }

  getProps(type: string, level: number): DynamicProperty[] {
    let props = this.properties[type];
    if (props) {
      return props.filter((p: DynamicProperty) => p.level === level);
    }
    return [];
  }

  getJewelValue(type: string, level: number): number {
    let props = this.properties[type + '_JEWEL'];
    if (props) {
      let jewelProperty = props.find((p: DynamicProperty) => p.level === level);
      if (jewelProperty) {
        return jewelProperty.value1;
      }
    }
    return 0;
  }

  getJewelValueAndName(type: string, level: number): string[] {
    let props = this.properties[type + '_JEWEL'];
    if (props) {
      return props.filter((p: DynamicProperty) => p.level === level).map(prop => {
        let returnValue = '+' + prop.value1;
        switch (prop.stat) {
          case 'HP_ABS': returnValue += ' HP'; break;
          case 'HP_PERC': returnValue += '% HP'; break;
          case 'ARMOR_ABS': returnValue += ' Armor'; break;
          case 'ARMOR_PERC': returnValue += '% Armor'; break;
          case 'STRENGTH_ABS': returnValue += ' Strength'; break;
          case 'STRENGTH_PERC': returnValue += '% Strength'; break;
          case 'CRIT': returnValue += ' Crit'; break;
          case 'CRIT_MULT': returnValue += ' CritMult'; break;
          case 'RESISTANCE': returnValue += ' Resistance'; break;
          case 'DEXTERITY': returnValue += ' Dexterity'; break;
          case 'INITIATIVE': returnValue += ' Initiative'; break;
          case 'SPEED': returnValue += ' Speed'; break;
          case 'LIFESTEAL': returnValue += ' Lifesteal'; break;
          case 'COUNTER_CHANCE': returnValue += ' Counter'; break;
          case 'REFLECT': returnValue += ' Reflect'; break;
          case 'DODGE_CHANCE': returnValue += ' Dodge'; break;
          case 'ARMOR_PIERCING': returnValue += ' Armor Piercing'; break;
          case 'ARMOR_EXTRA_DMG': returnValue += ' Armor Dmg'; break;
          case 'HEALTH_EXTRA_DMG': returnValue += ' Health Dmg'; break;
          case 'RED_DMG_INC': returnValue += ' Red Dmg'; break;
          case 'GREEN_DMG_INC': returnValue += ' Green Dmg'; break;
          case 'BLUE_DMG_INC': returnValue += ' Blue Dmg'; break;
          case 'HEALING_INC': returnValue += ' Healing'; break;
          case 'SUPER_CRIT_CHANCE': returnValue += ' SuperCrit'; break;
          case 'BUFF_INTENSITY_INC': returnValue += ' Buff Intensity'; break;
          case 'DEBUFF_INTENSITY_INC': returnValue += ' Debuff Intensity'; break;
          case 'BUFF_DURATION_INC': returnValue += ' Buff Duration'; break;
          case 'DEBUFF_DURATION_INC': returnValue += ' Debuff Duration'; break;
          case 'HEAL_PER_TURN': returnValue += ' Heal over time'; break;
          case 'DMG_PER_TURN': returnValue += ' Dmg over time'; break;
          case 'CONFUSE_CHANCE': returnValue += ' Confuse'; break;
          case 'DAMAGE_REDUCTION': returnValue += ' Dmg Reduction'; break;
          case 'BUFF_RESISTANCE': returnValue += ' Buff Resistance'; break;
        }
        return returnValue;
      });
    }
    return [];
  }

  getHeroMaxXp(level: number): number {
    let props = this.properties['XP_MAX_HERO'];
    if (props) {
      let lvlProp = props.find((p: DynamicProperty) => p.level === level);
      if (lvlProp) {
        return lvlProp.value1;
      }
    }
    return 0;
  }

  getHeroMergeXp(level: number): number {
    let props = this.properties['MERGE_XP_HERO'];
    if (props) {
      let lvlProp = props.find((p: DynamicProperty) => p.level === level);
      if (lvlProp) {
        return lvlProp.value1;
      }
    }
    return 0;
  }

  getHeroMaxAsc(ascLevel: number): number {
    let props = this.properties['ASC_POINTS_MAX_HERO'];
    if (props) {
      let lvlProp = props.find((p: DynamicProperty) => p.level === ascLevel);
      if (lvlProp) {
        return lvlProp.value1;
      }
    }
    return 0;
  }

  getHeroMergeAsc(rarity: number): number {
    let props = this.properties['MERGE_ASC_HERO'];
    if (props) {
      let lvlProp = props.find((p: DynamicProperty) => p.level === rarity);
      if (lvlProp) {
        return lvlProp.value1;
      }
    }
    return 0;
  }

  getVehiclePartProperties(part: VehiclePart): DynamicProperty[] {
    let props = this.properties[part.type + '_PART_' + part.quality];
    if (props) {
      return props.filter((p: DynamicProperty) => p.level === part.level);
    }
    return [];
  }

  getUpgradeTime(type: string, level: number): DynamicProperty[] {
    return this.getProps(type + '_UP_TIME', level);
  }

  getUpgradeCosts(type: string, level: number): DynamicProperty[] {
    return this.getProps(type + '_UP_COST', level);
  }

  getIncubationTime(genome: string): DynamicProperty[] {
    return this.getProps(genome + '_TIME', 1);
  }

  getIncubationCosts(genome: string): DynamicProperty[] {
    return this.getProps(genome + '_COST', 1);
  }

  saveProperties(type: string, properties: DynamicProperty[]): Observable<DynamicProperty[]> {
    return this.http.post<DynamicProperty[]>(API_URL + '/admin/properties/type/' + type, properties).pipe(map(p => {
      this.properties[type] = p;
      return p;
    }));
  }

  deleteProperty(prop: DynamicProperty): Observable<DynamicProperty[]> {
    if (prop.id) {
      return this.http.delete<DynamicProperty[]>(API_URL + '/admin/properties/type/' + prop.type + '/' + prop.id).pipe(map(p => {
        this.properties[prop.type] = p;
        return p;
      }));
    }
  }
}
