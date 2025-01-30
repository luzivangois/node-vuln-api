const path = require('path')
const fs = require('fs')
const File = require('../models/file')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage}).single('file')

exports.uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Erro no upload do arquivo.', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        const userProvidedFileName = req.body.name;

        if (!userProvidedFileName) {
            return res.status(400).json({ message: 'Nome do arquivo não fornecido.' });
        }

        const filePath = path.join('uploads', userProvidedFileName);

        try {
            fs.renameSync(path.join('uploads', req.file.filename), filePath);

            const newFile = new File({
                filename: userProvidedFileName,
                filePath: filePath
            });

            await newFile.save();

            res.status(200).json({
                message: 'Arquivo enviado e salvo com sucesso!',
                file: newFile
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao salvar o arquivo no banco de dados.', error: err });
        }
    })
}

exports.readFile = async (req, res) => {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '..', 'uploads', filename)

    if (path.extname(filename) !== '.txt') {
        return res.status(400).json({ message: 'Apenas arquivos .txt podem ser lidos.' })
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao ler o arquivo.', error: err.message })
        }

        res.status(200).json({
            message: 'Conteúdo do arquivo:',
            content: data
        })
    })
}