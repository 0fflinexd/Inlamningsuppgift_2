import supertest from "supertest";
import { expect } from "chai";
import dotenv from 'dotenv';
import { createRandomComment } from "../helpers/comments_helper";
import { createRandomUser } from "../helpers/user_helper";
import { createRandomPost } from "../helpers/post_helper";

// Configuration
dotenv.config();

// Mocha test cases
describe('/comments route | Check for comments', () => {
    /* Setup */
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    let userId = null;
    let postId = null;
    let commentId = null;

    // Create a user and post so there is something to work with
    before(async () => {
        // Create a user
        let res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(createRandomUser());

        userId = res.body.id;

        // Create a post
        const data = createRandomPost(userId);
        res = await request
            .post('posts')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        postId = res.body.id;
    });

    it('GET /comments | Get comments', async () => {
        const res = await request
        .get('comments');

        expect(res.body).to.not.be.empty;
    });

    it('POST /comments | Create comment', async () => { 
        const data = createRandomComment(userId, postId);
        const res = await request
            .post('comments')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
  
        commentId = res.body.id;
        expect(res.body.email).to.contain('jenseneducation');
    });

    it('POST /comments | Create comment (Negative)', async () => {
        const data = {};
        const res = await request
            .post('comments')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        expect(res.status).to.eq(422);
    });

    it('PUT /comments:id | Change comment', async () => {
        const data = {
            name: 'Test Testsson',
            email: 'Test.Testsson@jenseneducation.se',
            body: 'Lets change this comment to something else!'
        };

        const res = await request
            .put(`comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        expect(res.body.name).to.eq(data.name);
        expect(res.body.email).to.eq(data.email);
        expect(res.body.body).to.eq(data.body);
    });
    it('PUT /comments:id | Change comment (Negative)', async () => {
        const data = {
            name:'',
            email: '',
            body: ''
        };
        const res = await request
            .put(`comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        expect(res.status).to.eq(422);
    });

    it('DELETE /comments:id | Delete comment', async () => {
        const res = await request
            .delete(`comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.eq(204);
        expect(res.body).to.be.empty;
    });

    it('DELETE /comments:id | Delete comment (Negative)', async () => {
        const res = await request
            .delete(`comments${commentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
        expect(res.body).to.be.empty;
    });

    /* Cleanup */
    after(async () => {
        const res = await request
            .delete(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
    });
    
});