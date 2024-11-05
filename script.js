document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell'); //наши ячейкам с цифрами
  const generateButton = document.getElementById('generate-button'); //кнопка генерации
  const runButton = document.getElementById('run-button');//кнопка запуска
  const clearButton = document.getElementById('clear-button');//кнопка очистки


  function generateRandomNumbers() {
    cells.forEach(cell => {//прошли по всея ячейкам
      cell.value = Math.floor(Math.random() * 20);//зарандомил значение
      cell.className = 'cell';// сбросил возможные изменения стиля или классов, добавленных ранее.
    });
    clearActions();//сброисл все действия, которы были отображены
  }

  cells.forEach((cell, index) => {
    cell.addEventListener('input', () => {//как только ты вводишь текст
      cell.value = cell.value.replace(/[^0-9]/g, '');//оставляем только цифры
      if (parseInt(cell.value) > 19) {
        cell.value = '19';
      }
      if (cell.value.length === 2 && index < cells.length - 1) {
        cells[index + 1].focus();//перенос на следующую ячейку при заполнении пред. ячейки
      }
    });
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && cell.value === '' && index > 0) {
        cells[index - 1].focus();//если начили чистить, то перешли к прошлой ячейке
      }
    });
  });

  generateButton.addEventListener('click', generateRandomNumbers);//кнопка генерации

  clearButton.addEventListener('click', clearCells);//очистка (работает только после запуска/генерации)

  function clearCells() {
    cells.forEach(cell => {
      cell.value = '';
      cell.className = 'cell';
    });//очистили ячейки
    clearActions();
  }

  runButton.addEventListener('click', async () => {//обработчик жействий ЗАПУСКА
    const emptyCells = Array.from(cells).filter(cell => cell.value === '');
    if (emptyCells.length > 0) {
      alert('Пожалуйста, заполните все ячейки перед запуском сортировки.');
      return;
    }

    toggleControls(true);//Отключение элементов управления на время сортировки

    const values = Array.from(cells).map(cell => parseInt(cell.value, 10));

    await mergeSortVisual(values);//ждём конца сортировки

    toggleControls(false);
  });//кнопка запуска

  function toggleControls(disabled) {//функция отключения
    cells.forEach(cell => {
      cell.disabled = disabled;
    });
    generateButton.disabled = disabled;
    runButton.disabled = disabled;
    clearButton.disabled = disabled;
  }

  async function mergeSortVisual(array) {//функция визуализации
    clearActions();
    displayAction(`<strong>Начинаем сортировку массива:</strong> [${array.join(', ')}]`);
    const cellElements = Array.from(cells); //забросили в массив зн-я ячеек

    await mergeSort(array, 0, array.length, cellElements, 1);//дожидаемся выполнения mergeSort

    cellElements.forEach(cell => {
      cell.classList.add('sorted');
    });
    displayAction(`<strong>Сортировка завершена:</strong> [${array.join(', ')}]`);//выводим под конец
  }

  async function mergeSort(arr, left, right, cellElements, depth) {
    // Базовый случай: если подмассив содержит один или меньше элементов, сортировка не требуется
    if (right - left <= 1) {
      return;
    }
  
    const mid = Math.floor((left + right) / 2); // Находим середину подмассива
    const leftArray = arr.slice(left, mid); // Левый подмассив
    const rightArray = arr.slice(mid, right); // Правый подмассив
  
    // Отображаем разделение массива на подмассивы
    displayAction(`<strong>Поток ${depth}:</strong> Разделение массива [${arr.slice(left, right).join(', ')}] на:<br>
      Левый подмассив: [${leftArray.join(', ')}]<br>
      Правый подмассив: [${rightArray.join(', ')}]`);
  
    highlightRange(left, right - 1, 'divide'); // Выделяем диапазон разделяемого подмассива
    await sleep(3000); // Ждём 3 секунды для визуализации
  
    // Рекурсивно сортируем левую и правую половины массива параллельно
    await Promise.all([
      mergeSort(arr, left, mid, cellElements, depth + 1),
      mergeSort(arr, mid, right, cellElements, depth + 1)
    ]);
  
    // После сортировки половин выполняем слияние
    await merge(arr, left, mid, right, cellElements, depth);
  }
  
  // Функция для слияния двух отсортированных подмассивов
  async function merge(arr, left, mid, right, cellElements, depth) {
    const merged = []; // Массив для хранения результатов слияния
    let i = left; // Индекс для левого подмассива
    let j = mid;  // Индекс для правого подмассива
  
    // Сравниваем элементы из двух подмассивов и объединяем их в отсортированный массив
    while (i < mid && j < right) {
      highlightCells([i, j], 'compare', cellElements); // Выделяем сравниваемые ячейки
      displayAction(`<strong>Поток ${depth}:</strong> Сравнение ${arr[i]} и ${arr[j]}`);
      await sleep(3000); // Ждём 3 секунды для визуализации
  
      if (arr[i] <= arr[j]) {
        merged.push(arr[i]); // Выбираем элемент из левого подмассива
        displayAction(`<strong>Поток ${depth}:</strong> Выбор ${arr[i]} из левого подмассива`);
        highlightCell(i, 'merge'); // Выделяем выбранную ячейку для слияния
        await sleep(3000); // Ждём 3 секунды
        i++; // Переходим к следующему элементу в левом подмасиве
      } else {
        merged.push(arr[j]); // Выбираем элемент из правого подмассива
        displayAction(`<strong>Поток ${depth}:</strong> Выбор ${arr[j]} из правого подмассива`);
        highlightCell(j, 'merge'); // Выделяем выбранную ячейку для слияния
        await sleep(3000); // Ждём 3 секунды
        j++; // Переходим к следующему элементу в правом подмасиве
      }
      resetCellColors(); // Сбрасываем выделение ячеек
    }
  
    // Копируем оставшиеся элементы из левого подмассива, если они есть
    while (i < mid) {
      merged.push(arr[i]);
      displayAction(`<strong>Поток ${depth}:</strong> Копирование ${arr[i]} из левого подмассива`);
      highlightCell(i, 'merge');
      await sleep(3000);
      resetCellColors();
      i++;
    }
  
    // Копируем оставшиеся элементы из правого подмассива, если они есть
    while (j < right) {
      merged.push(arr[j]);
      displayAction(`<strong>Поток ${depth}:</strong> Копирование ${arr[j]} из правого подмассива`);
      highlightCell(j, 'merge');
      await sleep(3000);
      resetCellColors();
      j++;
    }
  
    // Обновляем исходный массив слиянием отсортированных элементов
    for (let k = left; k < right; k++) {
      arr[k] = merged[k - left];
      updateCell(k, arr[k], cellElements); // Обновляем визуальное представление ячейки
      displayAction(`<strong>Поток ${depth}:</strong> Обновление ячейки ${k + 1} значением ${arr[k]}`);
      await sleep(3000);
      resetCellColors();
    }
  }
  
  // Функция для выделения нескольких ячеек определённым классом
  function highlightCells(indices, className, cellElements) {
    resetCellColors(); // Сбрасываем предыдущие выделения
    indices.forEach(index => {
      cellElements[index].classList.add(className); // Добавляем класс к указанным ячейкам
    });
  }
  
  // Функция для выделения диапазона ячеек определённым классом
  function highlightRange(start, end, className) {
    resetCellColors(); // Сбрасываем предыдущие выделения
    for (let i = start; i <= end; i++) {
      cells[i].classList.add(className); // Добавляем класс к ячейкам в диапазоне
    }
  }
  
  // Функция для выделения одной ячейки определённым классом
  function highlightCell(index, className) {
    resetCellColors(); // Сбрасываем предыдущие выделения
    cells[index].classList.add(className); // Добавляем класс к указанной ячейке
  }
  
  // Функция для сброса всех выделений ячеек
  function resetCellColors() {
    cells.forEach(cell => {
      cell.classList.remove('compare', 'merge', 'divide', 'updated', 'sorted'); // Удаляем все возможные классы выделения
    });
  }
  
  // Функция для обновления значения ячейки и добавления класса 'updated'
  function updateCell(index, value, cellElements) {
    cellElements[index].value = value; // Обновляем значение ячейки
    cellElements[index].classList.add('updated'); // Добавляем класс 'updated' для визуального обозначения обновления
  }
  
  // Функция для создания задержки (асинхронное ожидание)
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); // Возвращает промис, который разрешается через заданное время
  }
  
  // Функция для отображения действия в области действий
  function displayAction(message) {
    const actionDisplay = document.getElementById('action-display'); // Находим элемент для отображения действий
    actionDisplay.innerHTML += `${message}<br>`; // Добавляем новое сообщение с переводом строки
    actionDisplay.scrollTop = actionDisplay.scrollHeight; // Прокручиваем область действий вниз, чтобы увидеть последнее сообщение
  }

  function clearActions() {
    const actionDisplay = document.getElementById('action-display');
    actionDisplay.innerHTML = '';
  }
});








