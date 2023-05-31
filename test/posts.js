import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomPost } from '../helpers/post_helper';
import { createRandomUser } from "../helpers/user_helper";

// Configuration
dotenv.config();

describe.only('/posts route', () => {
    /* Setup */
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    let userId = null;
    let postId = null;
    /* skapar en ny användare */
    before(async () => {
    const res = await request.post('users').set('Authorization', `Bearer ${token}`).send(createRandomUser());
    userId = res.body;
    
    });

    // Börja skriva tester
    it('GET /posts', async () => {
        const res = await request.get('posts')
        console.log(res.body);
        expect(res.body).to.not.be.empty;
    });

    /* Cleanup */
    after(async () => {
        const res = await request
          .delete(`users/${userId}`)
          .set('Authorization', `Bearer ${token}`);
    });
});