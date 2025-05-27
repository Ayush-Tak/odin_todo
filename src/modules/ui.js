import * as appLogic from "./appLogic.js";

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
            todos.forEach(todo =>{
                const li = document.createElement('li');
                li.textContent= `${todo.title} (Due: ${todo.dueDate}, Priority: ${todo.priority})`
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
}