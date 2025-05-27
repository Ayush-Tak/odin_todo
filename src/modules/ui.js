import * as appLogic from "./appLogic.js";

// DOM elements selectors:
const projectsListUL = document.getElementById("projects-list");
const todoListUL = document.getElementById("todo-list");
const currentProjectNameH2 = document.getElementById("current-project-name");
const addProjectBtn = document.getElementById("add-project-btn");
const addTodoBtn = document.getElementById("add-todo-btn");

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