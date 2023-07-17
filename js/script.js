// var b = 0;
// function screen_record_2() {
//     const api_count = document.getElementById('api_count');
//     api_count.classList.remove('api_display_none');

//     var temp_clear = setInterval(() => {
//         const api_count = document.getElementById('api_count');
//         api_count.classList.add('api_display_none');
//         b = 1;
//     }, 2500);
// }

const temp_main = document.getElementById('temp_main');
const temp_recording_block = document.getElementById('temp_recording_block');
const stopButton = document.getElementById("stop-record");
const modal_container = document.getElementById('modal_container');
const temp_finish_record = document.getElementById('finish_record');
const downloadLink = document.getElementById('download');
const pause = document.getElementById('pause-record');
const api_count = document.getElementById('recordedTime');
const resume_pause = document.getElementById('resume_pause');
const video = document.getElementById('video');

stopButton.addEventListener('click', function () {
    modal_container.classList.remove('api_display_none');
});

temp_finish_record.addEventListener('click', function () {
    mediaRecorder.resume();
    shouldStop = true;
});

const audioRecordConstraints = {

    echoCancellation: true

}

var secs = 0, temp_clear, mediaRecorder;

function startRecord() {
    temp_main.classList.add('api_display_none');
    temp_recording_block.classList.remove('api_display_none');
    temp_clear = setInterval(() => {
        secs++;
        var temp_time = calculateTimeDuration(secs);
        api_count.innerHTML = temp_time;
    }, 1000);
}

function stopRecord() {
    location.reload();
}

function calculateTimeDuration(secs) {

    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }
    return hr + ':' + min + ':' + sec;
}

const handleRecord = function ({ stream, mimeType }) {
    startRecord();
    let recordedChunks = [];
    stopped = false;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
        if (shouldStop === true && stopped === false) {
            mediaRecorder.stop();
            stopped = true;
        }
    };
    mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, {type: "video/AVI"});
        recordedChunks = []
        // const filename = window.prompt('Enter file name');
        downloadLink.href = URL.createObjectURL(blob);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '/' + mm + '/' + dd;
        downloadLink.download = `recording ${today}.AVI`;  //webm
        downloadLink.click();
        stopRecord();
    };
    mediaRecorder.start(200);
};

pause.onclick = () => {
    if (mediaRecorder.state === "recording") {
        pause.classList.remove('record-stop');
        pause.classList.add('record-resume');
        resume_pause.innerHTML = 'Resume';
        mediaRecorder.pause();
        clearInterval(temp_clear);
    } else if (mediaRecorder.state === "paused") {
        pause.classList.remove('record-resume');
        pause.classList.add('record-stop');
        resume_pause.innerHTML = 'Pause';
        mediaRecorder.resume();
        temp_clear = setInterval(() => {
            secs++;
            var temp_time = calculateTimeDuration(secs);
            api_count.innerHTML = temp_time;
        }, 1000);
    }
};

async function recordScreen() {
    const mimeType = 'video/mp4';
    shouldStop = false;
    const constraints = {
        video: {
            cursor: 'motion'
        }
    };

    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia))
        return window.alert('Screen Record not supported!')

    let stream = null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "motion" }, audio: { 'echoCancellation': true } });

    const audioContext = new AudioContext();
    const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: { 'echoCancellation': true }, video: false });

    const userAudio = audioContext.createMediaStreamSource(voiceStream);
    const audioDestination = audioContext.createMediaStreamDestination();
    userAudio.connect(audioDestination);
    if (displayStream.getAudioTracks().length > 0) {
        const displayAudio = audioContext.createMediaStreamSource(displayStream);
        displayAudio.connect(audioDestination);
    }
    const tracks = [...displayStream.getVideoTracks(), ...audioDestination.stream.getTracks()]
    stream = new MediaStream(tracks);
    handleRecord({ stream, mimeType })
}

async function recordScreen_webcam() {
    recordVideo();
    const mimeType = 'video/mp4';
    shouldStop = false;
    const constraints = {
        video: {
            cursor: 'motion'
        }
    };
    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
        return window.alert('Screen Record not supported!')
    }
    let stream = null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "motion" }, audio: { 'echoCancellation': true } });

    const audioContext = new AudioContext();
    const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: { 'echoCancellation': true }, video: false });
    const userAudio = audioContext.createMediaStreamSource(voiceStream);
    const audioDestination = audioContext.createMediaStreamDestination();
    userAudio.connect(audioDestination);
    if (displayStream.getAudioTracks().length > 0) {
        const displayAudio = audioContext.createMediaStreamSource(displayStream);
        displayAudio.connect(audioDestination);
    }
    const tracks = [...displayStream.getVideoTracks(), ...audioDestination.stream.getTracks()]
    stream = new MediaStream(tracks);
    handleRecord({ stream, mimeType })
}

async function recordVideo() {
    const mimeType = 'video/mp4';
    shouldStop = false;
    const constraints = {
        audio: {
            "echoCancellation": true
        },
        video: {
            "width": {
                "min": 400,
                "max": 1024
            },

            "height": {
                "min": 300,
                "max": 768
            }
        }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.classList.remove('api_display_none');
    video.srcObject = stream;
}
