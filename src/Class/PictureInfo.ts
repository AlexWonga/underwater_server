/**
 * @description DevicePicture返回类型
 */

export class PictureInfo {//图片
    public filePath: string;//路径
    public pictureID: number//图片id

    constructor(filePath: string, pictureID: number) {
        this.filePath = filePath;
        this.pictureID = pictureID;
    }
}
