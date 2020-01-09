import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Hero} from '../domain/hero.model';
import {DungeonResolved} from '../domain/dungeonResolved.model';
import {Team} from '../domain/team.model';
import {PlayerMap} from '../domain/playerMap.model';
import {PlayerMapTile} from '../domain/playerMapTile.model';
import {Location} from '@angular/common';

@Component({
  selector: 'campaign-fight',
  templateUrl: 'campaignFight.page.html'
})
export class CampaignFightPage implements OnInit {

  saving = false;

  map: PlayerMap;
  tile: PlayerMapTile;

  dungeon: DungeonResolved;
  team: Team;
  hero1?: Hero;
  hero2?: Hero;
  hero3?: Hero;
  hero4?: Hero;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private router: Router,
              public model: Model,
              public enumService: EnumService,
              private location: Location) {
  }

  ngOnInit() {
    let mapId = Number(this.route.snapshot.paramMap.get('mapId'));
    let posX = Number(this.route.snapshot.paramMap.get('posX'));
    let posY = Number(this.route.snapshot.paramMap.get('posY'));
    this.map = this.model.playerMaps.find(m => m.mapId === mapId);
    this.tile = this.map.tiles.find(t => t.posX === posX && t.posY === posY);
    this.backendService.getDungeon(this.tile.fightId).subscribe(data => {
      this.dungeon = data;
    });
    if (!this.model.teams) {
      this.backendService.getOwnTeams().subscribe(data => {
        this.model.teams = data;
        this.initTeam();
      });
    } else {
      this.initTeam();
    }
  }

  close() {
    this.location.back();
  }

  initTeam() {
    this.team = this.model.teams.find(t => t.type === 'CAMPAIGN');
    if (!this.team) {
      this.team = new Team('CAMPAIGN');
    } else {
      this.hero1 = this.team.hero1Id ? this.model.heroes.find(h => h.id === this.team.hero1Id) : null;
      this.hero2 = this.team.hero2Id ? this.model.heroes.find(h => h.id === this.team.hero2Id) : null;
      this.hero3 = this.team.hero3Id ? this.model.heroes.find(h => h.id === this.team.hero3Id) : null;
      this.hero4 = this.team.hero4Id ? this.model.heroes.find(h => h.id === this.team.hero4Id) : null;
    }
  }

  selectHero(hero: Hero) {
    if (!this.successfullyRemoved(hero)) {
      if (!this.team.hero1Id) {
        this.team.hero1Id = hero.id;
        this.hero1 = hero;
      } else if (!this.team.hero2Id) {
        this.team.hero2Id = hero.id;
        this.hero2 = hero;
      } else if (!this.team.hero3Id) {
        this.team.hero3Id = hero.id;
        this.hero3 = hero;
      } else if (!this.team.hero4Id) {
        this.team.hero4Id = hero.id;
        this.hero4 = hero;
      }
    }
  }

  successfullyRemoved(hero: Hero): boolean {
    if (this.team.hero1Id && this.team.hero1Id === hero.id) {
      this.team.hero1Id = null;
      this.hero1 = null;
      return true;
    }
    if (this.team.hero2Id && this.team.hero2Id === hero.id) {
      this.team.hero2Id = null;
      this.hero2 = null;
      return true;
    }
    if (this.team.hero3Id && this.team.hero3Id === hero.id) {
      this.team.hero3Id = null;
      this.hero3 = null;
      return true;
    }
    if (this.team.hero4Id && this.team.hero4Id === hero.id) {
      this.team.hero4Id = null;
      this.hero4 = null;
      return true;
    }
    return false;
  }

  start() {
    this.backendService.startCampaignFight(this.map.mapId, this.tile.posX, this.tile.posY, this.team).subscribe(() => {
      this.router.navigateByUrl('/battle');
    });
  }
}
