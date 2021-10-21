var player, primaryBtn, play, next, audio, time, volume, volumeBtn, path;
var intervalTimer, progressBar;
var playListOpen = false,
    playList, playlistButton, muteStatus = false;
var nextBtn, backBtn;
var now, list;
var title;
var body = document.getElementsByTagName("body")[0];
var angle = 0
    //prepare();


function handleFiles(event) {
    var files = event.target.files;
    console.log(files)
    list = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.includes('audio/')) {
            let obj = {
                name: files[i].name.slice(0, 19),
                path: URL.createObjectURL(files[i])
            }
            list.push(obj);
        }
    }
    $("#src").attr("src", URL.createObjectURL(files[0]));
    path = (URL.createObjectURL(files[0]))
    document.getElementById("audio").load();
    prepare()
}

document.getElementById("upload").addEventListener("change", handleFiles, false);

function prepare() {
    audio = new Audio(list[0].path)
    now = 0;
    player = document.getElementById("player");
    progressBar = document.getElementById("progress");
    playlistButton = document.getElementById("playlistButton")
    primaryBtn = player.querySelector(".butons-primary");
    playList = document.getElementById("playlist")
    play = primaryBtn.querySelector('.play');
    time = player.querySelector('.time');
    volume = document.getElementById("volume")
    volumeBtn = document.getElementById("speaker")
    nextBtn = primaryBtn.querySelector('.next')
    backBtn = primaryBtn.querySelector('.previous')
    title = player.querySelector('.title')
    volume.value = 100;
    audio.volume = 1;
    progressBar.value = 0;

    updateTitle()
    play.addEventListener('click', playAudio)
    volume.addEventListener('mousedown', startDrag);
    volume.addEventListener('mouseup', startDrag);
    volume.addEventListener('mousemove', showVolume);
    volumeBtn.addEventListener('click', mute);
    progressBar.addEventListener('click', seeker);
    playlistButton.addEventListener('click', openPlaylist);
    nextBtn.addEventListener('click', next);
    backBtn.addEventListener('click', back);
    backBtn.addEventListener('dblclick', backOne);


    criarTabela()
    intervalTimer = setInterval(updateTimer, 1000);
}

function back() {
    audio.currentTime = 0;
    audio.play()
}

function backOne() {
    if (now != 0) {
        now--;
        audio.pause();

        audio = new Audio(list[now].path)
            //audio.load(list[now].path);
        audio.play()
        updateTitle()
        criarTabela()
    }
}

function updateTitle() {

    title.innerHTML = list[now] ? list[now].name : ""
}

function next() {
    if (list.length > now + 1) {

        now++;
        //audio.pause();
        audio.currentTime = audio.duration;
        audio = new Audio(list[now].path)
            //audio.load(list[now].path);
        audio.play()
        updateTitle()
        criarTabela()
    }
}

function mute() {
    if (muteStatus) {

        muteStatus = false;
        if (volume.value > 0 && volume.value < 50) {
            volumeBtn.innerHTML = "volume_down"
        } else {
            volumeBtn.innerHTML = "volume_up"
        }
        audio.muted = false;
    } else {
        muteStatus = true;
        volumeBtn.innerHTML = "volume_off"
        audio.muted = true;

    }
}

function openPlaylist() {
    if (playListOpen) {
        playListOpen = false;
        playList.style.display = 'none';
        player.classList.remove('s9');
        player.classList.add('s12')

    } else {
        playListOpen = true;
        playList.style.display = 'block';
        player.classList.remove('s12');
        player.classList.add('s9')

    }
}





function startDrag(event) {
    if (event.type === 'mousedown') {
        drag = true;
    } else {
        drag = false;
    }
}

function showVolume(event) {
    if (drag) {
        if (muteStatus) mute();
        var pctVol = volume.value / 100;

        //sliderVol.style.width = x + 'px';
        audio.volume = pctVol

        if (pctVol == 0) {
            volumeBtn.innerHTML = "volume_off"
        } else {
            if (pctVol > 0 && pctVol < 0.5) {
                volumeBtn.innerHTML = "volume_down"
            } else {
                volumeBtn.innerHTML = "volume_up"
            }
        }
    } else {}
}


function seeker() {
    let pct = progressBar.value / 100;
    console.log(pct)
    audio.currentTime = (audio.duration * pct)
}

//Update time
function updateTimer() {
    if (audio.played.length) {
        bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        pctSeek = (audio.currentTime / audio.duration) * 100;
        progressBar.value = pctSeek
    }

    let current = convertTimer(audio.currentTime)
    let duration = audio.duration ? convertTimer(audio.duration) : "00:00"

    time.innerHTML = current + " | " + duration;

    if (current === duration) { next() }
    angle++
    // body.style.background = "linear-gradient(" + angle + "deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)";
    console.log(body)
}

//Audio play
function playAudio() {
    if (audio.played.length != 0) {
        if (audio.played.start(0) == 0 && !audio.paused) {
            audio.pause();
            //let icon = btnPlay.querySelector('.material-icons');
            play.innerHTML = "play_arrow";
        } else {
            audio.play()
                //let icon = btnPlay.querySelector('.material-icons');
            play.innerHTML = "pause";
        }
    } else {
        audio.play()
        play.innerHTML = "pause";
    }
}

//convertTime
function convertTimer(time) {
    time = parseInt(time);
    let hour, minutes, second;
    second = time;
    minutes = second > 59 ? second / 60 : 0;
    hour = minutes > 59 ? minutes / 60 : 0;

    if (minutes > 0)
        second = second - parseInt(minutes) * 60;

    if (hour > 0)
        minutes = minutes - parseInt(hour) * 60

    second = parseInt(second);
    minutes = parseInt(minutes);
    hour = parseInt(hour);
    hour = hour < 10 ? "0" + String(hour) : String(hour);
    minutes = minutes < 10 ? "0" + String(minutes) : String(minutes);
    second = second < 10 ? "0" + String(second) : String(second);
    let result = hour !== '00' ? hour + ":" : ''
    result += minutes + ":" + second
    return result;

}


function criarTabela(conteudo) {
    const tr = '<tr>'
    const td = '<td>'
    const trAc = '<tr class="blue">'
    const tdc = '</td>'
    const trc = '</tr>'
    const btn = '<td>    <button>subir</button>    <button>descer</button> </td>'



    // <
    // td > I can 't sleep</td> <
    // td >
    //     <
    //     button > subir < /button> <
    // button > descer < /button> < /
    //     td >


    var tabela = document.getElementsByTagName("table")[0];
    var tbody = tabela.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    console.log(tbody);
    list.forEach((elem, count) => {
        let string = ""
        string += count == now ? trAc : tr;
        string += td + elem.name + tdc + btn + trc;
        tbody.innerHTML += string;

    })


    console.log(tabela);
    return tabela;
}
//document.getElementById("tabela").appendChild(