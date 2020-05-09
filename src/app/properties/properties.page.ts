import {Component} from '@angular/core';
import {EnumService, PropertyCategory, PropertyType} from '../services/enum.service';
import {DynamicProperty} from '../domain/property.model';
import {PropertyService} from '../services/property.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html'
})
export class PropertiesPage {

  category: PropertyCategory;
  types: PropertyType[] = [];
  type: PropertyType;
  properties: DynamicProperty[];

  constructor(public enumService: EnumService, private propertyService: PropertyService) {}

  categoryChanged(event) {
    this.category = event.detail.value;
    this.properties = null;
    this.type = null;
    this.types = this.enumService.getPropertyTypes().filter(t => t.category === this.category.name);
  }

  typeChanged(event) {
    this.properties = null;
    this.type = event.detail.value;
    this.propertyService.getProperties(this.type.name).subscribe(data => {
      this.properties = data;
    });
  }

  addProperty() {
    if (this.properties) {
      let prop = new DynamicProperty();
      prop.category = this.category.name;
      prop.type = this.type.name;
      this.properties.push(prop);
    }
  }

  save() {
    this.propertyService.saveProperties(this.type.name, this.properties).subscribe(data => {
      this.properties = data;
    });
  }

  delete(prop: DynamicProperty) {
    if (!prop.id) {
      let idx = this.properties.indexOf(prop);
      this.properties.splice(idx, 1);
    }

  }

}
