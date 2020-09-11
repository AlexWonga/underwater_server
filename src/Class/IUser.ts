/**
 * @description 数据库添加数据用 User类
 */

export class IUser {
    ID: number;
    password?: string;
    telephone?: string;
    email?: string;

    constructor(ID: number, password?: string, telephone?: string, email?: string) {
        this.ID = ID;
        this.password = password;
        this.telephone = telephone;
        this.email = email;
    }
}