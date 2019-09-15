import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Gear} from '../domain/gear.model';
import {ConverterService} from '../services/converter.service';
import {BattleHero} from '../domain/battleHero.model';
import {Battle} from '../domain/battle.model';

@Component({
    selector: 'battlefield-hero',
    template: `
        <div class="container flex-vert" *ngIf="hero" 
             [class.container-active]="isActive()" 
             [class.container-targetable]="targetable" 
             (click)="selectHero()">
            <div class="flex-start mt-1">
                <div class="ml-1 level-bubble background-{{hero.color}}">{{hero.level}}</div>
                <div class="flex-grow" *ngIf="hero.status !== 'DEAD'">
                    <div class="ml-1 mr-1 health-bar">
                        <span class="health-bar-inner" [style.width]="(100 * hero.currentHp / hero.heroHp) + '%'"></span>
                    </div>
                    <div class="ml-1 mr-1 armor-bar">
                        <span class="armor-bar-inner" [style.width]="(100 * hero.currentArmor / hero.heroArmor) + '%'"></span>
                    </div>
                    <div class="ml-1 mr-1">
                        <div class="speedbar" [style.width]="hero.currentSpeedBar > 10000 ? '100%' : (hero.currentSpeedBar / 100) + '%'"></div>
                    </div>
                </div>
                <div class="flex-grow" *ngIf="hero.status === 'DEAD'">
                    <i class="color-orange">DEAD</i>
                </div>
            </div>
            <div class="buffs ml-1 mr-1 mt-1">
                <div *ngFor="let buff of hero.buffs" class="{{buff.type.toLowerCase()}} int-{{buff.intensity}} flex-center">
                    <i *ngIf="buff.buff === 'ARMOR_BUFF'" class="ra ra-eye-shield"></i>
                    <i *ngIf="buff.buff === 'STRENGTH_BUFF'" class="ra ra-muscle-up"></i>
                    <div class="buff-duration">{{buff.duration}}</div>
                </div>
            </div>
            <div class="flex-grow"></div>
            <div class="flex-center {{hero.color}}">{{hero.heroBase.name}}</div>
            <div class="flex-center mb-1"><ion-icon name="star" *ngFor="let star of converter.numberToArray(hero.stars)"></ion-icon></div>
        </div>
        <div class="container container-empty" *ngIf="!hero"></div>
  `,
    styleUrls: ['battlefieldHero.directive.scss']
})
export class BattlefieldHero {
    @Input() battle: Battle;
    @Input() hero: BattleHero;
    @Input() targetable: boolean;
    @Output() selected = new EventEmitter();

    constructor(private converter: ConverterService) { }

    isActive(): boolean {
        if (this.battle.status !== 'WON' && this.battle.status !== 'LOST') {
            return this.hero && this.battle.activeHero === this.hero.position;
        }
        return false;
    }

    selectHero() {
        if (this.targetable) {
            this.selected.emit(this.hero);
        }
    }

}