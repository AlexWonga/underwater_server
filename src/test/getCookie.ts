import request from "supertest";
import server from "../index";

export async function getSupervisorCookie(){
    let cookie:string = "";
    const response = await request(server)
        .post('/api/supervisorLogin')
        .send({
            username: 'admin',
            password: '123'
        });
    const info = response.header['set-cookie'];
    for(let i=0;i<info.length;i++){
        let ext = info[i].split(";");
        cookie+=ext[0];
        if(i==0){
            cookie += ";"
        }
    }
    return cookie;
}


export async function getDeviceAdminCookie(){
    let cookie:string = "";
    const response = await request(server)
        .post('/api/supervisorLogin')
        .send({
            username: 'device01',
            password: '123'
        });
    const info = response.header['set-cookie'];
    for(let i=0;i<info.length;i++){
        let ext = info[i].split(";");
        cookie+=ext[0];
        if(i==0){
            cookie += ";"
        }
    }
    return cookie;
}