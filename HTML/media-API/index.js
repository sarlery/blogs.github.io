const video = document.querySelector("video");
const cvs = document.querySelector("#cvs");
const startBtn = document.querySelector(".start");
const duration = document.querySelector(".duration");
const finish = document.querySelector(".finish");
const volumeBox = document.querySelector(".volumeBox");
const volume = document.querySelector(".volume");
const progressBar = document.querySelector(".progress-bar");
const bar = document.querySelector(".bar");
const speedWrapper = document.querySelector(".speedWrapper");
const enlarge = document.querySelector("enlarge");

const ctx = cvs.getContext("2d");

video.ontimeupdate = function (e) {
    console.log(e);
}



