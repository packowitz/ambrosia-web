import { Component } from '@angular/core';
import {EnumService} from '../services/enum.service';
import {BackendService} from '../services/backend.service';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'herobase-create',
  templateUrl: 'herobase-create.page.html'
})
export class HerobaseCreatePage {

  constructor(public enumService: EnumService,
              private backendService: BackendService,
              private toastCtrl: ToastController,
              private router: Router) {}

  createHero(form) {
    console.log("creating base hero: ");
    console.log(form.value);
    this.backendService.createHeroBase(form.value).subscribe(hero => {
      this.router.navigateByUrl('/herobase/edit/' + hero.id);
    }, error => {
      this.toastCtrl.create({
          message: error.error.message,
          showCloseButton: true,
          position: 'bottom',
          color: 'danger'
      }).then(toast => toast.present());
    });
  }
}
