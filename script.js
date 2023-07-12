document.addEventListener('DOMContentLoaded', () => {
    const tasksList = loadList();

    buildUL(tasksList);

    document.querySelector('#addTask').onsubmit = () => {

        const task = document.querySelector('#task').value;

        addTask(tasksList, task);

        saveList(tasksList);

        document.querySelector('#task').value = '';
        document.querySelector('#task').focus();

        buildUL(tasksList);

        return false;
    }
})

const buildUL = (list) => {
    const ul = document.querySelector('#ulTasks');

    ul.innerHTML = '';

    list.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = task;

        li.oncontextmenu = (event) => {
            event.preventDefault();
            removeTask(list, index);
            saveList(list);
            buildUL(list);
        }

        li.draggable = true;
        li.ondragstart = (event) => {
            event.dataTransfer.setData('text/plain', index);
        }
        li.ondragover = (event) => {
            event.preventDefault();
        }
        li.ondrop = (event) => {
            const ul = document.querySelector('#ulTasks');
            const li = event.target;

            const index = Array.prototype.indexOf.call(ul.children, li);

            const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'));
            if (index != draggedIndex) {
                changeTaskIndex(list, draggedIndex, index);
                saveList(list);
                buildUL(list);
            }

            event.preventDefault();
        }

        ul.ondragover = (event) => {
            event.preventDefault();
        }

        ul.appendChild(li);
    });
}

const loadList = () => {
    if (getCookie('tasks') != '') {
        return getCookie('tasks').split('&&');
    }
    return [];
}

const addTask = (list, task) => {
    list.push(task);
}

const removeTask = (list, index) => {
    list.splice(index, 1);
}

const changeTaskIndex = (list, index, newIndex) => {
    list.splice(newIndex, 0, list.splice(index, 1)[0]);
}

const saveList = (list) => {
    setCookie('tasks', list.join('&&'));
}

// Cookie functions got on https://www.w3schools.com/js/js_cookies.asp

const setCookie = (cname, cvalue) => {
    document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}
