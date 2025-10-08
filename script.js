function DynamicArray() {
  this.capacity = 2;
  this.size = 0;
  this.data = new Array(this.capacity);
}
DynamicArray.prototype.push = function(item) {
  if (this.size === this.capacity) this._resize(this.capacity * 2);
  this.data[this.size] = item;
  this.size++;
};
DynamicArray.prototype.get = function(i) { return this.data[i]; };
DynamicArray.prototype.removeAt = function(i) {
  for (var j = i; j < this.size - 1; j++) this.data[j] = this.data[j+1];
  this.size--;
  if (this.size < this.capacity / 4 && this.capacity > 2) this._resize(Math.floor(this.capacity / 2));
};
DynamicArray.prototype.toArray = function() {
  var arr = [];
  for (var i = 0; i < this.size; i++) arr.push(this.data[i]);
  return arr;
};
DynamicArray.prototype._resize = function(newCap) {
  var newArr = new Array(newCap);
  for (var i = 0; i < this.size; i++) newArr[i] = this.data[i];
  this.data = newArr;
  this.capacity = newCap;
};

function ListNode(value) {
  this.value = value;
  this.next = null;
}
function LinkedList() {
  this.head = null;
}
LinkedList.prototype.add = function(value) {
  var node = new ListNode(value);
  if (!this.head) this.head = node;
  else {
    var cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }
};
LinkedList.prototype.removeAt = function(index) {
  var cur = this.head, prev = null, i = 0;
  while (cur && i < index) { prev = cur; cur = cur.next; i++; }
  if (!cur) return;
  if (!prev) this.head = cur.next;
  else prev.next = cur.next;
};
LinkedList.prototype.toArray = function() {
  var arr = [], cur = this.head;
  while (cur) { arr.push(cur.value); cur = cur.next; }
  return arr;
};

function BinaryHeap() {
  this.items = [];
}
BinaryHeap.prototype.insert = function(key, value) {
  this.items.push({key, value});
  this._siftUp(this.items.length - 1);
};
BinaryHeap.prototype.extractMax = function() {
  if (this.items.length === 0) return null;
  var max = this.items[0];
  var end = this.items.pop();
  if (this.items.length > 0) {
    this.items[0] = end;
    this._siftDown(0);
  }
  return max;
};
BinaryHeap.prototype._siftUp = function(i) {
  while (i > 0) {
    var p = Math.floor((i - 1) / 2);
    if (this.items[i].key > this.items[p].key) {
      var tmp = this.items[i];
      this.items[i] = this.items[p];
      this.items[p] = tmp;
      i = p;
    } else break;
  }
};
BinaryHeap.prototype._siftDown = function(i) {
  var len = this.items.length;
  while (true) {
    var l = 2 * i + 1, r = 2 * i + 2, largest = i;
    if (l < len && this.items[l].key > this.items[largest].key) largest = l;
    if (r < len && this.items[r].key > this.items[largest].key) largest = r;
    if (largest === i) break;
    var tmp = this.items[i];
    this.items[i] = this.items[largest];
    this.items[largest] = tmp;
    i = largest;
  }
};
var habits = new DynamicArray();
var tableBody = document.querySelector("#habitTable tbody");
var notesPanel = document.getElementById("notesPanel");
var notesList = document.getElementById("notesList");
var notesHabitName = document.getElementById("notesHabitName");
var currentNotesHabit = null;

document.getElementById("addForm").addEventListener("submit", function(e) {
  e.preventDefault();
  var name = document.getElementById("habitInput").value.trim();
  if (!name) return;
  var cat = document.getElementById("categoryCustom").value.trim() || document.getElementById("categorySelect").value;
  var habit = {
    name: name,
    category: cat,
    days: [false, false, false, false, false, false, false],
    notes: new LinkedList()
  };
  habits.push(habit);
  render();
  e.target.reset();
});

function render() {
  tableBody.innerHTML = "";
  var arr = habits.toArray();
  arr.forEach(function(h, i) {
    var tr = document.createElement("tr");
    var daysCells = "";
    for (var d = 0; d < 7; d++) {
      daysCells += `<td><input type="checkbox" ${h.days[d] ? "checked" : ""} onchange="toggleDay(${i},${d})"></td>`;
    }
    var prog = countProgress(h);
    tr.innerHTML = `
      <td class="habit-name">${h.name}</td>
      <td>${h.category}</td>
      ${daysCells}
      <td>${prog}%</td>
      <td><button class="btn-small" onclick="openNotes(${i})">Заметки</button></td>
      <td><button class="btn-small" onclick="deleteHabit(${i})">❌</button></td>`;
    tableBody.appendChild(tr);
  });
  saveData();
}

function toggleDay(hIndex, dIndex) {
  var h = habits.get(hIndex);
  h.days[dIndex] = !h.days[dIndex];
  render();
}

function countProgress(h) {
  var done = 0;
  for (var i = 0; i < 7; i++) if (h.days[i]) done++;
  return Math.round((done / 7) * 100);
}

function deleteHabit(i) {
  habits.removeAt(i);
  render();
}

function openNotes(i) {
  currentNotesHabit = i;
  var h = habits.get(i);
  notesHabitName.textContent = h.name;
  renderNotes();
  notesPanel.style.display = "block";
}

function renderNotes() {
  var h = habits.get(currentNotesHabit);
  notesList.innerHTML = "";
  var arr = h.notes.toArray();
  arr.forEach(function(note, i) {
    var div = document.createElement("div");
    div.className = "note-item";
    div.innerHTML = `<span>${note}</span><button class="btn-small" onclick="removeNote(${i})">Удалить</button>`;
    notesList.appendChild(div);
  });
}

document.getElementById("addNoteForm").addEventListener("submit", function(e) {
  e.preventDefault();
  var text = document.getElementById("noteInput").value.trim();
  if (!text) return;
  var h = habits.get(currentNotesHabit);
  h.notes.add(text);
  renderNotes();
  e.target.reset();
  saveData();
});
document.getElementById("closeNotes").addEventListener("click", function() {
  notesPanel.style.display = "none";
  currentNotesHabit = null;
});

function removeNote(i) {
  var h = habits.get(currentNotesHabit);
  h.notes.removeAt(i);
  renderNotes();
  saveData();
}

document.getElementById("btnTop").addEventListener("click", function() {
  var heap = new BinaryHeap();
  var arr = habits.toArray();
  for (var i = 0; i < arr.length; i++) heap.insert(countProgress(arr[i]), arr[i]);
  var msg = "Топ-3 привычек по прогрессу:\n";
  for (var j = 0; j < 3; j++) {
    var top = heap.extractMax();
    if (!top) break;
    msg += (j+1) + ". " + top.value.name + " — " + top.key + "%\n";
  }
  alert(msg);
});

function saveData() {
  var arr = habits.toArray().map(function(h) {
    return {
      name: h.name,
      category: h.category,
      days: h.days,
      notes: h.notes.toArray()
    };
  });
  localStorage.setItem("habits", JSON.stringify(arr));
}
function loadData() {
  var data = localStorage.getItem("habits");
  if (!data) return;
  var arr = JSON.parse(data);
  for (var i = 0; i < arr.length; i++) {
    var h = arr[i];
    var habit = {
      name: h.name,
      category: h.category,
      days: h.days,
      notes: new LinkedList()
    };
    for (var j = 0; j < h.notes.length; j++) habit.notes.add(h.notes[j]);
    habits.push(habit);
  }
}
loadData();
render();

