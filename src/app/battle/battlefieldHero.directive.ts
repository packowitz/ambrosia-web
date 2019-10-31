import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Gear} from '../domain/gear.model';
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
             (click)="selectHero()">
            <div class="flex-start mt-1">
                <div class="ml-1 level-bubble background-{{hero.color}}">{{hero.level}}</div>
                <div class="flex-grow" *ngIf="!isDead()">
                    <div class="ml-1 mr-1 health-bar">
                        <span *ngIf="heroState" class="health-bar-inner" [style.width]="heroState.hpPerc + '%'"></span>
                        <span *ngIf="!heroState" class="health-bar-inner" [style.width]="(100 * hero.currentHp / hero.heroHp) + '%'"></span>
                    </div>
                    <div class="ml-1 mr-1 armor-bar">
                        <span *ngIf="heroState" class="armor-bar-inner" [style.width]="heroState.armorPerc + '%'"></span>
                        <span *ngIf="!heroState" class="armor-bar-inner" [style.width]="(100 * hero.currentArmor / hero.heroArmor) + '%'"></span>
                    </div>
                    <div class="ml-1 mr-1">
                        <div *ngIf="heroState" class="speedbar" [style.width]="heroState.speedbarPerc + '%'"></div>
                        <div *ngIf="!heroState" class="speedbar" [style.width]="hero.currentSpeedBar > 10000 ? '100%' : (hero.currentSpeedBar / 100) + '%'"></div>
                    </div>
                </div>
                <div class="flex-grow" *ngIf="isDead()">
                    <i class="color-orange">DEAD</i>
                </div>
            </div>
            <div class="buffs ml-1 mr-1 mt-1">
                <div *ngFor="let buff of heroState ? heroState.buffs : hero.buffs" class="{{buff.type.toLowerCase()}} int-{{buff.intensity}} flex-center">
                    <i *ngIf="buff.buff === 'ARMOR_BUFF'" class="ra ra-eye-shield"></i>
                    <i *ngIf="buff.buff === 'HEAL_OVER_TIME'" class="ra ra-health"></i>
                    <i *ngIf="buff.buff === 'STRENGTH_BUFF'" class="ra ra-muscle-up"></i>
                    <i *ngIf="buff.buff === 'TAUNT_BUFF'" class="ra ra-sheriff"></i>
                    <i *ngIf="buff.buff === 'DAMAGE_OVER_TIME'" class="ra ra-droplet"></i>
                    <div class="buff-duration" *ngIf="buff.duration > 0">{{buff.duration}}</div>
                </div>
            </div>
            <div class="flex-grow"></div>
            <div class="flex-center {{hero.color}}">{{hero.heroBase.name}}</div>
            <div class="flex-center mb-1"><ion-icon name="star" *ngFor="let star of converter.numberToArray(hero.stars)"></ion-icon></div>
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

    constructor(private converter: ConverterService) { }

    selectHero() {
        if (this.targetable) {
            this.selected.emit(this.hero);
        }
    }

    isDead(): boolean {
        return (this.heroState && this.heroState.status === 'DEAD') || (!this.heroState && this.hero.status === 'DEAD');
    }

}