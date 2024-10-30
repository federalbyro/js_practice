# Многопоточная сортировка слиянием (MergeSort)

## Описание

Этот проект представляет собой веб-приложение для визуализации многопоточной сортировки слиянием (MergeSort). Оно позволяет пользователям генерировать случайные числа, вводить их вручную и наблюдать процесс сортировки с помощью визуальных подсветок, демонстрируя работу алгоритма на различных этапах.

## Структура Проекта

project-root/
├── index.html
├── mergeSort.js
├── stylesMain.css
├── stylesButton.css
├── stylesText.css
├── script.js
└── README.md

### Файлы

- **index.html**: Главный HTML-файл, содержащий структуру веб-страницы, разделы с теорией, изображениями и интерактивной визуализацией сортировки.

- **mergeSort.js**: Пример многопоточной реализации алгоритма MergeSort на Node.js с использованием потоков (worker threads).

- **stylesMain.css**: Основные стили для структуры сайта, включая оформление разделов, контейнеров и изображений.

- **stylesButton.css**: Стилизация кнопок управления (генерация, запуск и очистка).

- **stylesText.css**: Стили для текстовых блоков, заголовков, абзацев и других текстовых элементов.

- **script.js**: JavaScript-файл, реализующий логику генерации чисел, валидации ввода, запуска сортировки и визуализации алгоритма MergeSort.

## Логика работы `script.js`

JavaScript-код отвечает за интерактивную часть веб-приложения, позволяя пользователям генерировать и вводить числа, а также запускать процесс сортировки с визуализацией. Ниже приведены основные функции и их описание.

### Основные Переменные

- **cells**: Набор всех элементов ввода (`.cell`), представляющих числа для сортировки.
- **generateButton**: Кнопка для генерации случайных чисел.
- **runButton**: Кнопка для запуска процесса сортировки.
- **clearButton**: Кнопка для очистки всех ячеек ввода.
- **actionDisplay**: Элемент для отображения логов и действий во время сортировки.

### Функции

1. **generateRandomNumbers()**

   - Генерирует случайные числа от 0 до 19 и заполняет ими все ячейки ввода.
   - Сбрасывает классы у ячеек для удаления предыдущих подсветок.
   - Очищает область отображения действий.

2. **clearCells()**

   - Очищает все ячейки ввода, устанавливая их значения в пустую строку.
   - Сбрасывает классы ячеек.
   - Очищает область отображения действий.

3. **toggleControls(disabled)**

   - Блокирует или разблокирует элементы интерфейса (ячейки ввода и кнопки) в зависимости от состояния `disabled`.
   - Используется во время сортировки для предотвращения изменений пользователем.

4. **runButton Event Listener**

   - Проверяет, что все ячейки заполнены перед запуском сортировки.
   - Блокирует элементы интерфейса.
   - Считывает значения из ячеек и преобразует их в массив чисел.
   - Запускает функцию `mergeSortVisual` для выполнения сортировки с визуализацией.
   - Разблокирует элементы интерфейса после завершения сортировки.

5. **mergeSortVisual(array)**

   - Очищает предыдущие логи.
   - Отображает начальное сообщение о запуске сортировки с текущим массивом.
   - Запускает рекурсивную функцию `mergeSort` для сортировки массива.
   - После завершения сортировки подсвечивает все ячейки зелёным цветом.
   - Отображает сообщение о завершении сортировки с отсортированным массивом.

6. **mergeSort(arr, left, right, cellElements, depth)**

   - Рекурсивно разделяет массив `arr` на подмассивы до тех пор, пока каждый подмассив не содержит одного элемента.
   - Вычисляет середину текущего подмассива.
   - Отображает сообщение о разделении текущего подмассива с указанием глубины рекурсии (`depth`).
   - Подсвечивает разделяемый подмассива синим цветом.
   - Ожидает 3 секунды для визуализации разделения.
   - Параллельно вызывает `mergeSort` для левой и правой половин массива, увеличивая `depth`.
   - После сортировки подмассивов вызывает функцию `merge` для их объединения.

7. **merge(arr, left, mid, right, cellElements, depth)**

   - Объединяет два отсортированных подмассива `arr[left...mid-1]` и `arr[mid...right-1]` в один отсортированный подмассив.
   - Подсвечивает сравниваемые элементы жёлтым цветом.
   - Отображает сообщение о сравнении элементов с указанием глубины рекурсии.
   - Сравнивает элементы и выбирает меньший для добавления в результирующий массив, подсвечивая выбранный элемент оранжевым цветом.
   - Ожидает 3 секунды для визуализации выбора.
   - Повторяет процесс до тех пор, пока не будут обработаны все элементы.
   - Копирует отсортированные элементы обратно в исходный массив и обновляет соответствующие ячейки с зелёной подсветкой.

8. **highlightCells(indices, className, cellElements)**

   - Подсвечивает несколько ячеек заданным классом.
   - Сначала сбрасывает предыдущие подсветки.
   - Добавляет указанный класс к каждой из переданных ячеек.

9. **highlightRange(start, end, className)**

   - Подсвечивает диапазон ячеек с `start` до `end` индексами заданным классом.
   - Сначала сбрасывает предыдущие подсветки.
   - Добавляет указанный класс ко всем ячейкам в диапазоне.

10. **highlightCell(index, className)**

    - Подсвечивает одну ячейку заданным классом.
    - Сначала сбрасывает предыдущие подсветки.
    - Добавляет указанный класс к выбранной ячейке.

11. **resetCellColors()**

    - Сбрасывает все специальные классы подсветки (`compare`, `merge`, `divide`, `updated`, `sorted`) у всех ячеек.

12. **updateCell(index, value, cellElements)**

    - Обновляет значение ячейки с `index` новым значением `value`.
    - Подсвечивает обновлённую ячейку зелёным цветом (`updated`).

13. **sleep(ms)**

    - Возвращает промис, который разрешается через `ms` миллисекунд.
    - Используется для создания задержек в процессе визуализации.

14. **displayAction(message)**

    - Добавляет сообщение `message` в область отображения действий (`action-display`).
    - Автоматически прокручивает область вниз, чтобы показать последнее сообщение.

15. **clearActions()**
    - Очищает все сообщения в области отображения действий (`action-display`).

## Как запустить проект

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/your-username/merge-sort-visualization.git
   ```

## Дополнительные рекомендации

1. **Проверка связей между файлами:**

   - Убедитесь, что все CSS-файлы правильно подключены в `index.html` и загружаются без ошибок.
   - Проверьте, что `script.js` подключен в конце тела документа (`<body>`) для обеспечения полной загрузки DOM перед выполнением скрипта.

2. **Кроссбраузерная совместимость:**

   - Проверьте работу приложения в различных браузерах (Chrome, Firefox, Edge, Safari) для обеспечения совместимости.

3. **Оптимизация производительности:**

   - Если вы планируете расширять функциональность, рассмотрите возможность разделения функций на модули для лучшей поддержки и читаемости кода.

4. **Добавление README в репозиторий:**

   - Поместите файл `README.md` в корневую директорию вашего репозитория для автоматического отображения на GitHub или других платформах.

5. **Лицензирование и авторские права:**
   - Если проект является открытым исходным кодом, убедитесь, что вы добавили файл `LICENSE` с соответствующей лицензией.

---

Если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, дайте знать! Удачи с вашим проектом по визуализации алгоритма MergeSort! 🚀
