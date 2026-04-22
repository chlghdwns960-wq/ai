let todos = [];
let editingTodoId = null;
let currentFilter = "all";
let currentCategoryFilter = "all";

const STORAGE_KEY = "todo-app-data";

// 오늘 날짜를 서버 날짜처럼 기준점으로 사용하는 값
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayDate = today.getDate();

// 현재 보고 있는 달력 모드: daily / monthly
let currentCalendarView = "daily";

// 현재 보고 있는 날짜
let currentViewDate = new Date(todayYear, todayMonth, todayDate);

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const categorySelect = document.getElementById("categorySelect");
const todoList = document.getElementById("todoList");
const emptyMessage = document.getElementById("emptyMessage");
const submitButton = document.getElementById("submitButton");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const todoCount = document.getElementById("todoCount");
const filterButtons = document.querySelectorAll(".filter-button");
const activeCategoryFilter = document.getElementById("activeCategoryFilter");
const activeCategoryText = document.getElementById("activeCategoryText");
const clearCategoryFilter = document.getElementById("clearCategoryFilter");

// 날짜 보기 관련 요소
const calendarModeButtons = document.querySelectorAll(".calendar-mode-button");
const prevDateButton = document.getElementById("prevDateButton");
const nextDateButton = document.getElementById("nextDateButton");
const currentDateLabel = document.getElementById("currentDateLabel");

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    todos = [];
    return;
  }

  try {
    const parsedData = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      todos = [];
      return;
    }

    todos = parsedData
      .filter(function (item) {
        return (
          typeof item.id === "number" &&
          typeof item.title === "string" &&
          typeof item.category === "string" &&
          typeof item.completed === "boolean"
        );
      })
      .map(function (item) {
        return {
          id: item.id,
          title: item.title,
          category: item.category,
          completed: item.completed,
          createdAt:
            typeof item.createdAt === "string"
              ? item.createdAt
              : new Date(item.id).toISOString(),
        };
      });

    saveTodos();
  } catch (error) {
    todos = [];
  }
}

