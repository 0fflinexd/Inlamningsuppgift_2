import supertest from "supertest";
import { expect } from "chai";
import dotenv from 'dotenv';
import { createRandomComment } from "../helpers/comments_helper";
import { createRandomUser } from "../helpers/user_helper";
import { createRandomPost } from "../helpers/post_helper";

// Configuration
dotenv.config();


// Mocha test cases
describe.only('/comments route | Check for comments', () => {
    /* Setup */
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    let userId = null;
    let postId = null;


    // Create a user and post so there is something to work with
    before(async () => {
        // Create a user
        let res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(createRandomUser());

        userId = res.body.id;
        console.log(res.body);

        // Create a post
        const data = createRandomPost(userId);
        res = await request
            .post('posts')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        postId = res.body.id;
        console.log(res.body);
    });

    it('GET /comments', async () => {
        const res = await request.get('comments');
        expect(res.body).to.not.be.empty;
        //console.log(res.body);
    });

    it('POST /comments | Create comment', async () => { 
        const data = createRandomComment(userId, postId);
        //data.id = postId;
        //console.log(data);
        const res = await request
            .post('comments')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

            
        // userId = res.body.id;
        expect(res.body.email).to.contain('jenseneducation');
        console.log(res.body);
    });

    /* Cleanup */
    after(async () => {
        const res = await request
            .delete(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
        //console.log(res.body);
    });
    
});