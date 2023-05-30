import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomPost } from '../helpers/post_helper';
import { createRandomUser } from "../helpers/user_helper";

// Configuration
dotenv.config();

describe.only('/posts route', () => {
    /* Setup */
    const request = supertest('https://gorest.co.in/public/v2/posts');
    const token = process.env.USER_TOKEN;
    let userId = null;
    let postId = null;
    /* Creating a fresh user so we have one to work with */
    before(async () => {
    const res = await request.post('users').set('Authorization', `Bearer ${token}`).send(createRandomUser());
    console.log(res.body.data);
    userId = res.body.data.id;
    });

    // Börja skriva tester
    it('GET /posts', async () => {
        const res = await request.get('posts')
        expect(res.body.data).to.not.be.empty;
        console.log(res.body.data);
    });

    /* Cleanup */
    after(async () => {
        const res = await request
          .delete(`users/${userId}`)
          .set('Authorization', `Bearer ${token}`);
    });
});