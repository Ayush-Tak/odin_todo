export function createProject(name){
    const todos=[];
    const addTodo = (todoItem) => {
        todos.push(todoItem);
    };
    
    const removeTodoByIndex = (index) => { // New or alternative way
    if (index >= 0 && index < todos.length) {
        todos.splice(index, 1);
        return true;
    }
    return false;
    };

    const getTodos = () => todos;
    return {
        name,
        addTodo,
        removeTodoByIndex,
        getTodos,
    };
}