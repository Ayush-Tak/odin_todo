import * as appLogic from "./appLogic.js";
import '../style.css'

// DOM elements selectors:
const projectsListUL = document.getElementById("projects-list");
const todoListUL = document.getElementById("todo-list");
const currentProjectNameH2 = document.getElementById("current-project-name");
const addProjectBtn = document.getElementById("add-project-btn");
const addTodoBtn = document.getElementById("add-todo-btn");

// Project dialog elements:
const addProjectDialog = document.getElementById('add-project-dialog');
const dialogProjectNameInput = document.getElementById('dialog-project-name-input');
const dialogSubmitProjectBtn = document.getElementById("dialog-submit-project-btn");
const dialogCancelProjectBtn = document.getElementById("dialog-cancel-project-btn");

// Todo dialog elements:
const addTodoDialog = document.getElementById("add-todo-dialog");
const dialogTodoTitleInput=document.getElementById("dialog-todo-title-input");
const dialogTodoDescriptionInput = document.getElementById("dialog-todo-description-input");
const dialogTodoDueDateInput = document.getElementById("dialog-todo-duedate-input");
const dialogTodoPrioritySelect = document.getElementById("dialog-todo-priority-select");
const dialogSubmitTodoBtn = document.getElementById("dialog-submit-todo-btn");
const dialogCancelTodoBtn = document.getElementById("dialog-cancel-todo-btn");

// Edit Todo dialog elements 
const editTodoDialog = document.getElementById('edit-todo-dialog');
const editTodoIndexInput = document.getElementById('edit-todo-index-input'); // Hidden input
const editDialogTodoTitleInput = document.getElementById('edit-dialog-todo-title-input');
const editDialogTodoDescriptionInput = document.getElementById('edit-dialog-todo-description-input');
const editDialogTodoDueDateInput = document.getElementById('edit-dialog-todo-duedate-input');
const editDialogTodoPrioritySelect = document.getElementById('edit-dialog-todo-priority-select');
const dialogSubmitEditTodoBtn = document.getElementById('dialog-submit-edit-todo-btn');
const dialogCancelEditTodoBtn = document.getElementById('dialog-cancel-edit-todo-btn');

export function renderProjects(){
    if (!projectsListUL){
        console.error("Project list UL not found");
        return;
    }
    projectsListUL.innerHTML='';
    const projects = appLogic.getProjects();
    projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent=project.name;
        li.dataset.projectName = project.name;

        if (appLogic.getCurrentProject() && project.name === appLogic.getCurrentProject().name){
            li.classList.add("active-project");
        }

        li.addEventListener('click',()=>{
            appLogic.setCurrentProject(project.name);
            renderAll();
        });
        projectsListUL.appendChild(li);
        
    });
}

export function renderTodos(){
    if(!todoListUL || !currentProjectNameH2){
        console.error("No todo list found");
        return;
    }
    const currentProject = appLogic.getCurrentProject();
    todoListUL.innerHTML='';

    if(currentProject){
        currentProjectNameH2.textContent = currentProject.name;
        const todos = currentProject.getTodos();
        if(todos.length===0){
            const li = document.createElement('li');
            li.textContent="No todos in this project";
            todoListUL.appendChild(li);
        } else {
            todos.forEach((todo,index) =>{
                const li = document.createElement('li');
                li.classList.add('todo-item');
                li.classList.add(`priority-${todo.priority.toLowerCase()}`);

                const todoContent = document.createElement('span');
                todoContent.classList.add('todo-content-display');
                todoContent.textContent = `${todo.title} (Due: ${todo.dueDate})`;
                todoContent.dataset.todoIndex = index; // Store index for editing

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add('delete-todo-btn');
                deleteBtn.dataset.todoIndex = index; // Or use a unique todo ID if you implement one
                deleteBtn.dataset.todoTitle = todo.title; // Alternative for identification

                li.appendChild(todoContent);
                li.appendChild(deleteBtn);
                todoListUL.appendChild(li);
            });
        }
    } else {
        currentProjectNameH2.textContent="No project selected";
    }
}

export function renderAll(){
    renderProjects();
    renderTodos();
}

function handleDialogSubmitProject(){
    if (!dialogProjectNameInput || !addProjectDialog){
        console.error("dialog project name input or project dialog is lost matey!!!")
        return;
    }
    const projectName = dialogProjectNameInput.value.trim();
    if(projectName){
        const newProject = appLogic.addProject(projectName);
        if (newProject){
            appLogic.setCurrentProject(projectName);
            renderAll();
            dialogProjectNameInput.value='';
            addProjectDialog.close();
        }else{
            alert(`Project ${projectName} already exists or could not be created :( `);
        }
    } else {
        alert("Please enter a project name.");
    }
}

