var playerVideo, view, btnPlay, barProgress, videoLoader, progress, btnScreen, btnVol;
var slider, sliderVol, drag = false;

var intervalTimer, pctSeek, pctBar;

function prepare(elem) {
    if (playerVideo != elem) {
        playerVideo = elem;

        view = playerVideo.querySelector(".video-view");
        btnPlay = playerVideo.querySelector(".video-play");
        time = playerVideo.querySelector('.video-time');
        barProgress = playerVideo.querySelector(".video-progress-bar");
        videoLoader = playerVideo.querySelector(".video-loader");
        progress = playerVideo.querySelector('.video-progress');
        slider = playerVideo.querySelector('.slider');
        sliderVol = playerVideo.querySelector('.slider-vol');
        btnVol = playerVideo.querySelector('.video-volume');
        btnScreen = playerVideo.querySelector('.video-screen');

        btnPlay.addEventListener('click', play);
        barProgress.addEventListener('click', seeker);
        slider.addEventListener('mousedown', startDrag);
        slider.addEventListener('mouseup', startDrag);
        slider.addEventListener('mousemove', showVolume);
        btnVol.addEventListener('click', mute)
        btnScreen.addEventListener('click', fullScreen)

        console.log(getPosition(view))

        intervalTimer = setInterval(updateTimer, 10);

    }
}

function getPosition(element) {
    var rect = element.getBoundingClientRect();
    console.log({
        x: rect.left,
        y: rect.top
    })
    return {
        x: rect.left,
        y: rect.top
    };
}

function fullScreen() {
    if (!document.webkitFullscreenElement) {
        playerVideo.webkitRequestFullscreen();
    } else {
        document.webkitExitFullscreen();
    }
}

function startDrag(event) {
    if (event.type === 'mousedown') {
        drag = true;
    } else {
        drag = false;
    }
}

function mute() {
    if (!view.muted) {
        view.muted = true;
        btnVol.querySelector('.material-icons').innerHTML = "volume_off"
    } else {
        view.muted = false;
        btnVol.querySelector('.material-icons').innerHTML = "volume_up"
    }
}

function showVolume(event) {
    if (drag) {
        var w = slider.clientWidth;
        var x = ((event.clientX - getPosition(slider).x));

        var pctVol = (x / w);

        sliderVol.style.width = x + 'px';
        view.volume = pctVol

        if (pctVol == 0) {
            btnVol.querySelector('.material-icons').innerHTML = "volume_off"
        } else {
            if (pctVol > 0 && pctVol < 0.5) {
                btnVol.querySelector('.material-icons').innerHTML = "volume_down"
            } else {
                btnVol.querySelector('.material-icons').innerHTML = "volume_up"
            }
        }
    } else {}
}

function seeker(event) {
    pctBar = ((event.clientX - getPosition(barProgress).x) / barProgress.clientWidth) * 100;
    view.currentTime = (view.duration * pctBar) / 100
}

function updateTimer() {
    if (view.played.length) {
        bufferedEnd = view.buffered.end(view.buffered.length - 1);

        videoLoader.style.width = String((bufferedEnd / view.duration) * 100) + "%"

        pctSeek = (view.currentTime / view.duration) * 100;

        progress.style.width = String(pctSeek) + '%'
    }
    let current = convertTimer(view.currentTime)
    let duration = convertTimer(view.duration)
    time.innerHTML = current + " / " + duration;
}

function play() {

    if (view.played.length != 0) {
        if (view.played.start(0) == 0 && !view.paused) {
            view.pause();
            let icon = btnPlay.querySelector('.material-icons');
            icon.innerHTML = "pause"
        } else {
            view.play()
            let icon = btnPlay.querySelector('.material-icons');
            icon.innerHTML = "play_arrow";
        }
    } else {
        view.play()

    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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