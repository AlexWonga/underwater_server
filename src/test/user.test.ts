// test/server/user.spec.js

import server from '../index';
import request from 'supertest'




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

// test('success to login if typing device01 & 123', async () => {
//     const response = await request(server)
//         .post('/api/userLogin')
//         .send({
//             username: 'device01',
//             password: '123'
//         })
//     expect(response.body.isSuccessful).toEqual(true);
// })
//
// test('SuccessAddUser',async ()=>{
//     const response = await request(server)
//         .post('/api/addUser')
//
//         .send({
//           username:"test01",
//             password:'123',
//             userType:UserType.DEVICEADMIN,
//             telephone:"13944648111",
//             email:"494217470@qq.com",
//         })
//     expect(response.body.isSuccessful).toBe(true);
//
// })