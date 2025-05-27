import { createProject } from './project.js'; // Needed for rehydration
import { createTodoItem } from './todoItem.js'; // Needed for rehydration

const STORAGE_KEY = 'todoAppData';

export function saveProjects(projectsToSave) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsToSave.map(project => {
            // Ensure we are saving plain data representations
            return {
                name: project.name,
                // If projects have IDs or other serializable properties, include them
                todos: project.getTodos().map(todo => ({ ...todo })) // Save copies of todos
            };
        })));
        console.log('Projects saved to localStorage via storage module');
    } catch (e) {
        console.error('Failed to save projects to localStorage via storage module:', e);
    }
}

export function loadProjects() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const plainProjects = JSON.parse(storedData);
            // Rehydrate the projects
            const rehydratedProjects = plainProjects.map(plainProject => {
                const newProject = createProject(plainProject.name);
                plainProject.todos.forEach(plainTodo => {
                    const rehydratedTodo = createTodoItem(
                        plainTodo.title,
                        plainTodo.description,
                        plainTodo.dueDate,
                        plainTodo.priority
                        // plainTodo.completed, // if you have this property
                        // plainTodo.notes // if you have this property
                    );
                    newProject.addTodo(rehydratedTodo);
                });
                return newProject;
            });
            console.log('Projects loaded from localStorage via storage module');
            return rehydratedProjects;
        }
    } catch (e) {
        console.error('Failed to load or parse projects from localStorage via storage module:', e);
    }
    return null; // Return null if nothing is loaded or an error occurs
}