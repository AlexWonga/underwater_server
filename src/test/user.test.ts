// test/server/user.spec.js

import server from '../index';
import request from 'supertest'
// import {UserType} from "../Enum/UserType";
import {getSupervisorCookie} from "./getCookie";






afterAll(() => {
    server.close();
})

describe("Userlogin",async ()=> {
    test('success to login if typing admin & 123', async () => {
        const response = await request(server)
            .post('/api/supervisorLogin')
            .send({
                username: 'admin',
                password: '123'
            });
        console.log(response.header['set-cookie']);
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
})
//
// test('SuccessAddUser',async ()=>{
//     const res = await request(server)
//         .post('/api/supervisorLogin')
//         .send({
//             username: 'admin',
//             password: '123'
//         });
//     cookie = getCookie(res);
//     const response = await request(server)
//         .post('/api/addUser')
//         .set("Cookie",cookie)
//         .send({
//           username:"test01",
//             password:'123',
//             userType:UserType.DEVICEADMIN,
//             telephone:"13944648111",
//             email:"494217470@qq.com",
//         })
//     expect(response.body.isSuccessful).toBe(true);
// });


test('SuccessSearchUser', async () => {
    let cookie = await getSupervisorCookie();
    const response = await request(server)
        .get('/api/searchUserInfo')
        .set("Cookie", cookie)
        .query
        ({keyword: "test"});

    expect(response.body.isSuccessful).toBe(true);
});


test('SuccessQueryUserInfo', async () => {
    let cookie = await getSupervisorCookie();
    const response = await request(server)
        .get('/api/queryUserInfo')
        .set("Cookie", cookie)
        .query
        ({id: "6"});

    expect(response.body.isSuccessful).toBe(true);
});

test('SuccessCheckSessionExist', async () => {
    let cookie = await getSupervisorCookie();
    const response = await request(server)
        .get('/api/checkSessionExist')
        .set("Cookie", cookie)
    expect(response.body.isSuccessful).toBe(true);
});

test('SuccessModifyUserInfo', async () => {
    let cookie = await getSupervisorCookie();
    const response = await request(server)
        .post('/api/modifyUserInfo')
        .set("Cookie", cookie)
        .send({
            ID:6, password:"123", telephone:"1234567", email:"12345"
        })
    expect(response.body.isSuccessful).toBe(true);
});


test('SuccessQueryUserAmount', async () => {

    let cookie = await getSupervisorCookie();
    const response = await request(server)
        .get('/api/queryUserAmount')
        .set("Cookie", cookie)
        .query({
            userType:"DEVICEADMIN",
        })
    expect(response.body.isSuccessful).toBe(true);
});

test("listUserInfo",async ()=>{
    let cookie = await getSupervisorCookie();
    const response = await request(server)
        .get('/api/listUserInfo')
        .set("Cookie",cookie)
        .query({
            offset:"0",
            limit:"10",
        });
    expect(response.body.isSuccessful).toBe(true);
    const userList = response.body.data;
    expect(Array.isArray(userList)).toBe(true);
})

test("userLogout",async ()=>{
    let cookie = await getSupervisorCookie();
    const response = await request(server)
        .get('/api/logout')
        .set("Cookie",cookie)
    expect(response.body.isSuccessful).toBe(true);
});