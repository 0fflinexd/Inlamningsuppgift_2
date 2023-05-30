import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomPost } from '../helpers/post_helper';
import { createRandomUser } from "../helpers/user_helper";

// Configuration
dotenv.config();

describe('/posts route', () => {
    /* Setup */
    const request = supertest('https://gorest.co.in/public-api/');
    const token = process.env.USER_TOKEN;
    let userId = null;
    let postId = null;

    /* Creating a fresh user so we have one to work with */
    before(async () => {
        const res = await request.post('users').set('Authorization', `Bearer ${token}`).send(createRandomUser());
        userId = res.body.data.id;
    });

    /* Tests */
    it('GET /posts', async () => {
        const res = await request.get('posts')
        expect(res.body.data).to.not.be.empty;
        //userId = res.body.data[0].user_id; // We can't be sure this user works to work with
    });

    it('POST /posts', async function() {
        this.retries(4);
        const data = createRandomPost(userId);
        const res = await request.post('posts')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        expect(res.body.data).to.include(data);
        expect(res.body.data).to.have.property('id');
        expect(res.status).to.eql(200); // Get real status code from v2 api
        // Get back the id of the post we just created to use later
        postId = res.body.data.id;
        
    });

    it('GET /posts/:id', async () => {
        const res = await request.get(`posts/${postId}?access-token=${token}`);
        expect(res.body.data.id).to.eq(postId);
    });

    it('PUT /posts/:id', async () => {
        const data = {
            title: 'This post has changed',
            body: 'This post has a new body'
        };

        const res = await request.put(`posts/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        expect(res.body.data.title).to.eq(data.title);
        expect(res.body.data.body).to.eq(data.body);
    });
    it('DELETE /posts/:id', async () => {
        const res = await request.delete(`posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data).to.eq(null);
    });
    
    /* Cleanup */
    after(async () => {
        const res = await request
          .delete(`users/${userId}`)
          .set('Authorization', `Bearer ${token}`);
    });
});