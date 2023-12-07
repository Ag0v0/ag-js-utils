export default class Queue {
  concurrency: number;
  running: number;
  queue: { task: () => Promise<any>; resolve: (value?: any) => void; reject: (reason?: any) => void }[];

  constructor(concurrency: number) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  add(task: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  run(): void {
    if (this.running >= this.concurrency) {
      return;
    }

    const item = this.queue.shift();
    if (!item) {
      return;
    }

    this.running++;
    item
      .task()
      .then((result) => {
        item.resolve(result);
      })
      .catch((error) => {
        item.reject(error);
      })
      .finally(() => {
        this.running--;
        this.run();
      });
  }

  clear(): void {
    this.queue = [];
    this.running = 0;
  }
}
