const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  const maxWorkers = os.cpus().length || 4; 

  function mergeSortIterative(arr) {
    return new Promise(async (resolve) => {
      for (let i = 1; i < arr.length; i *= 2) {
        let mergeTasks = [];
        for (let j = 0; j < arr.length - i; j += 2 * i) {
          mergeTasks.push({ arr: arr.slice(), left: j, mid: j + i, right: Math.min(j + 2 * i, arr.length) });
        }
        // Ограничиваем количество одновременно выполняемых задач
        await runMergeTasks(mergeTasks, arr);
      }
      resolve(arr);
    });
  }

  function runMergeTasks(tasks, arr) {
    return new Promise((resolve) => {
      let taskIndex = 0;
      let completedTasks = 0;
      const workers = [];
      const numWorkers = Math.min(maxWorkers, tasks.length);

      function runNextTask(worker) {
        if (taskIndex >= tasks.length) {
          return;
        }
        const task = tasks[taskIndex++];
        worker.postMessage(task);
        worker.once('message', (e) => {
          const { left, mergedSegment } = e;
          for (let k = 0; k < mergedSegment.length; k++) {
            arr[left + k] = mergedSegment[k];
          }
          completedTasks++;
          if (completedTasks === tasks.length) {
            workers.forEach((w) => w.terminate());
            resolve();
          } else {
            runNextTask(worker);
          }
        });

        worker.on('error', (e) => {
          console.error(e);
        });
      }
      // Создал воркеров и запускаем задачи
      for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(__filename);
        workers.push(worker);
        runNextTask(worker);
      }
    });
  }

  let arr = [5, 3, 8, 4, 2, 6, 1, 7]; //пример
  mergeSortIterative(arr).then((sortedArr) => {
    console.log('Отсортированный массив:', sortedArr);
  });

  
} else {
  const { parentPort } = require('worker_threads');

  parentPort.on('message', (task) => {
    const { arr, left, mid, right } = task;

    function merge(arr, left, mid, right) {
      let it1 = 0;
      let it2 = 0;
      let result = [];

      while (left + it1 < mid && mid + it2 < right) {
        if (arr[left + it1] < arr[mid + it2]) {
          result.push(arr[left + it1]);
          it1 += 1;
        } else {
          result.push(arr[mid + it2]);
          it2 += 1;
        }
      }
      while (left + it1 < mid) {
        result.push(arr[left + it1]);
        it1 += 1;
      }
      while (mid + it2 < right) {
        result.push(arr[mid + it2]);
        it2 += 1;
      }

      return result;
    }

    const mergedSegment = merge(arr, left, mid, right);
    parentPort.postMessage({ left, mergedSegment });
  });
}




