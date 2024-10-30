document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const generateButton = document.getElementById('generate-button');
  const runButton = document.getElementById('run-button');
  const clearButton = document.getElementById('clear-button');


  function generateRandomNumbers() {
    cells.forEach(cell => {
      cell.value = Math.floor(Math.random() * 20);
      cell.className = 'cell';
    });
    clearActions();
  }

  cells.forEach((cell, index) => {
    cell.addEventListener('input', () => {
      cell.value = cell.value.replace(/[^0-9]/g, '');
      if (parseInt(cell.value) > 19) {
        cell.value = '19';
      }
      if (cell.value.length === 2 && index < cells.length - 1) {
        cells[index + 1].focus();//перенос на следующую ячейку при заполнении пред. ячейки
      }
    });
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && cell.value === '' && index > 0) {
        cells[index - 1].focus();
      }
    });
  });

  generateButton.addEventListener('click', generateRandomNumbers);//кнопка генерации

  clearButton.addEventListener('click', clearCells);//очистка (работает только после запуска/генерации)

  function clearCells() {
    cells.forEach(cell => {
      cell.value = '';
      cell.className = 'cell';
    });
    clearActions();
  }

  runButton.addEventListener('click', async () => {
    const emptyCells = Array.from(cells).filter(cell => cell.value === '');
    if (emptyCells.length > 0) {
      alert('Пожалуйста, заполните все ячейки перед запуском сортировки.');
      return;
    }

    toggleControls(true);

    const values = Array.from(cells).map(cell => parseInt(cell.value, 10));

    await mergeSortVisual(values);

    toggleControls(false);
  });//кнопка запуска

  function toggleControls(disabled) {
    cells.forEach(cell => {
      cell.disabled = disabled;
    });
    generateButton.disabled = disabled;
    runButton.disabled = disabled;
    clearButton.disabled = disabled;
  }

  async function mergeSortVisual(array) {
    clearActions();
    displayAction(`<strong>Начинаем сортировку массива:</strong> [${array.join(', ')}]`);
    const cellElements = Array.from(cells);

    await mergeSort(array, 0, array.length, cellElements, 1);

    cellElements.forEach(cell => {
      cell.classList.add('sorted');
    });
    displayAction(`<strong>Сортировка завершена:</strong> [${array.join(', ')}]`);
  }

  async function mergeSort(arr, left, right, cellElements, depth) {
    if (right - left <= 1) {
      return;
    }

    const mid = Math.floor((left + right) / 2);
    const leftArray = arr.slice(left, mid);
    const rightArray = arr.slice(mid, right);
    displayAction(`<strong>Поток ${depth}:</strong> Разделение массива [${arr.slice(left, right).join(', ')}] на:<br>
      Левый подмассив: [${leftArray.join(', ')}]<br>
      Правый подмассив: [${rightArray.join(', ')}]`);

    highlightRange(left, right - 1, 'divide');
    await sleep(3000);

    await Promise.all([
      mergeSort(arr, left, mid, cellElements, depth + 1),
      mergeSort(arr, mid, right, cellElements, depth + 1)
    ]); //Вот тут как раз использую то, о чем говорил в 4-м разделе, они сортируются

    await merge(arr, left, mid, right, cellElements, depth); //сливаем
  }

  async function merge(arr, left, mid, right, cellElements, depth) {
    const merged = [];
    let i = left;
    let j = mid;

    while (i < mid && j < right) {
      highlightCells([i, j], 'compare', cellElements);
      displayAction(`<strong>Поток ${depth}:</strong> Сравнение ${arr[i]} и ${arr[j]}`);
      await sleep(3000);

      if (arr[i] <= arr[j]) {
        merged.push(arr[i]);
        displayAction(`<strong>Поток ${depth}:</strong> Выбор ${arr[i]} из левого подмассива`);
        highlightCell(i, 'merge');
        await sleep(3000);
        i++;
      } else {
        merged.push(arr[j]);
        displayAction(`<strong>Поток ${depth}:</strong> Выбор ${arr[j]} из правого подмассива`);
        highlightCell(j, 'merge');
        await sleep(3000);
        j++;
      }
      resetCellColors();
    }

    while (i < mid) {
      merged.push(arr[i]);
      displayAction(`<strong>Поток ${depth}:</strong> Копирование ${arr[i]} из левого подмассива`);
      highlightCell(i, 'merge');
      await sleep(3000);
      resetCellColors();
      i++;
    }

    while (j < right) {
      merged.push(arr[j]);
      displayAction(`<strong>Поток ${depth}:</strong> Копирование ${arr[j]} из правого подмассива`);
      highlightCell(j, 'merge');
      await sleep(3000);
      resetCellColors();
      j++;
    }

    for (let k = left; k < right; k++) {
      arr[k] = merged[k - left];
      updateCell(k, arr[k], cellElements);
      displayAction(`<strong>Поток ${depth}:</strong> Обновление ячейки ${k+1} значением ${arr[k]}`);
      await sleep(3000);
      resetCellColors();
    }
  }

  function highlightCells(indices, className, cellElements) {
    resetCellColors();
    indices.forEach(index => {
      cellElements[index].classList.add(className);
    });
  }

  function highlightRange(start, end, className) {
    resetCellColors();
    for (let i = start; i <= end; i++) {
      cells[i].classList.add(className);
    }
  }

  function highlightCell(index, className) {
    resetCellColors();
    cells[index].classList.add(className);
  }

  function resetCellColors() {
    cells.forEach(cell => {
      cell.classList.remove('compare', 'merge', 'divide', 'updated', 'sorted');
    });
  }

  function updateCell(index, value, cellElements) {
    cellElements[index].value = value;
    cellElements[index].classList.add('updated');
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function displayAction(message) {
    const actionDisplay = document.getElementById('action-display');
    actionDisplay.innerHTML += `${message}<br>`;
    actionDisplay.scrollTop = actionDisplay.scrollHeight;
  }

  function clearActions() {
    const actionDisplay = document.getElementById('action-display');
    actionDisplay.innerHTML = '';
  }
});








