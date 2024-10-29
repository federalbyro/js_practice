document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const generateButton = document.getElementById('generate-button');
    const runButton = document.getElementById('run-button');
    const clearButton = document.getElementById('clear-button');
  
    // Функция для генерации случайных цифр
    function generateRandomNumbers() {
      cells.forEach(cell => {
        cell.value = Math.floor(Math.random() * 10);
        cell.style.backgroundColor = '#000000'; // Сбрасываем цвет фона
      });
    }
  
    // Валидация ввода и автоматический переход
    cells.forEach((cell, index) => {
      cell.addEventListener('input', () => {
        // Разрешаем ввод только цифр от 0 до 9
        cell.value = cell.value.replace(/[^0-9]/g, '');
        if (cell.value.length === 1 && index < cells.length - 1) {
          cells[index + 1].focus();
        }
      });
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && cell.value === '' && index > 0) {
          cells[index - 1].focus();
        }
      });
    });
  
    // Обработчик для кнопки "Сгенерировать"
    generateButton.addEventListener('click', generateRandomNumbers);
  
    // Обработчик для кнопки "Очистить"
    clearButton.addEventListener('click', clearCells);
  
    function clearCells() {
      cells.forEach(cell => {
        cell.value = '';
        cell.style.backgroundColor = '#000000'; // Сбрасываем цвет фона
      });
    }
  
    // Обработчик для кнопки "Запустить"
    runButton.addEventListener('click', async () => {
      // Проверяем, что все ячейки заполнены
      const emptyCells = Array.from(cells).filter(cell => cell.value === '');
      if (emptyCells.length > 0) {
        alert('Пожалуйста, заполните все ячейки перед запуском сортировки.');
        return;
      }
  
      // Блокируем элементы интерфейса во время сортировки
      toggleControls(true);
  
      const values = Array.from(cells).map(cell => parseInt(cell.value, 10));
  
      await mergeSortVisual(values);
  
      // Разблокируем элементы интерфейса после сортировки
      toggleControls(false);
    });
  
    // Функция для блокировки/разблокировки элементов интерфейса
    function toggleControls(disabled) {
      cells.forEach(cell => {
        cell.disabled = disabled;
      });
      generateButton.disabled = disabled;
      runButton.disabled = disabled;
      clearButton.disabled = disabled;
    }
  
    // Функция для визуализации сортировки
    async function mergeSortVisual(array) {
      console.log('Начинаем сортировку массива:', array);
      const cellElements = Array.from(cells);
  
      await mergeSort(array, 0, array.length, cellElements);
  
      // После сортировки подсвечиваем все ячейки зеленым цветом
      cellElements.forEach(cell => {
        cell.style.backgroundColor = '#008000';
      });
    }
  
    async function mergeSort(arr, left, right, cellElements) {
      if (right - left <= 1) {
        return;
      }
  
      const mid = Math.floor((left + right) / 2);
  
      // Параллельные вызовы для левой и правой половины
      await Promise.all([
        mergeSort(arr, left, mid, cellElements),
        mergeSort(arr, mid, right, cellElements)
      ]);
  
      await merge(arr, left, mid, right, cellElements);
    }
  
    async function merge(arr, left, mid, right, cellElements) {
      const merged = [];
      let i = left;
      let j = mid;
      while (i < mid && j < right) {
        // Подсвечиваем сравниваемые элементы темно-синим цветом
        highlightCells([i, j], '#00008b', cellElements);
        await sleep(800); // Увеличили задержку для визуализации
        if (arr[i] <= arr[j]) {
          merged.push(arr[i]);
          i++;
        } else {
          merged.push(arr[j]);
          j++;
        }
        resetCellColors(cellElements);
      }
      while (i < mid) {
        merged.push(arr[i]);
        i++;
      }
      while (j < right) {
        merged.push(arr[j]);
        j++;
      }
      // Копируем отсортированные элементы обратно в массив и обновляем ячейки
      for (let k = left; k < right; k++) {
        arr[k] = merged[k - left];
        updateCell(k, arr[k], cellElements);
        await sleep(500); // Увеличили задержку
      }
      // Сбрасываем подсветку после слияния
      resetCellColors(cellElements);
    }
  
    // Вспомогательные функции
    function highlightCells(indices, color, cellElements) {
      indices.forEach(index => {
        cellElements[index].style.backgroundColor = color;
      });
    }
  
    function resetCellColors(cellElements) {
      cellElements.forEach(cell => {
        cell.style.backgroundColor = '#000000';
      });
    }
  
    function updateCell(index, value, cellElements) {
      cellElements[index].value = value;
      cellElements[index].style.backgroundColor = '#ff8c00'; // Тёмно-оранжевый цвет для обновленного элемента
    }
  
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  });
  
  
  
  