import {Task} from "./task.model";

export class TaskCluster {
    id: number;
    name: string;
    category: string;
    sortOrder: number;
    tasks: Task[];
}
