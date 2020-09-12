// test/server/user.spec.js

import server from '../index';
import request from 'supertest'
import {UserType} from "../Enum/UserType";

let cookie:string;

// beforeAll(() => agent
//     .post('/api/supervisorlogin')
//     .send({
//         username: 'admin',
//         password: "123",
//     })
//     .expect(200)
//     .then((res) => {
//         console.log(res.header['set-cookie']);
//     }));

// describe('GET logout', () => {
//     it('logs user out', () => agent
//         .get('/logout')
//         .set('Cookie', cookie)
//         .expect(302));
// });

let getCookie = function (response:request.Response){
    let cookie:string = "";
    const info = response.header['set-cookie'];
    console.log(info);
    for(let i=0;i<info.length;i++){
        let ext = info[i].split(";");
        console.log(ext);
        cookie+=ext[0];
        if(i==0){
            cookie += ";"
        }
    }
    return cookie;
}


test('success to login if typing admin & 123', async () => {
    const response = await request(server)
        .post('/api/supervisorLogin')
        .send({
            username: 'admin',
            password: '123'
        });
    console.log(response.header['set-cookie']);
    cookie = getCookie(response);
    expect(response.body.isSuccessful).toEqual(true);
})

test('success to login if typing device01 & 123', async () => {
    const response = await request(server)
        .post('/api/userLogin')
        .set("Cookie",cookie)
        .send({
            username: 'device01',
            password: '123'
        })
    expect(response.body.isSuccessful).toEqual(true);
})
//
test('SuccessAddUser',async ()=>{
    const res = await request(server)
        .post('/api/supervisorLogin')
        .send({
            username: 'admin',
            password: '123'
        });
    cookie = getCookie(res);
    const response = await request(server)
        .post('/api/addUser')
        .set("Cookie",cookie)
        .send({
          username:"test01",
            password:'123',
            userType:UserType.DEVICEADMIN,
            telephone:"13944648111",
            email:"494217470@qq.com",
        })
    expect(response.body.isSuccessful).toBe(true);

})