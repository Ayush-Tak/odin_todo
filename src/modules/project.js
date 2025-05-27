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

    const updateTodoAtIndex = (index, updatedTodoData) => {
        if (index >= 0 && index < todos.length) {
            todos[index] = { ...todos[index], ...updatedTodoData }; // Spread to merge
            return true;
        }
        return false;
    };
    return {
        name,
        addTodo,
        removeTodoByIndex,
        getTodos,
        updateTodoAtIndex,
    };
}