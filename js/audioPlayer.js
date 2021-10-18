var player, primaryBtn, play, next, audio, time, volume, volumeBtn;
var intervalTimer, progressBar;
var playListOpen = false,
    playList, playlistButton, muteStatus = false;
prepare();

function prepare() {
    player = document.getElementById("player");
    progressBar = document.getElementById("progress");
    playlistButton = document.getElementById("playlistButton")
    primaryBtn = player.querySelector(".butons-primary");
    playList = document.getElementById("playlist")
    console.log(playList)
    audio = player.getElementsByTagName('audio')[0];
    play = primaryBtn.querySelector('.play');
    time = player.querySelector('.time');
    volume = document.getElementById("volume")
    volumeBtn = document.getElementById("speaker")

    volume.value = 100;
    audio.volume = 1;
    progressBar.value = 0;
    play.addEventListener('click', playAudio)

    volume.addEventListener('mousedown', startDrag);
    volume.addEventListener('mouseup', startDrag);
    volume.addEventListener('mousemove', showVolume);
    volumeBtn.addEventListener('click', mute);
    progressBar.addEventListener('click', seeker);
    playlistButton.addEventListener('click', openPlaylist);



    intervalTimer = setInterval(updateTimer, 1000);
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
    let duration = convertTimer(audio.duration)
    time.innerHTML = current + " | " + duration;
}

//Audio play
function playAudio() {
    if (audio.played.length != 0) {
        if (audio.played.start(0) == 0 && !audio.paused) {
            audio.pause();
            //let icon = btnPlay.querySelector('.material-icons');
            play.innerHTML = "pause"
        } else {
            audio.play()
                //let icon = btnPlay.querySelector('.material-icons');
            play.innerHTML = "play_arrow";
        }
    } else {
        audio.play()

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