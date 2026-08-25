const {ImageKit} = require("@imagekit/nodejs");
const imagekit = new ImageKit({
   privateKey: process.env.IMAGEKIT_PKEY
})
async function uplaodFile(buffer) {
    console.log(buffer);
    const result = await imagekit.files.upload({
        file: buffer.toString("base64"),
        fileName: "image.jpg"
    })
    return result;
}
module.exports= uplaodFile;