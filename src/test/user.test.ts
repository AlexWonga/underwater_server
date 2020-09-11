// test/server/user.spec.js

import server from '../index';
import request from 'supertest'
import {UserType} from "../Enum/UserType";

afterEach(() => {
    server.close();
    // 当所有测试都跑完了之后，关闭server
})





test('success to login if typing admin & 123', async () => {
    const response = await request(server)
        .post('/api/supervisorLogin')
        .send({
            username: 'admin',
            password: '123'
        })
    console.log(response)
    expect(response.body.isSuccessful).toEqual(true);
})

test('success to login if typing device01 & 123', async () => {
    const response = await request(server)
        .post('/api/userLogin')
        .send({
            username: 'device01',
            password: '123'
        })
    expect(response.body.isSuccessful).toEqual(true);
})

test('SuccessAddUser',async ()=>{
    const login = await request(server)
        .post('/api/supervisorLogin')
        .send({
            username: 'admin',
            password: '123'
        });
    const response = await request(server)
        .post('/api/addUser')

        .send({
          username:"test01",
            password:'123',
            userType:UserType.DEVICEADMIN,
            telephone:"13944648111",
            email:"494217470@qq.com",
        })
    console.log(login);
    expect(login.body.isSuccessful).toBe(true);
    console.log(response);
    expect(response.body.isSuccessful).toBe(true);
    
})