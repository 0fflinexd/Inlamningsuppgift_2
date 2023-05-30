import supertest from "supertest";
import { expect } from "chai";
import dotenv from 'dotenv';
import { createRandomComment } from "../helpers/comments_helper";
import { createRandomUser } from "../helpers/user_helper";
import { createRandomPost } from "../helpers/post_helper";

// Configuration
dotenv.config();

// Requset
const request = supertest('https://gorest.co.in/public/v2/');
const token = process.env.USER_TOKEN;

// Mocha test cases
describe('/comments route | Check for comments', () => {
    let userId = null;
    let postId = null;


    // Create a user
    before(async () => {
        const res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(createRandomUser);

        userId = res.body.data;
        console.log(res.body); 
    });
/*
            after(async () => {
                //this.retries(4);
                const data = createRandomPost(userId);
                const res = await request
                    .post('posts')
                    .set('Authorization', `Bearer ${token}`)
                    .send(data);

            postId = res.body.data;
            console.log(res.body);
            });    
    });
*/

    
/*
      //Gjorde en before på detta istället
    it.only('POST /users | Create user', async () => {
        const data = createRandomUser();
        const res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        userId = res.body.data;
        console.log(res.body);   
    });
*/

    it('POST /posts | Create a post', async () => {
        this.retries(4);
        const data = createRandomPost(userId);
        const res = await request
            .post('posts')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        postId = res.body.data;
        console.log(res.body);
    });


    /* Överflödig kod?
    it('GET /posts', async () => {
        const res = await request.get('posts')
        //console.log(res.body[0])
        postId = res.body[0].id
    });
    */

    it.skip('GET /comments', async () => {
        const res = await request.get('comments');
        //console.log(res.body);
        expect(res.body).to.not.be.empty;
        //console.log(res.status);
    });

    /* Denna fungerar inte på comments, för den finns inga konstanta parameters
    it('GET /comments | Query parameters', async () => {
        const url = `comments?access-token=${token}&`
    });
    */

    it.skip('POST /comments | Create comment', async () => {
        
        const data = createRandomComment(postId);
        data.id = postId;
        //console.log(data);
        const res = await request
            .post('comments')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

            
           // userId = res.body.data.id;
           console.log(res.body)

    });
});