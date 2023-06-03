import supertest from "supertest"
import { expect } from "chai"
import dotenv from "dotenv"
import { createRandomUser } from "../helpers/user_helper";
import { createRandomTodo } from "../helpers/todos_helper";

// Config.
dotenv.config();

//Setup mocha
describe('/todos route', () => {
    // Setup
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    let userId = null;
    let todoId = null;

    before(async () => {
        const res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(createRandomUser());

            userId = res.body.id;

    });
    // Tests

    it('GET all /todos', async () => {
        const res = await request.get('todos');
        // console.log(res.body);
        expect(res.body).to.not.be.empty;

     });

     it('GET /todos/:id | Negative', async () => {
        const res = await request.get(`todos/${todoId}`);
        expect(res.body.message).to.eq('Resource not found');

       //console.log(res.body);
    });

     it('POST /todos | Create a todo', async () => {
        const data = createRandomTodo(userId);
        const res = await request
            .post('todos')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
    
            todoId = res.body.id;
            expect(res.status).to.eq(201);
        //   console.log(res.body.id); 

     });

     it('PUT /todos | Change title and status of todos', async () => {
        const data = {
            title: "Not in latin",
            status: "pending"
        };
        const res = await request
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data);
    
        expect(res.body.title).to.eq('Not in latin');
        expect(res.body.status).to.eq('pending');
        // console.log(res.body); 
    });

     it('DELETE /todos:id | Delete todo', async () => {
        const res = await request
            .delete(`todos/${todoId}`)
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.status).to.eq(204);    
    });   

    it('DELETE /todos/:id | Negative', async () => {
        const res = await request.delete(`todos/${todoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.body.message).to.equal('Resource not found');
    });

        // Cleanup
        after(async () => {
            const res = await request   
                .delete(`users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
        });

    });

