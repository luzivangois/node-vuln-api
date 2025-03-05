const path = require('path');
const fs = require('fs');
const File = require('../models/file');
const { exec } = require('child_process');

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

exports.readFile = (filename) => {
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // Vulnerabilidade: Uso de entrada do usuário diretamente em um comando do sistema
    return new Promise((resolve, reject) => {
        // Executa um comando do sistema para ler o arquivo
        exec(`cat ${filePath}`, (err, stdout, stderr) => {
            if (err) {
                reject(new Error('Erro ao ler o arquivo.'));
            } else {
                resolve({
                    message: 'Conteúdo do arquivo:',
                    content: stdout,
                });
            }
        });
    });
};