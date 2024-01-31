const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  userId: String, // ID of the user who uploaded the image
  images: [
    {
      data: Buffer,
      contentType: String,
      price: Number,
      garmentType: String,
    },
  ],
});
const ImageModel = mongoose.model("ImageModel", ImageSchema);
module.exports = ImageModel;
