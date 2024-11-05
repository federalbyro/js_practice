const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {//если код исполняется в основном потоке
  const maxWorkers = os.cpus().length || 4; 

  function mergeSortIterative(arr) {
    return new Promise(async (resolve) => {
      for (let i = 1; i < arr.length; i *= 2) {
        let mergeTasks = [];
        for (let j = 0; j < arr.length - i; j += 2 * i) {
          mergeTasks.push({ arr: arr.slice(), left: j, mid: j + i, right: Math.min(j + 2 * i, arr.length) });//объекты с задачей
        }
        // Ограничиваем количество одновременно выполняемых задач
        await runMergeTasks(mergeTasks, arr);
      }
      resolve(arr);
    });
  }
//Воркер - ..позволяет распределять код для выполнения в отдельнхы ппотоках параллельно с главным (воркер - отедльный поток)
  function runMergeTasks(tasks, arr) {
    return new Promise((resolve) => {
      let taskIndex = 0; //текущий индекс задачи
      let completedTasks = 0; //завершённые задачи
      const workers = [];//массив ворекров
      const numWorkers = Math.min(maxWorkers, tasks.length); //кол-во воркеров одновременно работающих

      function runNextTask(worker) { //функция перехода к задаче
        if (taskIndex >= tasks.length) {
          return;//если все задачи отправлены в воркеры
        }
        const task = tasks[taskIndex++];
        worker.postMessage(task); //отправили таску в воркер -> мерджим и т.д.
        worker.once('message', (e) => { //обрабатывает результат выполнения задачи
          const { left, mergedSegment } = e; //извлекает информацию о левом индексе и отсортированном сегменте массива
          for (let k = 0; k < mergedSegment.length; k++) {
            arr[left + k] = mergedSegment[k];//копируем отсортированный сегмент в общий массив arr
          }
          completedTasks++;
          if (completedTasks === tasks.length) {
            workers.forEach((w) => w.terminate());
            resolve();//заканчиваем при выпоолнении всех задач вызывом resolve() для завершения Promise - это специальный объект, который содержит своё состояние. 
          } else {
            runNextTask(worker);//если не все переходим к некст задачке
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
        runNextTask(worker);// запускает runNextTask для каждого воркера, отправляя ему первую задачу из массива задач.
      }
    });
  }

  let arr = [5, 3, 8, 4, 2, 6, 1, 7]; //пример
  mergeSortIterative(arr).then((sortedArr) => {
    console.log('Отсортированный массив:', sortedArr);
  });

  
} else {
  const { parentPort } = require('worker_threads');  // подключил `parentPort` из `worker_threads` для обмена сообщениями с главным потоком

  parentPort.on('message', (task) => {// прослушивание сообщений от главного потока
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

    const mergedSegment = merge(arr, left, mid, right);//слияние подмассива, используя функцию `merge`
    parentPort.postMessage({ left, mergedSegment });// обратно в главный поток
  });
}




