// test/server/user.spec.js

import server from '../index';
import request from 'supertest'
import {getSupervisorCookie} from "./getCookie";


afterAll(() => {
    server.close();
})

describe("/addDataCategory", async () => {
    test('/addDataCategory select', async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/addDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryName: "test01",
                dataType: "SELECT",
                selectList: ["1", "2"],
            })
        expect(response.body.isSuccessful).toBe(true);
    });
    test('/addDataCategory test', async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/addDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryName: "test02",
                dataType: "TEXT",
            })
        expect(response.body.isSuccessful).toBe(true);
    });
    test('/addDataCategory test', async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/addDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryName: "test03",
                dataType: "TWODIMENSIONAL",
            });
        expect(response.body.isSuccessful).toBe(true);
    });

});

describe("modifyDataCategory", async () => {
    test("modifyDataCategory/SELECT", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/modifyDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 10,
                dataCategoryName: "new test01",
                selectList: ["2", "3"],
            });
        expect(response.body.isSuccessful).toBe(true);
    });

    test("modifyDataCategory/TEXT", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/modifyDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 11,
                dataCategoryName: "new test02",
            });
        expect(response.body.isSuccessful).toBe(true);
    });

    test("modifyDataCategory/TWODIMENSIONALDATA", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/modifyDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 12,
                dataCategoryName: "new test03",
            });
        expect(response.body.isSuccessful).toBe(true);
    });

})


describe("deleteDataCategory", async () => {

    test("deleteDataCategory/SELECT", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/deleteDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 10,
            });
        expect(response.body.isSuccessful).toBe(true);
    });

    test("deleteDataCategory/TEXT", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/deleteDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 11,
            });
        expect(response.body.isSuccessful).toBe(true);
    });

    test("deleteDataCategory/TWODIMENSIONALDATA", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/deleteDataCategory')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 12,
            });
        expect(response.body.isSuccessful).toBe(true);
    });
})

describe("deletedDataCategoryRecover", async () => {

    test("deletedDataCategoryRecover/SELECT", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/deletedDataCategoryRecover')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 10,
            });
        expect(response.body.isSuccessful).toBe(true);
    });

    test("deletedDataCategoryRecover/TEXT", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/deletedDataCategoryRecover')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 11,
            });
        expect(response.body.isSuccessful).toBe(true);
    });

    test("deletedDataCategoryRecover/TWODIMENSIONALDATA", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .post('/api/deletedDataCategoryRecover')
            .set("Cookie", cookie)
            .send({
                dataCategoryID: 12,
            });
        expect(response.body.isSuccessful).toBe(true);
    });
})

describe("listDataCategory", async () => {
    test("listDataCategory test01", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/listDataCategory')
            .set("Cookie", cookie)
            .query({
                offset: 0,
                limit: 10,
            })
        expect(response.body.isSuccessful).toBe(true);
    });
    test("listDataCategory test02", async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/listDataCategory')
            .set("Cookie", cookie)
            .query({
                offset: 0,
                limit: 2,
            })
        expect(response.body.isSuccessful).toBe(true);
    });
});

describe("listDeletedCategory", async () => {
    test('listDeletedCategory01', async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/listDeletedCategory')
            .set("Cookie", cookie)
            .query({
                offset: 0,
                limit: 10,
            })
        expect(response.body.isSuccessful).toBe(true);
    });
});


describe('searchCategory',async ()=>{
    test('searchCategory01', async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/searchCategory')
            .set("Cookie", cookie)
            .query({
                keyword:""
            })
        expect(response.body.isSuccessful).toBe(false);
    });

    test('searchCategory01', async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/searchCategory')
            .set("Cookie", cookie)
            .query({
                keyword:"test"
            })
        expect(response.body.isSuccessful).toBe(true);
    });
});

describe("searchDeletedCategory",async ()=>{
    test('searchDeletedCategory01', async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/searchDeletedCategory')
            .set("Cookie", cookie)
            .query({
                keyword:""
            })
        expect(response.body.isSuccessful).toBe(false);
    });

    test('searchDeletedCategory01', async () => {
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/searchDeletedCategory')
            .set("Cookie", cookie)
            .query({
                keyword:"test"
            })
        expect(response.body.isSuccessful).toBe(true);
    });
})

describe("queryCategory",async ()=>{
    test('queryCategory test01',async ()=>{
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/queryCategory')
            .set("Cookie", cookie)
            .query({
                categoryID:12,
            })
        expect(response.body.isSuccessful).toBe(true);
        console.log(response.body);
        expect(response.body.data.dataCategoryName).toBe("new test03");
    });

    test("queryCategory test02",async ()=>{
        let cookie = await getSupervisorCookie();
        const response = await request(server)
            .get('/api/queryCategory')
            .set("Cookie", cookie)
            .query({
                categoryID:11,
            })
        expect(response.body.isSuccessful).toBe(true);
        console.log(response.body);
        expect(response.body.data.dataCategoryName).toBe("new test02");
    })
});

describe("queryCategoryOpitons",async ()=>{
    it('queryCategoryOptions',async ()=>{

    })
});