// YYYY-MM-DD 형태로 바꿔주는 함수
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// createdAt 문자열을 날짜 키로 바꿔주는 함수
function getTodoDateKey(todo) {
  const date = new Date(todo.createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return formatDateKey(date);
}

// 월 키 YYYY-MM
function formatMonthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

// 현재 보고 있는 날짜/월에 맞는 데이터만 먼저 걸러주는 함수
function getTodosByCalendarView() {
  if (currentCalendarView === "daily") {
    const targetDateKey = formatDateKey(currentViewDate);

    return todos.filter(function (todo) {
      return getTodoDateKey(todo) === targetDateKey;
    });
  }

  const targetMonthKey = formatMonthKey(currentViewDate);

  return todos.filter(function (todo) {
    const todoDate = new Date(todo.createdAt);

    if (Number.isNaN(todoDate.getTime())) {
      return false;
    }

    return formatMonthKey(todoDate) === targetMonthKey;
  });
}

function getFilteredTodos() {
  let filteredTodos = getTodosByCalendarView();

  if (currentFilter === "completed") {
    filteredTodos = filteredTodos.filter(function (todo) {
      return todo.completed;
    });
  } else if (currentFilter === "incomplete") {
    filteredTodos = filteredTodos.filter(function (todo) {
      return !todo.completed;
    });
  }

  if (currentCategoryFilter !== "all") {
    filteredTodos = filteredTodos.filter(function (todo) {
      return todo.category === currentCategoryFilter;
    });
  }

  return filteredTodos;
}

function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    emptyMessage.style.display = "block";

    if (currentCalendarView === "daily") {
      if (currentFilter === "completed" && currentCategoryFilter === "all") {
        emptyMessage.textContent = "이 날짜에 완료된 할 일이 없습니다.";
      } else if (
        currentFilter === "incomplete" &&
        currentCategoryFilter === "all"
      ) {
        emptyMessage.textContent = "이 날짜에 미완료된 할 일이 없습니다.";
      } else if (currentCategoryFilter !== "all") {
        emptyMessage.textContent = `이 날짜에 ${currentCategoryFilter} 카테고리의 할 일이 없습니다.`;
      } else {
        emptyMessage.textContent = "이 날짜에 등록된 할 일이 없습니다.";
      }
    } else {
      if (currentFilter === "completed" && currentCategoryFilter === "all") {
        emptyMessage.textContent = "이 달에 완료된 할 일이 없습니다.";
      } else if (
        currentFilter === "incomplete" &&
        currentCategoryFilter === "all"
      ) {
        emptyMessage.textContent = "이 달에 미완료된 할 일이 없습니다.";
      } else if (currentCategoryFilter !== "all") {
        emptyMessage.textContent = `이 달에 ${currentCategoryFilter} 카테고리의 할 일이 없습니다.`;
      } else {
        emptyMessage.textContent = "이 달에 등록된 할 일이 없습니다.";
      }
    }
  } else {
    emptyMessage.style.display = "none";

    filteredTodos.forEach(function (todo) {
      const li = document.createElement("li");
      li.className = todo.completed ? "todo-item completed" : "todo-item";

      li.innerHTML = `
        <input
          type="checkbox"
          class="todo-check"
          ${todo.completed ? "checked" : ""}
          data-id="${todo.id}"
          aria-label="할 일 완료 체크"
        />

        <div class="todo-content">
          <p class="todo-title">${todo.title}</p>

          <div class="todo-meta">
            <button
              type="button"
              class="category-badge ${getCategoryClass(todo.category)} ${
                currentCategoryFilter === todo.category ? "is-active" : ""
              }"
              data-category="${todo.category}"
            >
              ${todo.category}
            </button>
            <span class="todo-date">생성일: ${formatDate(todo.createdAt)}</span>
          </div>
        </div>

        <div class="todo-actions">
          <button type="button" class="edit-button" data-id="${todo.id}">수정</button>
          <button type="button" class="delete-button" data-id="${todo.id}">삭제</button>
        </div>
      `;

      todoList.appendChild(li);
    });

    const checkboxes = document.querySelectorAll(".todo-check");
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        const id = Number(this.dataset.id);
        toggleComplete(id);
      });
    });

    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const id = Number(this.dataset.id);
        startEdit(id);
      });
    });

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const id = Number(this.dataset.id);
        deleteTodo(id);
      });
    });

    const categoryBadges = document.querySelectorAll(".category-badge");
    categoryBadges.forEach(function (badge) {
      badge.addEventListener("click", function () {
        const clickedCategory = this.dataset.category;

        if (currentCategoryFilter === clickedCategory) {
          currentCategoryFilter = "all";
        } else {
          currentCategoryFilter = clickedCategory;
        }

        renderTodos();
      });
    });
  }

  updateProgress();
  updateTodoCount();
  updateFilterButtons();
  updateActiveCategoryFilter();
  updateCalendarModeButtons();
  updateCurrentDateLabel();
}

