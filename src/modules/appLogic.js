import {createProject} from "./project.js";
import {createTodoItem} from "./todoItem.js";

const projects =[];
let currentProject = null;

function initialize(){
    // create a default project
    if (projects.length===0){
        const defaultProject = createProject("Default Project");
        projects.push(defaultProject);
        currentProject = defaultProject;
    }
}

function addProject(projectName){
    if (projects.find(project => project.name === projectName)) {
        console.warn(`Project with name "${projectName}" already exists`);
        return null;
    }
    const newProject = createProject(projectName);
    projects.push(newProject);
    return newProject;
}

function getProjects(){
    return projects;
}

function setCurrentProject(projectName){
    const project = projects.find(project => project.name === projectName);
    if (project) {
        currentProject = project;
        return true;
    }
    console.warn(`Project with name ${projectName} not found`);
    return false;
}
function getCurrentProject(){
    if (!currentProject && projects.length >0){
        currentProject = projects[0];
    }
    return currentProject;
}

function addTodoToCurrentProject(title,description,dueDate,priority){
    const project = getCurrentProject();
    if (project){
        const newTodo = createTodoItem(title,description,dueDate,priority);
        project.addTodo(newTodo);
        return newTodo;
    }else {
        console.error("No current project selected");
        return null;
    }
}

initialize();

export {
    addProject,
    getProjects,
    setCurrentProject,
    getCurrentProject,
    addTodoToCurrentProject,
}