const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    filePath: { type: String, required: true }
})

const File = mongoose.model('File', fileSchema);

module.exports = File;