import {Component} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {AlertController} from '@ionic/angular';

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
              private alertCtrl: AlertController) { }

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
          window.location.href = "/home";
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
          window.location.href = "/home";
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
