const path = require('path');
const fs = require('fs');
const File = require('../models/file');

// Função para realizar o upload e renomear o arquivo
exports.uploadFile = async (file, userProvidedFileName) => {
    if (!file) {
        throw new Error('Nenhum arquivo enviado.');
    }

    if (!userProvidedFileName) {
        throw new Error('Nome do arquivo não fornecido.');
    }

    const filePath = path.join('uploads', userProvidedFileName);

    try {
        // Renomeia o arquivo para o nome fornecido pelo usuário
        fs.renameSync(path.join('uploads', file.filename), filePath);

        // Salva as informações do arquivo no banco de dados
        const newFile = new File({
            filename: userProvidedFileName,
            filePath: filePath,
        });

        await newFile.save();

        return {
            message: 'Arquivo enviado e salvo com sucesso!',
            file: newFile,
        };
    } catch (err) {
        throw new Error('Erro ao salvar o arquivo no banco de dados.');
    }
};

// Função para ler o conteúdo de um arquivo .txt
exports.readFile = (filename) => {
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (path.extname(filename) !== '.txt') {
        throw new Error('Apenas arquivos .txt podem ser lidos.');
    }

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(new Error('Erro ao ler o arquivo.'));
            } else {
                resolve({
                    message: 'Conteúdo do arquivo:',
                    content: data,
                });
            }
        });
    });
};