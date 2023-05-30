import { randFullName, randEmail, randPost } from '@ngneat/falso';

export const  createRandomComment = (userid, postId) => {
    const data = {
        user_id: userid,
        post_id: postId,
        name: randFullName({gender: 'female'}),
        email: randEmail({provider: 'jenseneducation', suffix: 'se'}),
        body: randPost().body
    };

    return data;
}