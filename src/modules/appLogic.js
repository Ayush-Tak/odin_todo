import { createProject } from "./project.js";
import { createTodoItem } from "./todoItem.js";
import * as storage from "./storage.js";

let projects = [];
let currentProject = null;

function initialize() {
    const loadedProjects = storage.loadProjects();
    if (loadedProjects && loadedProjects.length > 0) {
        projects = loadedProjects;
    } else {
        const defaultProject = createProject("Default Project");
        projects.push(defaultProject);
        storage.saveProjects(projects);
    }

    if (projects.length > 0) {
        currentProject = projects[0];
    } else {
        currentProject = null;
    }
}

function addProject(projectName) {
    if (projects.find(project => project.name === projectName)) {
        return null;
    }
    const newProject = createProject(projectName);
    projects.push(newProject);
    storage.saveProjects(projects);
    return newProject;
}

function getProjects() {
    return projects;
}

function setCurrentProject(projectName) {
    const project = projects.find(p => p.name === projectName);
    if (project) {
        currentProject = project;
        return true;
    }
    return false;
}

function getCurrentProject() {
    if (!currentProject && projects.length > 0) {
        currentProject = projects[0];
    }
    return currentProject;
}

function addTodoToCurrentProject(title, description, dueDate, priority) {
    const project = getCurrentProject();
    if (project) {
        const newTodo = createTodoItem(title, description, dueDate, priority);
        project.addTodo(newTodo);
        storage.saveProjects(projects);
        return newTodo;
    } else {
        return null;
    }
}

function deleteTodoFromCurrentProject(todoIndex) {
    const project = getCurrentProject();
    if (project) {
        const success = project.removeTodoByIndex(parseInt(todoIndex, 10));
        if (success) {
            storage.saveProjects(projects);
        }
        return success;
    }
    return false;
}

function updateTodoInCurrentProject(index, newData) {
    const project = getCurrentProject();
    if (project) {
        const success = project.updateTodoAtIndex(parseInt(index, 10), newData);
        if (success) {
            storage.saveProjects(projects);
        }
        return success;
    }
    return false;
}

function getTodoFromCurrentProject(index) {
    const project = getCurrentProject();
    if (project) {
        const todos = project.getTodos();
        if (index >= 0 && index < todos.length) {
            return todos[index];
        }
    }
    return null;
}

initialize();

export {
    addProject,
    getProjects,
    setCurrentProject,
    getCurrentProject,
    addTodoToCurrentProject,
    deleteTodoFromCurrentProject,
    updateTodoInCurrentProject,
    getTodoFromCurrentProject,
};