const sharp = require("sharp");
const fs = require("fs");

module.exports = async function resizeImage(req, res, next) {
    try {
        if (req.file) {
            const buffer = await sharp(req.file.path)
                .resize({ height: 500 })
                .toFormat("webp")
                .toBuffer();

            await fs.promises.writeFile(req.file.path, buffer);
            console.log("Wrote to " + req.file.path);
            req.file.originalname = "name.webp";
        }
    } catch (err) {
        console.error("Error resizing images: " + err);
    }

    next();
};
