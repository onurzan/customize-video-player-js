const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-option"),
picInPicBtn = container.querySelector(".pic-in-pic span"),
fullscreenBtn = container.querySelector(".fullscreen i");

let timer;

const hideControls = () => {
    if(mainVideo.paused) return;// if video is paused return
    timer = setTimeout(() => { // remove show-controls class after 3s
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls"); // add show-controls class on mousemove
    clearTimeout(timer); //clear timer
    hideControls(); // calling hideControls
});

const formatTime = time => {
    // getting seconds, münutes, hours
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    //adding 0 at the beggining if the particular value is less than 10
    seconds = seconds < 10 ? `0${seconds}`:seconds;
    minutes = minutes < 10 ? `0${minutes}`:minutes;
    hours =hours < 10 ? `0${hours}` : hours;

    if(hours == 0) { //if hours is 0 return minutes & seconds only else return all
        return `${minutes}:${seconds}`;
    }   
    return `${hours}:${minutes}:${seconds}`; 
}
mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target; // getting currentTime & duration of the video
    let percent = (currentTime / duration) * 100; // getting percent
    progressBar.style.width = `${percent}%`;  // passing percent as progressBar width
    currentVidTime.innerText = formatTime (currentTime);
});

mainVideo.addEventListener("loadeddata", e => {
    videoDuration.innerText = formatTime (e.target.duration); //passing video duration as videoDuration innerText
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
});

const draggableProgressBar = () => {
    let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
    progressBar.style.width = `${e.offsetX}px`; // passing offsetX value as progressBar width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
    currentVidTime.innerText = formatTime(mainVideo.currentTime); // pasing video current time as currentVidTime innerText
}

videoTimeline.addEventListener("mousedown", () => { // calling draggableProgress function on mousemove event
    videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

container.addEventListener("mouseup", () => { // remove mousemove listener on moveup event
    videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", e => {
    const progressTime = videoTimeline.querySelector("span");
    let offsetX = e.offsetX; // getting mouse position
    progressTime.style.left = `${offsetX}px`; // passing offsetX value as progressTime left value
    let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration; // getting percent
    progressTime.innerText = formatTime(percent); // passing percent as progressTime innerText
});

volumeBtn.addEventListener("click", () =>{
    if(!volumeBtn.classList.contains("bi-volume-up")) { // if volume icon isn't volume high icon
        mainVideo.volume = 0.5; //passing 0.5 value is video volume
        volumeBtn.classList.replace("bi-volume-mute", "bi-volume-up");
    } else {
        mainVideo.volume = 0.0; //passing 0.0 value is video volume, so the video is mute
        volumeBtn.classList.replace("bi-volume-up", "bi-volume-mute");
    }
    volumeSlider.value = mainVideo.volume; // update slider value according to the value volume
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value; // passing slider value as video volume
    if(e.target.value == 0) { // if slider value is 0, change icon to mute icon
        volumeBtn.classList.replace("bi-volume-up", "bi-volume-mute");
    } else {
        volumeBtn.classList.replace("bi-volume-mute", "bi-volume-up");
    }
});

speedBtn.addEventListener("click", () =>{
    speedOptions.classList.toggle("show"); // toggle show class
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () =>{ // adding click event on all speed option
        mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as video playback value
        speedOptions.querySelector(".active").classList.remove("active"); // removing active class
        option.classList.add("active"); // adding active class on the selected option
    });
});

document.addEventListener("click", e =>{ // hide speed options on document click
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-icons") {
        speedOptions.classList.remove("show");
    }
});

picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture(); // changing video mode to picture in picture
});

fullscreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen"); // toggle fullscreen class
    if(document.fullscreenElement) { // if video is already in fullscreen mode
        fullscreenBtn.classList.replace("bi-fullscreen-exit", "bi-fullscreen");
        return document.exitFullscreen(); // exit from fullscreen mode and return
    }
    fullscreenBtn.classList.replace("bi-fullscreen", "bi-fullscreen-exit");
    container.requestFullscreen(); //go to fullscreen mode
});

skipBackward.addEventListener("click", () =>{
    mainVideo.currentTime -= 5; //subtract 5 seconds from the current video time
});

skipForward.addEventListener("click", () =>{
    mainVideo.currentTime += 5; // add 5 seconds to the current video time
});

playPauseBtn.addEventListener("click", () =>{
    // if video is paused, play the video else pause the video
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () =>{ //if video is play, change icon to pause
    playPauseBtn.classList.replace("bi-play-fill", "bi-pause-fill");
});

mainVideo.addEventListener("pause", () =>{ // if video is pause, change icon to play
    playPauseBtn.classList.replace("bi-pause-fill" , "bi-play-fill");
});


