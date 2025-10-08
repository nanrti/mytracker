let habits = []; 

const form = document.querySelector('.add-form');
const input = document.getElementById('habitInput');
const table = document.getElementById('habitTable');


form.addEventListener('submit', function(event) {
  event.preventDefault();

  const habitName = input.value.trim();
  if (habitName === "") return;

  const habit = {
    name: habitName,
    days: [false, false, false, false, false, false, false]
  };

  habits.push(habit);
  renderTable();
  input.value = "";
});


function countProgress(habit) {
  let done = habit.days.filter(day => day).length;
  return Math.round((done / habit.days.length) * 100);
}


function renderTable() {
  table.innerHTML = `
    <tr>
      <th>Привычка</th>
      <th>Пн</th>
      <th>Вт</th>
      <th>Ср</th>
      <th>Чт</th>
      <th>Пт</th>
      <th>Сб</th>
      <th>Вс</th>
      <th>Прогресс</th>
    </tr>
  `;

  habits.forEach((habit, i) => {
    const row = document.createElement('tr');

    let cells = `<td class="habit-name">${habit.name}</td>`;
    habit.days.forEach((done, dayIndex) => {
      cells += `<td><input type="checkbox" ${done ? "checked" : ""} 
      onchange="toggleDay(${i}, ${dayIndex})"></td>`;
    });

    cells += `<td class="progress">${countProgress(habit)}%</td>`;

    row.innerHTML = cells;
    table.appendChild(row);
  });
}


function toggleDay(habitIndex, dayIndex) {
  habits[habitIndex].days[dayIndex] = !habits[habitIndex].days[dayIndex];
  renderTable(); 
}

