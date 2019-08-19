import { Component, OnInit } from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';
import {Model} from '../services/model.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  register = false;

  constructor(private backendService: BackendService,
              private alertCtrl: AlertController,
              private model: Model,
              private router: Router) { }

  registerValid(): boolean {
    return this.name && this.name.length >= 4 && this.email && this.email.length >= 6 && this.password && this.password.length >= 8
        && this.password === this.rePassword;
  }

  doLogin() {
    if(!this.email || !this.password) {
      return;
    }
    this.backendService.login(this.email, this.password).subscribe(
        () => {
          this.router.navigateByUrl('/home');
        },
        error => {
          this.alertCtrl.create({
            header: 'Login failed',
            buttons: [{text: 'Okay'}]
          }).then(data => data.present());
        }
    );
  }

  doRegister() {
    if(!this.registerValid()) {
      return;
    }
    this.backendService.register(this.name, this.email, this.password).subscribe(
        () => {
          this.router.navigateByUrl('/home');
        },
        error => {
          this.alertCtrl.create({
            header: 'Register failed. Probably email is already in use.',
            buttons: [{text: 'Okay'}]
          }).then(data => data.present());
        }
    );
  }

}
