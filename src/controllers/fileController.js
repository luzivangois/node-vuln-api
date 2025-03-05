const multer = require('multer');
const fileService = require('../services/fileService');

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage }).single('file');

exports.uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Erro no upload do arquivo.', error: err.message });
        }

        try {
            const userProvidedFileName = req.body.name;

            if (!userProvidedFileName) {
                return res.status(400).json({ message: 'Nome do arquivo não fornecido.' });
            }

            const result = await fileService.uploadFile(req.file, userProvidedFileName);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
};

exports.readFile = async (req, res) => {
    const filename = req.params.filename;

    try {
        const result = await fileService.readFile(filename);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};