function updateFilterButtons() {
  filterButtons.forEach(function (button) {
    if (button.dataset.filter === currentFilter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function updateActiveCategoryFilter() {
  if (!activeCategoryFilter || !activeCategoryText || !clearCategoryFilter) {
    return;
  }

  if (currentCategoryFilter === "all") {
    activeCategoryFilter.style.display = "none";
    activeCategoryText.textContent = "";
    return;
  }

  activeCategoryFilter.style.display = "inline-flex";
  activeCategoryText.textContent = `카테고리: ${currentCategoryFilter}`;
}

function updateCalendarModeButtons() {
  calendarModeButtons.forEach(function (button) {
    if (button.dataset.view === currentCalendarView) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function updateCurrentDateLabel() {
  if (!currentDateLabel) {
    return;
  }

  const year = currentViewDate.getFullYear();
  const month = String(currentViewDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentViewDate.getDate()).padStart(2, "0");

  if (currentCalendarView === "daily") {
    currentDateLabel.textContent = `${year}.${month}.${day}`;
  } else {
    currentDateLabel.textContent = `${year}.${month}`;
  }
}

function moveDate(direction) {
  if (currentCalendarView === "daily") {
    currentViewDate.setDate(currentViewDate.getDate() + direction);
  } else {
    currentViewDate.setMonth(currentViewDate.getMonth() + direction);
  }

  renderTodos();
}

function getCategoryClass(category) {
  if (category === "개인") {
    return "category-personal";
  }

  if (category === "업무") {
    return "category-work";
  }

  if (category === "공부") {
    return "category-study";
  }

  return "";
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "날짜 없음";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function addTodo() {
  const title = todoInput.value.trim();
  const category = categorySelect.value;

  if (title === "") {
    alert("할 일을 입력해줘.");
    todoInput.focus();
    return;
  }

  // 입력은 무조건 오늘 날짜 기준으로 저장
  const createdAt = new Date(todayYear, todayMonth, todayDate).toISOString();

  const newTodo = {
    id: Date.now(),
    title: title,
    category: category,
    completed: false,
    createdAt: createdAt,
  };

  todos.push(newTodo);
  saveTodos();
  resetForm();

  // 새로 추가하면 오늘 날짜로 자동 이동해서 바로 보이게
  currentViewDate = new Date(todayYear, todayMonth, todayDate);

  renderTodos();
}

function startEdit(id) {
  const targetTodo = todos.find(function (todo) {
    return todo.id === id;
  });

  if (!targetTodo) {
    return;
  }

  editingTodoId = id;
  todoInput.value = targetTodo.title;
  categorySelect.value = targetTodo.category;
  submitButton.textContent = "수정 완료";
  todoInput.focus();
}

function updateTodo() {
  const title = todoInput.value.trim();
  const category = categorySelect.value;

  if (title === "") {
    alert("할 일을 입력해줘.");
    todoInput.focus();
    return;
  }

  todos = todos.map(function (todo) {
    if (todo.id === editingTodoId) {
      return {
        ...todo,
        title: title,
        category: category,
      };
    }

    return todo;
  });

  saveTodos();
  resetForm();
  renderTodos();
}

function toggleComplete(id) {
  todos = todos.map(function (todo) {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }

    return todo;
  });

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });

  if (editingTodoId === id) {
    resetForm();
  }

  saveTodos();
  renderTodos();
}

function updateProgress() {
  const viewTodos = getTodosByCalendarView();

  if (viewTodos.length === 0) {
    progressText.textContent = "0%";
    progressFill.style.width = "0%";
    return;
  }

  let progressTargetTodos = viewTodos;

  if (currentCategoryFilter !== "all") {
    progressTargetTodos = progressTargetTodos.filter(function (todo) {
      return todo.category === currentCategoryFilter;
    });
  }

  if (progressTargetTodos.length === 0) {
    progressText.textContent = "0%";
    progressFill.style.width = "0%";
    return;
  }

  const completedCount = progressTargetTodos.filter(function (todo) {
    return todo.completed;
  }).length;

  const percent = Math.round(
    (completedCount / progressTargetTodos.length) * 100,
  );

  progressText.textContent = percent + "%";
  progressFill.style.width = percent + "%";
}

function updateTodoCount() {
  if (!todoCount) {
    return;
  }

  const viewTodos = getTodosByCalendarView();
  todoCount.textContent = `총 ${viewTodos.length}개`;
}

function resetForm() {
  todoInput.value = "";
  categorySelect.value = "개인";
  submitButton.textContent = "추가";
  editingTodoId = null;
  todoInput.focus();
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (editingTodoId === null) {
    addTodo();
  } else {
    updateTodo();
  }
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = this.dataset.filter;
    renderTodos();
  });
});

if (clearCategoryFilter) {
  clearCategoryFilter.addEventListener("click", function () {
    currentCategoryFilter = "all";
    renderTodos();
  });
}

calendarModeButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentCalendarView = this.dataset.view;
    renderTodos();
  });
});

if (prevDateButton) {
  prevDateButton.addEventListener("click", function () {
    moveDate(-1);
  });
}

if (nextDateButton) {
  nextDateButton.addEventListener("click", function () {
    moveDate(1);
  });
}

loadTodos();
renderTodos();
