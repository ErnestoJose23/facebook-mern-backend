var mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  meta_data: {},
});

module.exports = File = mongoose.model("file", fileSchema);
