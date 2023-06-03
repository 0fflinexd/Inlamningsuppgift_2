import supertest from 'supertest';
import {expect} from 'chai';
import dotenv from 'dotenv';
import {createRandomUser} from '../helpers/user_helper';


// Configuration
dotenv.config();

//Mocha test case
describe('/users route', () => {
 
// Request
const request = supertest('https://gorest.co.in/public/v2/');
const token = process.env.USER_TOKEN;

let userId = null; 

it ('GET/users', async () => {
    const res = await request.get('users');
    console.log(res.body);
    expect(res.body).to.not.be.empty;

});
it ('GET /users, query parameters - get inactive users', async () => {
    const url = 'users?gender=female&status=inactive';
    const res = await request.get(url);
    console.log(res.body);

res.body.forEach((user) => {
    expect(user.gender).to.eq('female');
    expect(user.status).to.eq('inactive');
});
it('POST/ users | Create a new user', async () => {
    const data=createRandomUser();

    const res = await request
    .post('users')
    .set('Authorization', `Bearer ${token}`)
    .send(data);

    console.log(res.body);
    expect(res.body).to.include(data);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('gender');
    expect(res.status).to.equal(201);

    userId = res.body.id;
});
it('PUT /users/:id | Update the user', async () => {
    const data = {
        name:'Test user updated',
    };
    const res = await request
    .put(`/users/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(data);

    expect(res.body.data.name).to.equal(data.name);
    expect(res.body.data).to.include(data);

   // console.log(res.body); 
});
it('DELETE /users/:id | User we just created', async () => {
    const res = await request
    .delete(`users/${userId}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res.body).to.be.null;
});
console.log();

});
}); 