import { Component, OnInit } from '@angular/core';
import {Model} from '../services/model.service';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.page.html',
  styleUrls: ['./battle.page.scss'],
})
export class BattlePage implements OnInit {

  constructor(private model: Model) { }

  ngOnInit() {
  }

}
