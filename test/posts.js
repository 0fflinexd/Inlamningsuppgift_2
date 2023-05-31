import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomPost } from '../helpers/post_helper';
import { createRandomUser } from "../helpers/user_helper";

// Configuration
dotenv.config();

describe('/posts route', () => {
    /* Setup */
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    let userId = null;
    let postId = null;
    /* skapar en ny användare */
    before(async () => {
        const res = await request.post('users').set('Authorization', `Bearer ${token}`).send(createRandomUser());
        userId = res.body.id;
        //console.log(userId); //Kontrolera att det finns en ny användare
    
    });

    // Börja skriva tester
    it('GET /posts', async () => {
        const res = await request.get('posts')
        //console.log(res.body); //Kontrolera att det finns posts
        expect(res.body).to.not.be.empty;
    });

    it('POST /posts', async function() {
        //this.retries(5);
        const data = createRandomPost(userId);
        const res = await request.post('posts')
            .set('Authorization',`Bearer ${token}`) 
            .send(data);
            //console.log(data); //Ville se vad som skapades i "data"

            //console.log('data:', data);
            //console.log('res.body:', res.body);
            //console.log('res.body.data:', res.body.data);

            //console.log(res.status); //Hitta status koden
            expect(res.body).to.include(data);
            expect(res.body).to.have.property('id');
            expect(res.status).to.eql(201);

            postId = res.body.id;
            console.log(res.body);

    });

    

    /* Cleanup */
    after(async () => {
        const res = await request
          .delete(`users/${userId}`)
          .set('Authorization', `Bearer ${token}`);
    });
});