// todo handler:
function handleDialogSubmitTodo(){
    const title =       dialogTodoTitleInput.value.trim();
    const description = dialogTodoDescriptionInput.value.trim();
    const dueDate =     dialogTodoDueDateInput.value;
    const priority =    dialogTodoPrioritySelect.value;

    if(title && dueDate){
        const newTodo = appLogic.addTodoToCurrentProject(title,description,dueDate,priority);
        if (newTodo){
            renderTodos();
            dialogTodoTitleInput.value='';
            dialogTodoDescriptionInput.value='';
            dialogTodoDueDateInput.value='';
            dialogTodoPrioritySelect.value='medium';
            addTodoDialog.close();
        }else {
            alert("Could not add todo!!")
        }
    }
}
function openEditTodoDialog(todoIndex) {
    const todo = appLogic.getTodoFromCurrentProject(todoIndex);
    if (todo && editTodoDialog) {
        editTodoIndexInput.value = todoIndex;
        editDialogTodoTitleInput.value = todo.title;
        editDialogTodoDescriptionInput.value = todo.description;
        editDialogTodoDueDateInput.value = todo.dueDate;
        editDialogTodoPrioritySelect.value = todo.priority;
        editTodoDialog.showModal();
    } else {
        console.error("Could not find todo to edit or edit dialog is missing.");
    }
}

function handleDialogSubmitEditTodo() {
    if (!editTodoDialog || !editDialogTodoTitleInput || !editDialogTodoDescriptionInput || !editDialogTodoDueDateInput || !editDialogTodoPrioritySelect || !editTodoIndexInput) {
        console.error("One or more edit todo dialog elements are missing!");
        return;
    }

    const index = editTodoIndexInput.value;
    const title = editDialogTodoTitleInput.value.trim();
    const description = editDialogTodoDescriptionInput.value.trim();
    const dueDate = editDialogTodoDueDateInput.value;
    const priority = editDialogTodoPrioritySelect.value;

    if (title && dueDate && index !== '') {
        const updatedData = { title, description, dueDate, priority };
        const success = appLogic.updateTodoInCurrentProject(index, updatedData);
        
        if (success) {
            renderTodos();
            editTodoDialog.close();
        } else {
            alert("Could not update todo.");
        }
    } else {
        alert("Please fill in all required fields for the todo.");
    }
}



export function initializeUIEventListeners(){
    if (addProjectBtn && addProjectDialog){
        addProjectBtn.addEventListener('click',()=> {
            addProjectDialog.showModal();
        });
    }else{
        console.error("Add project button or project dialog not found");
    }
    if (dialogSubmitProjectBtn){
        dialogSubmitProjectBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            handleDialogSubmitProject();
        })
    } else {console.error("Dialog submit button not found :(")}

    if (dialogCancelProjectBtn && addProjectDialog){
        dialogCancelProjectBtn.addEventListener('click',()=>{
            addProjectDialog.close();
            dialogProjectNameInput.value='';
        })
    }

    if (addProjectDialog){
        addProjectDialog.addEventListener('close',()=>{
            console.log("Dialog closed for new project")
        })
    }

    if(addTodoBtn && addTodoDialog){
        addTodoBtn.addEventListener('click',()=>{
            if (appLogic.getCurrentProject()){
                addTodoDialog.showModal();
            }else{
                alert("please select a project first!")
            }
        });
    }
    if (dialogSubmitTodoBtn){
        dialogSubmitTodoBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            handleDialogSubmitTodo();
        })
    }
    if (dialogCancelTodoBtn){
        dialogCancelTodoBtn.addEventListener('click',()=>{
            dialogTodoTitleInput.value='';
            dialogTodoDescriptionInput.value='';
            dialogTodoDueDateInput.value='';
            dialogTodoPrioritySelect.value='medium';
            addTodoDialog.close();
        })
    }

    if (addTodoDialog){
        addTodoDialog.addEventListener('close',()=>{
            console.log("Todo add dialog closed");
        })
    }
    if (todoListUL) {
        todoListUL.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-todo-btn')) {
                const todoIdentifier = event.target.dataset.todoIndex; // Or .todoTitle
                // console.log('Attempting to delete todo with identifier:', todoIdentifier);
                
                // Optional: Add a confirmation dialog
                // if (confirm('Are you sure you want to delete this todo?')) {
                    const success = appLogic.deleteTodoFromCurrentProject(todoIdentifier);
                    if (success) {
                        renderTodos(); // Re-render the todos list
                    } else {
                        alert('Could not delete todo.');
                    }
                // }
            }
                else if (event.target.classList.contains('todo-content-display')) {
                const todoIndex = event.target.dataset.todoIndex;
                if (todoIndex !== undefined) {
                    openEditTodoDialog(todoIndex);
                }
            }
        });
    } 
    else {
        console.error("Todo list UL not found for delete listener!");
    }
    if (dialogSubmitEditTodoBtn && editTodoDialog) {
        dialogSubmitEditTodoBtn.addEventListener('click', (event) => {
            // event.preventDefault(); // Good practice, though form method="dialog" might handle it
            handleDialogSubmitEditTodo();
        });
    } else {
        console.error("Submit edit todo button or dialog not found!");
    }

    if (dialogCancelEditTodoBtn && editTodoDialog) {
        dialogCancelEditTodoBtn.addEventListener('click', () => {
            editTodoDialog.close();
        });
    }
    if (editTodoDialog) {
        editTodoDialog.addEventListener('close', () => {
            console.log("Edit todo dialog closed.");
            // Optionally clear fields if needed, though they are repopulated on open
        });
    }

}