const path = require('path')
const fs = require('fs')
const Archive = require('../models/archive')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + ext;
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }  // Limite de 10MB
}).single('file')

// Upload de arquivo
exports.uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no upload do arquivo.', error: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        try {
            // Criar um registro do arquivo no banco de dados
            const newFile = new File({
                filename: req.file.filename,
                filePath: path.join('uploads', req.file.filename)
            })

            await newFile.save();

            res.status(200).json({
                message: 'Arquivo enviado e salvo com sucesso!',
                file: newFile
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao salvar o arquivo no banco de dados.', error: err });
        }
    });
};

// Leitura de arquivo txt
exports.readFile = async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // Verifica se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Arquivo não encontrado.' });
        }

        // Verifica se o arquivo é um arquivo txt
        if (path.extname(filename) !== '.txt') {
            return res.status(400).json({ message: 'Apenas arquivos .txt podem ser lidos.' });
        }

        // Lê o conteúdo do arquivo txt
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao ler o arquivo.' });
            }

            res.status(200).json({
                message: 'Conteúdo do arquivo:',
                content: data
            });
        });
    });
};