import supertest from 'supertest';
import {expect} from 'chai';
import dotenv from 'dotenv';
import {createRandomUser} from '../helpers/user_helper';


// Configuration
dotenv.config();

//Mocha test case
describe.only('/users route', () => {
 
// Request
const request = supertest('https://gorest.co.in/public/v2/');
const token = process.env.USER_TOKEN;

let userID = null; 

it ('GET/users', async () => {
    const res = await request.get('users');
    console.log(res.body);
    expect(res.body).to.not.be.empty;

});
it ('GET /users, query parameters - get inactive users', async () => {
    const url = 'users?gender=female&status=inactive';
    const res = await request.get(url);
    console.log(res.body)

res.body.forEach((user) => {
    expect(user.gender).to.eq('female');
    expect(user.status).to.eq('inactive');
});

});
});
