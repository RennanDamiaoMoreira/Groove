/*const fs = require('fs');
fs.readFile('imagem.jpg', (erro, buffer) => {
    if (erro) {
        console.log(erro);
        return;
    }

    console.log('Arquivo lido');

    fs.writeFile('imagem2.jpg', buffer, erro => {
        if (erro) {
            console.log(erro);
            return;
        }

        console.log('Arquivo escrito com sucesso');
    });
});

function teste(elem) {
    console.log("ola mundo")
    var path;
    elem.addEventListener('input', function() {
        path = this.value;

        audio.setAttribute('src', String(this.value));
    });
    console.log(new String(path))
    let audio = document.getElementById('audio');
    audio.setAttribute('src', String(path));


}*/