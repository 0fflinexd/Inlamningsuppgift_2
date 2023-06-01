import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
//import { createRandomUser } from '../helpers/user_helpertim';

dotenv.config();


const request = supertest('https://gorest.co.in/v2')
const token = process.env.USER_TOKEN;

describe('/users route', () => {
        let userId = null;

        it('GET /users', async () => {

            const res = await request.get('users');
            expect(res.body.data).to.not.be.empty;
        });

        it('GET /users |  Query paramaters - get active males', async () => {

            const url = `users?access-token=${token}&gender=male&status=inactive`;
            const res = await request.get(url);

            res.body.data.forEach((user) => {

                expect(user.gender).to.eq('male');
                expect(user.status).to.eq('inactive');
            });
        });

});