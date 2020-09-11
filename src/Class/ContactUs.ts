/**
 * @description 联系我们 实体类
 */

export class ContactUs {
    public contactWay: string;
    public siteProfile: string;

    constructor(contactWay: string, siteProfile: string) {
        this.siteProfile = siteProfile;
        this.contactWay = contactWay;
    }
}