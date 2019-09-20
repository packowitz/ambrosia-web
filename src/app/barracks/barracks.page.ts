import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Hero} from '../domain/hero.model';
import {HeroClassRarity} from '../herobase/herobase-list.page';
import {ConverterService} from '../services/converter.service';
import {HeroSkill} from '../domain/heroSkill.model';
import {Model} from '../services/model.service';
import {Gear} from '../domain/gear.model';
import {EnumService, GearSet} from '../services/enum.service';
import {ModalController} from '@ionic/angular';
import {GearModal} from './gear.modal';

@Component({
  selector: 'barracks',
  templateUrl: 'barracks.page.html',
  styleUrls: ['barracks.page.scss']
})
export class BarracksPage implements OnInit {

  selectedHero: Hero;
  tab = "stats";
  selectedSkill: HeroSkill;
  gearTypeFilter: string[] = [];

  constructor(private backendService: BackendService,
              private converter: ConverterService,
              public model: Model,
              private enumService: EnumService) {}

  ngOnInit(): void {
    if (this.model.heroes.length > 0) {
      this.selectedHero = this.model.heroes[0];
      this.selectSkill(1);
    }

  }

  selectHero(hero: Hero) {
    this.selectedHero = hero;
    this.selectSkill(this.selectedSkill.number);
  }

  selectSkill(number: number) {
    this.selectedSkill = this.selectedHero.heroBase.skills.find(s => s.number === number);
    if (!this.selectedSkill) {
      this.selectedSkill = this.selectedHero.heroBase.skills[0];
    }
  }

  getSkillLevel(skill: HeroSkill): number {
    return this.selectedHero['skill' + skill.number];
  }

  getSetDescription(setName: string): string {
    let set = this.enumService.getGearSets().find(s => s.name === setName);
    return set ? set.description : "";
  }

  getSetPieces(setName: string): number {
    let set = this.enumService.getGearSets().find(s => s.name === setName);
    return set ? set.pieces : 0;
  }

  adminHeroLooseLevel() {
    this.backendService.adminHeroLooseLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  adminHeroGainLevel() {
    this.backendService.adminHeroGainLevel(this.selectedHero).subscribe(data => {
      this.selectHero(data);
    });
  }

  gearFilter(type: string) {
    let idx = this.gearTypeFilter.indexOf(type);
    if (idx >= 0) {
      this.gearTypeFilter.splice(idx, 1);
    } else {
      this.gearTypeFilter.push(type);
    }
  }

  getAvailableGears(): Gear[] {
    if (this.gearTypeFilter.length > 0) {
      return this.model.gears.filter(g => this.converter.rarityStars(g.rarity) <= this.selectedHero.stars && this.gearTypeFilter.indexOf(g.type) >= 0);
    } else {
      return this.model.gears.filter(g => this.converter.rarityStars(g.rarity) <= this.selectedHero.stars);
    }
  }
}
