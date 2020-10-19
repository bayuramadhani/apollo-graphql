const chai = require('chai');
const expect = chai.expect;
const app = require('../../index')
const request = require('supertest');



let token = ''
let todoList = []
let currentTodo;
function findTodoList(targetTodo) {
    const found = todoList.find(todo => todo.title === targetTodo.title)
    if (found) {
        return true
    }
    return false
}

describe('TODO TEST', () => {
    before(async () => {

    })
    describe('mutation login', async () => {
        it('should return success with data', async () => {

            const query = `mutation {
                login(phoneNumber: "089876554321", password: "321") {
                  user {
                    id
                    firstName
                    lastName
                    phoneNumber
                    status
                  }
                  token
                }
              }
              `
            const response = await request(app).post('/graphql')
                .set('Content-Type', 'application/json')
                .send({ query })

            expect(response.status).to.be.equal(200)
            expect(response).to.be.haveOwnProperty('body')
            expect(response.body).to.be.haveOwnProperty('data')
            expect(response.body.data).to.be.haveOwnProperty('login')
            expect(response.body.data.login).to.be.haveOwnProperty('user')
            expect(response.body.data.login).to.be.haveOwnProperty('token')
            expect(response.body.data.login.user).to.be.haveOwnProperty('id')
            expect(response.body.data.login.user).to.be.haveOwnProperty('firstName')
            expect(response.body.data.login.user).to.be.haveOwnProperty('lastName')
            expect(response.body.data.login.user).to.be.haveOwnProperty('phoneNumber')
            expect(response.body.data.login.user).to.be.haveOwnProperty('status')

            expect(response.body).to.be.a('object')
            expect(response.body.data).to.be.a('object')

            token = response.body.data.login.token


        })
    })

    describe('mutation todoList', async () => {
        it('should return success with list todo', async () => {

            const query = `query{
                todoList{
                  id
                  title
                  isDone
                }
              }
              `
            const response = await request(app).post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send({ query })

            expect(response.status).to.be.equal(200)
            expect(response).to.be.haveOwnProperty('body')
            expect(response.body).to.be.haveOwnProperty('data')
            expect(response.body.data).to.be.haveOwnProperty('todoList')

            expect(response.body).to.be.a('object')
            expect(response.body.data).to.be.a('object')
            expect(response.body.data.todoList).to.be.a('array')

            if (response.body.data.todoList.length > 0) {
                expect(response.body.data.todoList[0]).to.be.haveOwnProperty('id')
                expect(response.body.data.todoList[0]).to.be.haveOwnProperty('title')
                expect(response.body.data.todoList[0]).to.be.haveOwnProperty('isDone')
            }
            todoList = response.body.data.todoList

        })
    })


    describe('mutation todoAdd', async () => {
        it('should return success with data', async () => {

            const newTodo = {
                title: "Masak Mie", isDone: false
            }
            let query = `mutation todoAdd($input:TodoInput!) {
                todoAdd(input:$input) {
                    id
                    title
                    isDone
                }
            }`
            const variables = { input: newTodo }
            const data = JSON.stringify({
                query,
                variables
            });


            let response = await request(app).post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send(data)
            expect(response.status).to.be.equal(200)
            expect(response).to.be.haveOwnProperty('body')
            expect(response.body).to.be.haveOwnProperty('data')
            expect(response.body.data).to.be.haveOwnProperty('todoAdd')
            expect(response.body.data.todoAdd).to.be.haveOwnProperty('id')
            expect(response.body.data.todoAdd).to.be.haveOwnProperty('title')
            expect(response.body.data.todoAdd).to.be.haveOwnProperty('isDone')
            expect(response.body).to.be.a('object')
            expect(response.body.data).to.be.a('object')
            currentTodo = response.body.data.todoAdd


            query = `query{
                todoList{
                  id
                  title
                  isDone
                }
              }
              `
            response = await request(app).post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send({ query })

            expect(response.status).to.be.equal(200)
            expect(response).to.be.haveOwnProperty('body')
            expect(response.body).to.be.haveOwnProperty('data')
            expect(response.body.data).to.be.haveOwnProperty('todoList')
            todoList = response.body.data.todoList

            const found = findTodoList(newTodo)
            expect(found).to.be.equal(true)

        })
    })

    describe('mutation todoUpdate', async () => {
        it('should return success with data', async () => {

            const updateTodo = {
                title: "Masak Ayam", isDone: false
            }
            let query = `mutation todoUpdate($id: ID!, $input: TodoInput!) {
                todoUpdate(id:$id, input:$input) {
                    id
                    title
                    isDone
                }
            }`
            const variables = { id: currentTodo.id, input: updateTodo }
            const data = JSON.stringify({
                query,
                variables
            });


            let response = await request(app).post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send(data)
            expect(response.status).to.be.equal(200)
            expect(response).to.be.haveOwnProperty('body')
            expect(response.body).to.be.haveOwnProperty('data')
            expect(response.body.data).to.be.haveOwnProperty('todoUpdate')
            expect(response.body.data.todoUpdate).to.be.haveOwnProperty('id')
            expect(response.body.data.todoUpdate).to.be.haveOwnProperty('title')
            expect(response.body.data.todoUpdate).to.be.haveOwnProperty('isDone')
            expect(response.body).to.be.a('object')
            expect(response.body.data).to.be.a('object')
            currentTodo = response.body.data.todoUpdate


            query = `query{
                todoList{
                  id
                  title
                  isDone
                }
              }
              `
            response = await request(app).post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send({ query })

            expect(response.status).to.be.equal(200)
            expect(response).to.be.haveOwnProperty('body')
            expect(response.body).to.be.haveOwnProperty('data')
            expect(response.body.data).to.be.haveOwnProperty('todoList')
            todoList = response.body.data.todoList

            const found = findTodoList(updateTodo)
            expect(found).to.be.equal(true)

        })
    })

    describe('mutation todoDelete', async () => {
        it('should return success with data', async () => {
            let query = `mutation todoDelete($id: ID!) {
                todoDelete(id:$id) {
                    id
                    title
                    isDone
                }
            }`
            const variables = { id: currentTodo.id }
            const data = JSON.stringify({
                query,
                variables
            });


            let response = await request(app).post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send(data)
            expect(response.status).to.be.equal(200)
            expect(response).to.be.haveOwnProperty('body')
            expect(response.body).to.be.haveOwnProperty('data')
            expect(response.body.data).to.be.haveOwnProperty('todoDelete')
            expect(response.body.data.todoDelete).to.be.haveOwnProperty('id')
            expect(response.body.data.todoDelete).to.be.haveOwnProperty('title')
            expect(response.body.data.todoDelete).to.be.haveOwnProperty('isDone')
            expect(response.body).to.be.a('object')
            expect(response.body.data).to.be.a('object')

            query = `query{
                todoList{
                  id
                  title
                  isDone
                }
              }
              `
            response = await request(app).post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .send({ query })

            expect(response.status).to.be.equal(200)
            expect(response).to.be.haveOwnProperty('body')
            expect(response.body).to.be.haveOwnProperty('data')
            expect(response.body.data).to.be.haveOwnProperty('todoList')
            todoList = response.body.data.todoList

            const found = findTodoList(currentTodo)
            expect(found).to.be.equal(false)

        })
    })



    after(async () => {

    })
})