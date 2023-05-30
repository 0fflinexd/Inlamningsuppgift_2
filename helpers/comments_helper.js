import { randFullName, randEmail, randPost } from '@ngneat/falso';

export const  createRandomComment = () => {
    const data = {
        name: randFullName({gender: 'female'}),
        email: randEmail({provider: 'jenseneducation', suffix: 'se'}),
        body: randPost().body
    };

    return data;
}