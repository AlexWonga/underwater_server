import request from "supertest";

export function getCookie(response:request.Response){
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
