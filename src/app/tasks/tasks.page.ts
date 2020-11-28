import {Component, OnInit} from '@angular/core';
import {BackendService} from '../services/backend.service';
import {Model} from '../services/model.service';
import {EnumService} from '../services/enum.service';
import {PopoverController} from '@ionic/angular';
import {LootSelectionPopover} from '../common/loot-selection.popover';
import {LootBox} from '../domain/lootBox.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskCluster} from "../domain/taskCluster.model";
import {ConverterService} from "../services/converter.service";
import {Task} from "../domain/task.model";

@Component({
  selector: 'tasks-page',
  templateUrl: 'tasks.page.html'
})
export class TasksPage implements OnInit {

  saving = false;

  taskCluster: TaskCluster;

  constructor(private route: ActivatedRoute,
              private converter: ConverterService,
              private backendService: BackendService,
              public model: Model,
              public enumService: EnumService,
              private popoverCtrl: PopoverController,
              private router: Router) {}

  ngOnInit(): void {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    let cluster = this.model.taskClusters.find(t => t.id === id);
    if (cluster) {
      this.taskCluster = this.converter.dataClone(cluster);
    } else {
      this.initNewTaskCluster();
    }
    if (!this.model.lootBoxes) {
      this.backendService.loadAllLootBoxes().subscribe(data => {
        this.model.lootBoxes = data;
      });
    }
  }

  addTask() {
    let task = new Task();
    task.number = this.taskCluster.tasks.length + 1;
    this.taskCluster.tasks.push(task);
  }

  cancel() {
    this.router.navigateByUrl('/tasks');
  }

  async lootBoxSelection(task: Task) {
    let popover = await this.popoverCtrl.create({
      component: LootSelectionPopover,
      componentProps: {
        lootBoxType: 'ACHIEVEMENT',
        selected: task.lootBoxId
      }
    });
    popover.onDidDismiss().then(data => {
      if (data && data.data && data.data.id) {
        task.lootBoxId = data.data.id;
      }
    });
    await popover.present();
  }

  getLootBox(id: number): LootBox {
    return this.model.lootBoxes.find(l => l.id === id);
  }

  lootBoxName(id: number): string {
    let box = this.getLootBox(id);
    return box ? box.name : 'unknown';
  }

  gotoLootBox(lootBoxId: number) {
    this.router.navigateByUrl('/loot/box/' + lootBoxId);
  }

  initNewTaskCluster() {
    this.taskCluster = new TaskCluster();
    this.taskCluster.tasks = [];
  }

  taskClusterIncomplete(): boolean {
    return !this.taskCluster.name ||
        !this.taskCluster.sortOrder ||
        !this.taskCluster.category ||
        this.taskCluster.sortOrder <= 0 ||
        this.taskCluster.tasks.length === 0 ||
        !!this.taskCluster.tasks.find(t => this.taskIncomplete(t));
  }

  taskIncomplete(task: Task): boolean {
    return !task.number ||
        !task.taskType ||
        !task.taskAmount ||
        task.taskAmount <= 0 ||
        !task.lootBoxId;
  }

  saveTaskCluster() {
    this.saving = true;
    let taskCluster = this.converter.dataClone(this.taskCluster);
    taskCluster.tasks.forEach(t => delete t.reward);
    this.backendService.saveTaskCluster(taskCluster).subscribe(data => {
      this.model.updateTaskCluster(data);
      this.taskCluster = this.converter.dataClone(data);
      this.saving = false;
    });
  }
}
