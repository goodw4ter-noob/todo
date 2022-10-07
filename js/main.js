const form = document.querySelector("#form");
const taskInput = form.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
    //парсим строку
    tasks = JSON.parse(localStorage.getItem("tasks"));

    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();


//добавление задачи
form.addEventListener("submit", addTask);

//удаление задачи
tasksList.addEventListener("click", deleteTask);

//отмечаем задачу завершенной
tasksList.addEventListener("click", doneTask);

//используем function declaration, чтобы вызвать функцию до того, как она была объявлена в коде
function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value;

    //описываем задачу в виде объекта
    const newTask = {
        id: Date.now(), //опирается на время добавления задачи, формирует текущее время в милисекундах
        text: taskText,
        done: false,
    };

    tasks.push(newTask);

    renderTask(newTask);

    taskInput.value = "";
    taskInput.focus();

    //скрываем "Список дел пуст", если есть задачи 
    // if (tasksList.children.length > 1) {
    //     emptyList.classList.add("none");
    // }

    checkEmptyList();
    saveToLocalStorage();
}

function deleteTask(e) {
    //если клик был НЕ по кнопке "удалить"
    if (e.target.dataset.action !== "delete") {
        return;
    }

    const parentNode = e.target.closest(".list-group-item");

    //определяем ID задачи
    const id = Number(parentNode.id);

    //находим индекс задачи в массиве
    const index = tasks.findIndex((task) => {
        return task.id == id;
    });

    //удаляем задачу из массива с задачами 
    //tasks.splice(index, 1); //index - тот индекс, с которого нужно начать вырезать элементы из массива, второй элемент - то кол-во элементов, которое мы хотим вырезать

    //способ №2 удаляем задачу через фильтрацию массива
    tasks = tasks.filter((task) => { //filter создает новый массив и передает его в старую переменную tasks; в новый массив добавляются элементы со значением true
        return task.id !== id;
    });

    saveToLocalStorage();

    //удаляем задачу из разметки
    parentNode.remove();

    //скрываем "Список дел пуст", если есть задачи
    // if (tasksList.children.length == 1) {
    //     emptyList.classList.remove("none");
    // };
    
    checkEmptyList();
}

function doneTask(e) {
    //если клик был НЕ по кнопке "задача выполнена" 
    if (e.target.dataset.action !== "done") return;

    const parentNode = e.target.closest(".list-group-item");

    const id = parentNode.id;
    const task = tasks.find((task) => { //в переменную записывается ссылка на найденый объект
        if (task.id == id) return true;
    }); //возвращает не индекс элемента, а сам элемент

    task.done = !task.done;

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");
    
}

function checkEmptyList() {
    if (tasks.length == 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;

    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector("#emptyList");
        emptyListEl ? emptyListEl.remove() : null;
    }

    
}

function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    const taskHTML = `
            <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;
    
    //добавляем новый код HTML в общий список элементов
    tasksList.insertAdjacentHTML("beforeend", taskHTML);
}