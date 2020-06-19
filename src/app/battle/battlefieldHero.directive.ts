import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ConverterService} from '../services/converter.service';
import {BattleHero} from '../domain/battleHero.model';
import {Battle} from '../domain/battle.model';
import {BattleStepHeroState} from '../domain/battleStepHeroState.model';

@Component({
    selector: 'battlefield-hero',
    template: `
      <div class="container flex-vert" *ngIf="hero"
           [class.container-active]="active"
           [class.container-dead]="isDead()"
           [class.container-targetable]="targetable"
           [class.container-boss]="hero.markedAsBoss"
           (click)="selectHero()">
        <img [src]="'assets/icon/chars/' + hero.heroBase.avatar + '.png'" class="full-width">
        <div class="bars flex-start">
          <div class="ml-05 level-bubble background-{{hero.color}}">{{hero.level}}</div>
          <div class="flex-grow" *ngIf="!isDead()">
            <div class="ml-05 mr-05 health-bar">
              <span *ngIf="heroState" class="health-bar-inner" [style.width]="heroState.hpPerc + '%'"></span>
              <span *ngIf="!heroState" class="health-bar-inner" [style.width]="(100 * hero.currentHp / hero.heroHp) + '%'"></span>
            </div>
            <div class="ml-05 mr-05 armor-bar">
              <span *ngIf="heroState" class="armor-bar-inner" [style.width]="heroState.armorPerc + '%'"></span>
              <span *ngIf="!heroState" class="armor-bar-inner" [style.width]="(100 * hero.currentArmor / hero.heroArmor) + '%'"></span>
            </div>
            <div class="ml-05 mr-05">
              <div *ngIf="heroState" class="speedbar" [style.width]="heroState.speedbarPerc + '%'"></div>
              <div *ngIf="!heroState" class="speedbar"
                   [style.width]="hero.currentSpeedBar > 10000 ? '100%' : (hero.currentSpeedBar / 100) + '%'"></div>
            </div>
          </div>
          <div class="flex-grow" *ngIf="isDead()">
            <i class="color-orange">DEAD</i>
          </div>
        </div>
        <div class="buffs ml-05 mr-05 mt-1">
          <div *ngFor="let buff of heroState ? heroState.buffs : hero.buffs"
               class="buff flex-center">
            <img src="assets/icon/buffs/{{buff.buff}}_{{buff.intensity}}.png" class="buff-icon">
            <div class="buff-duration" *ngIf="buff.duration > 0">{{buff.duration}}</div>
          </div>
        </div>
        <div *ngIf="isDead()" class="death-skull flex-center">
          <i class="ra ra-death-skull"></i>
        </div>
        <ng-content></ng-content>
      </div>
      <div class="container container-empty" *ngIf="!hero"></div>
    `,
    styleUrls: ['battlefieldHero.directive.scss']
})
export class BattlefieldHero {
    @Input() battle: Battle;
    @Input() active: boolean;
    @Input() hero: BattleHero;
    @Input() heroState?: BattleStepHeroState;
    @Input() targetable: boolean;
    @Output() selected = new EventEmitter();

    constructor(private converter: ConverterService) {
    }

    selectHero() {
        if (this.targetable) {
            this.selected.emit(this.hero);
        }
    }

    isDead(): boolean {
        return (this.heroState && this.heroState.status === 'DEAD') || (!this.heroState && this.hero.status === 'DEAD');
    }

}