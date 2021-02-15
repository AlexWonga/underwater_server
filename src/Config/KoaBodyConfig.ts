const koaBodyOptions = Object.freeze({
    multipart: true,
    formidable: {
        uploadDir: "../files/upload",
        keepExtensions: true,
    }
});
export default koaBodyOptions;