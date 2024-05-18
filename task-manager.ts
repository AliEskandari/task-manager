type Task = {
  id: number;
  onStart: () => Promise<any>;
  status: "ready" | "in-progress" | "complete";
};
type TaskParams = Pick<Task, "onStart">;
type TaskMap = Map<number, Task>;

class TaskManager {
  private tasks: TaskMap = new Map<number, Task>();
  private nextId = 1;

  public addTask(taskParams: TaskParams): number {
    const task: Task = { ...taskParams, status: "ready", id: this.nextId };
    this.tasks.set(this.nextId++, task);
    return task.id;
  }

  public async startTask(id: number): Promise<any> {
    const task = this.tasks.get(id);
    if (!task) throw Error("task with id does not exist");
    task.status = "in-progress";
    await task.onStart();
    task.status = "complete";
  }

  public finishTask(id: number): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;
    task.status = "complete";
  }

  public getTasks(): TaskMap {
    return this.tasks;
  }
}

const taskManager = new TaskManager();
function taskGenerator(): TaskParams {
  return {
    onStart: () =>
      new Promise<void>((resolve) => {
        console.log("starting...");
        setTimeout(() => {
          console.log("done");
          resolve();
        }, 3000);
      }),
  };
}

// let newPromise = new Promise<string>((resolve, reject) => {
//   resolve("hello");
// });
// let newPromise2 = Promise.resolve("hello");
// console.log({ newPromise, newPromise2 });

// add tasks
// taskManager.addTask(taskGenerator());
// taskManager.addTask(taskGenerator());
// taskManager.addTask(taskGenerator());
// console.dir(taskManager.getTasks());

// taskManager.startTask(1);
// console.dir(taskManager.getTasks());
// taskManager.startTask(2);
// taskManager.startTask(3).then(() => {
//   console.dir(taskManager.getTasks());
// });
