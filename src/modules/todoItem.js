export function createTodoItem(
    title,
    description,
    dueDate,
    priority="normal",
    status="pending"
)

{
    const id = 'task-'+Date.now().toString();
    return {
        id,
        title,
        description,
        dueDate,
        priority,
        status
    }
}