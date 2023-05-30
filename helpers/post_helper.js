import { randPost } from '@ngneat/falso';

export const createRandomPost = (userId) => {
    const post = {
        user_id: userId,
        title: randPost().title,
        body: randPost().body
    };

    return post;
}