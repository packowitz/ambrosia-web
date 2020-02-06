import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DynamicProperty} from '../domain/property.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {API_URL} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  initialCategories = ['JEWEL', 'HERO'];

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
