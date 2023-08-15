import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomPost } from '../helpers/post_helper';
import { createRandomUser } from "../helpers/user_helper";
import { negativeRandomPost } from "../helpers/negativepost_helper";

// Configuration
dotenv.config();

describe('/posts route', () => {
    /* Setup */
    const request = supertest(process.env.SUPERTEST_BASE_URL);
    const token = process.env.SUPERTEST_USER_TOKEN;
    const debug = process.env.SUPERTEST_DEBUG == 1 ? true : false;
    let userId = null;
    let postId = null;
    /* skapar en ny användare */
    before(async () => {
        const res = await request.post('users').set('Authorization', `Bearer ${token}`).send(createRandomUser());
        userId = res.body.id;
    
    });

    // Börja skriva tester
    it('GET /posts', async () => {
        const res = await request.get('posts')
        expect(res.body).to.not.be.empty;
    });

    it('POST /posts', async function() {
        const data = createRandomPost(userId);
        const res = await request.post('posts')
            .set('Authorization',`Bearer ${token}`) 
            .send(data);
            expect(res.body).to.include(data);
            expect(res.body).to.have.property('id');
            expect(res.status).to.eql(201);

            postId = res.body.id;

    });

    it('PUT /posts/:id', async () => {
        const data = {
            title: 'New title change',
            body: 'New body change'
        };

        const res = await request.put(`posts/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        expect(res.body.title).to.eq(data.title);
        expect(res.body.body).to.eq(data.body);

    });

    it('DELETE /posts/:id', async () => {
        const res = await request.delete(`posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.body).to.be.empty;
    });


    it('PUT /posts/:id | Negative ', async () => {
        const data = {
            title: '',
            body: ''
        };

        const res = await request.put(`posts/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        expect(res.status).to.eql(404);

    });

    it('POST /posts | Negative', async () => {
        const data = negativeRandomPost(userId);
        const res = await request.post('posts')
            .set('Authorization',`Bearer ${token}`) 
            .send(data);
            //expect(res.body).to.include(data);
            //expect(res.body).to.have.property('id');
            expect(res.status).to.eql(422);

            postId = res.body.id;

    });
    
    /* Cleanup */
    after(async () => {
        const res = await request
          .delete(`users/${userId}`)
          .set('Authorization', `Bearer ${token}`);
    });
});