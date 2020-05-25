import {Injectable} from '@angular/core';
import {Jewelry} from '../domain/jewelry.model';
import {EnumService} from './enum.service';

@Injectable({
  providedIn: 'root'
})
export class JewelryService {

  public jewelries = {};

  constructor(private enumService: EnumService) {}

  reset() {
    this.jewelries = {};
  }

  updateJewelry(jewelry: Jewelry) {
    this.jewelries[jewelry.type] = jewelry;
  }

  updateJewelries(jewelries?: Jewelry[]) {
    if (jewelries) {
      jewelries.forEach(j => {
        this.updateJewelry(j);
      });
    }
  }

  getJewelry(type: string): Jewelry {
    return this.jewelries[type];
  }

  getJewelries(slot: string): Jewelry[] {
    return this.enumService.getJewelTypes().filter(j => j.slot === slot)
        .map(type => this.jewelries[type.name] ? this.jewelries[type.name] : new Jewelry(type.name));
  }

  getSpecialJewelry(set: string): Jewelry {
    let jewelry: Jewelry = this.jewelries[set];
    return jewelry ? jewelry : new Jewelry(set);
  }

  getAllJewelries(): Jewelry[] {
    let jewelries: Jewelry[] = [];
    this.enumService.getJewelTypes().forEach(jewelry => {
      if (this.jewelries[jewelry.name]) {
        jewelries.push(this.jewelries[jewelry.name]);
      }
    });
    return jewelries;
  }

}
