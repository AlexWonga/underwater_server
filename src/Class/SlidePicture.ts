export class SlidePicture {
    public slidePictureID: number;
    public slidePath: string;
    public slideDescription: string;

    //public creationTime :number;
    constructor(slidePictureID: number, slidePath: string, slideDescription: string) {
        this.slidePictureID = slidePictureID;
        this.slidePath = slidePath;
        this.slideDescription = slideDescription;
    }
}