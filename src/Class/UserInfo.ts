import {UserType} from "../Enum/UserType";

/**
 * @description User实体类
 * */
export class UserInfo {
    public ID!: number;
    public username!: string;
    public password!: string;
    public telephone!: string;
    public email!: string;
    public userType!: UserType;
    public lastLoginTimestamp!: number;
    public creationTimestamp!: number;

    constructor(ID: number, username: string, password: string, telephone: string, email: string, UserType: UserType, lastLoginTimestamp: number, creationTimestamp: number) {
        this.ID = ID;
        this.email = email;
        this.username = username;
        this.password = password;
        this.telephone = telephone;
        this.userType = UserType;
        this.creationTimestamp = creationTimestamp;
        this.lastLoginTimestamp = lastLoginTimestamp;
    }
}