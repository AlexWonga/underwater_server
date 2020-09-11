export class AttachmentInfo {
    public fileName: string;
    public filePath: string;
    public attachmentID: number;
    public deviceID: number;


    constructor(fileName: string, filePath: string, attachmentID: number, deviceID: number) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.attachmentID = attachmentID;
        this.deviceID = deviceID;
    }

//附件
}
