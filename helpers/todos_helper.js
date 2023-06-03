import { randTodo } from '@ngneat/falso';

export const createRandomTodo = (userId) => {
    const todo = {
        user_id: userId,
        title: randTodo().title,
        due_on: '2023-06-07T00:00:00.000+06:30',
        status: 'pending' 
        
    };

    return todo;
}