import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {Model} from './model.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private model: Model) { }

  canActivate() {
    return this.model.player && (this.model.useServiceAccount || this.model.player.admin);
  }
}
