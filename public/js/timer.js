

let pauseBt = document.querySelector("#pauseButton"),
    stopBt = document.querySelector("#stopButton"),
    breakBt = document.querySelector("#breakButton");

let mainTimer,
    setsNum = 0,
    thisSessionTime = 0,
    nowGoing = "tobreak";

let workTimer = {
        time: userWorkTime,
    },
    breakTimer = {
        time: userBreakTime,
    },
    longBreakTimer = {
        time: userLongBreakTime,
    };
function resetValues(){
    workTimer.time = userWorkTime;
    breakTimer.time = userBreakTime;
    longBreakTimer.time = userLongBreakTime;
    thisSessionTime = 0;
};
function setTimer(timer){
    document.querySelector("#time").innerHTML = `${("0" + Math.floor(timer.time%86400%3600/60)).slice(-2)}:${("0" + timer.time%86400%3600%60).slice(-2)}`;
    timer.time --;
    thisSessionTime ++
    if (timer.time < 0){
        saveSessionData();
        resetValues();
        clearInterval(mainTimer)
        if (nowGoing == "towork"){
            mainTimer = setInterval(setTimer, 1000, workTimer);
            nowGoing = "tobreak";
            breakBt.style.display = "none";
            pauseBt.style.display = "inline";
            // document.querySelector(".main-cont").style.opacity = "1";
            document.body.style.backgroundColor = "#514edf"
        } else {
            donePomodoro(1);
            setsNum ++;
            nowGoing = "towork";
            breakBt.style.display = "inline";
            pauseBt.style.display = "none";
            // document.querySelector(".main-cont").style.opacity = "0.7";
            document.body.style.backgroundColor = "#7607d1";
            if (setsNum >= 3){
                donePomodoro(0);
                setsNum = 0;
                mainTimer = setInterval(setTimer, 1000, longBreakTimer);
                // document.querySelector(".main-cont").style.opacity = "0.4";
                document.body.style.backgroundColor = "#00ffdb";
            } else {
                mainTimer = setInterval(setTimer, 1000, breakTimer)
            }
        }
    }
};

pauseBt.addEventListener('click', playTimer);
stopBt.addEventListener('click', stopTimer);
breakBt.addEventListener("click", clearBreak);

function pauseTimer(){
    clearInterval(mainTimer)
    pauseBt.removeEventListener('click', pauseTimer);
    pauseBt.addEventListener('click', playTimer);
    pauseBt.childNodes[0].src = "../images/timer-start-big.png";
    stopBt.style.display = 'inline';
};
function playTimer(){
    mainTimer = setInterval(setTimer, 1000, workTimer);
    pauseBt.removeEventListener('click', playTimer);
    pauseBt.addEventListener('click', pauseTimer);
    
    pauseBt.childNodes[0].src = "../images/timer-pause-big.png";
    stopBt.style.display = 'none';
};
function stopTimer(){
    clearInterval(mainTimer);
    saveSessionData()
    resetValues();

    document.querySelector("#time").innerHTML = `${("0" + Math.floor(workTimer.time%86400%3600/60)).slice(-2)}:${("0" + workTimer.time%86400%3600%60).slice(-2)}`;
    document.body.style.backgroundColor = "#514edf"
    stopBt.style.display = 'none';
    breakBt.style.display = "none";
    pauseBt.style.display = "inline";
    pauseBt.removeEventListener('click', pauseTimer);
    pauseBt.addEventListener('click', playTimer);
    pauseBt.childNodes[0].src = "../images/timer-start-big.png";

};
function clearBreak(){
    clearInterval(mainTimer);
    nowGoing = "tobreak";
    mainTimer = setInterval(setTimer, 1000, workTimer);
    document.querySelector("#time").innerHTML = `${("0" + Math.floor(workTimer.time%86400%3600/60)).slice(-2)}:${("0" + (workTimer.time+1)%86400%3600%60).slice(-2)}`;
    breakBt.style.display = "none";
    pauseBt.style.display = "inline";
    // document.querySelector(".main-cont").style.opacity = "1";
    document.body.style.backgroundColor = "#514edf"

};

function donePomodoro(set){
    // let pomodoroIcons = document.querySelectorAll(".done-cont .pomodoro img");
    // if (set == 1){
    //     pomodoroIcons[setsNum].src = "../images/pomodoro-done.png";
    // } else if (set == 0){
    //     for (let icon of pomodoroIcons){
    //         icon.src = "../images/pomodoro-unfinished.png";
    //     }
    // }
}


restoreData()