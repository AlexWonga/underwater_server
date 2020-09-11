// test/server/user.spec.js

import server from '../index';
import request from 'supertest'

afterEach(() => {
    server.close() // 当所有测试都跑完了之后，关闭server
})




test('success to login if typing admin & 123', async () => {
    const response = await request(server)
        .post('/api/supervisorLogin')
        .send({
            username: 'admin',
            password: '123'
        })
    expect(response.body.isSuccessful).toBe(true);
})

test('success to login if typing device01 & 123', async () => {
    const response = await request(server)
        .post('/api/userLogin')
        .send({
            username: 'device01',
            password: '123'
        })
    expect(response.body.isSuccessful).toBe(true);
})

// test('SuccessAddUser',async ()=>{
//     const response = await request(server)
//         .post('/api/addUser')
//         .send({
//
//         })
// })