

var workTime = userWorkTime -1,
    breakTime = userBreakTime,
    longBreakTime = userLongBreakTime,
    setsNumber = 0;

var pauseBt = document.querySelector("#pauseButton"),
      stopBt = document.querySelector("#stopButton");

var pomodoro;

pauseBt.addEventListener('click', playWork)
stopBt.addEventListener('click', stop)

function setWork(){
    document.querySelector("#time").innerHTML = `${("0" + Math.floor(workTime%86400%3600/60)).slice(-2)}:${("0" + workTime%86400%3600%60).slice(-2)}`;
    workTime -=1;
    if(workTime<0){
        donePomodoro(1)
        clearInterval(pomodoro);
        workTime = userWorkTime;
        breakTime = userBreakTime;
        longBreakTime = userLongBreakTime;
        // document.querySelector(".main-cont").style.background = "linear-gradient(-20deg, #df4e4e 32%, #fff0)";
        document.querySelector(".main-cont").style.opacity = "0.7";
        pauseBt.removeEventListener('click', playWork)
        pauseBt.removeEventListener('click', pauseWork)
        pauseBt.addEventListener('click', doneBreak)
        pauseBt.childNodes[0].src = "static/images/timer-complete-big.png";
        pomodoro = setInterval(setBreak, 1000)
        setsNumber +=1
        if(setsNumber>2){
            donePomodoro(0)
            setsNumber = 0
            clearInterval(pomodoro)
            document.querySelector(".main-cont").style.opacity = "0.3";
            pomodoro = setInterval(setLongBreak, 1000)
        }
    }
};
function setBreak(){
    document.querySelector("#time").innerHTML = `${("0" + Math.floor(breakTime%86400%3600/60)).slice(-2)}:${("0" + breakTime%86400%3600%60).slice(-2)}`;
    breakTime -=1;
    if(breakTime<0){
        clearInterval(pomodoro);
        workTime = userWorkTime;
        breakTime = userBreakTime;
        longBreakTime = userLongBreakTime;
        // document.querySelector(".main-cont").style.background = "linear-gradient(-20deg, #514edf 36%, #c933c066)";
        document.querySelector(".main-cont").style.opacity = "1";
        pauseBt.removeEventListener('click', doneBreak)
        pauseBt.addEventListener('click', pauseWork)
        pauseBt.childNodes[0].src = "static/images/timer-pause-big.png";
        pomodoro = setInterval(setWork, 1000)
        console.log("Time to take a break!")
    }
}
function setLongBreak(){
    document.querySelector("#time").innerHTML = `${("0" + Math.floor(longBreakTime%86400%3600/60)).slice(-2)}:${("0" + longBreakTime%86400%3600%60).slice(-2)}`;
    longBreakTime -=1;
    if(longBreakTime<0){
        clearInterval(pomodoro);
        workTime = userWorkTime;
        breakTime = userBreakTime;
        longBreakTime = userLongBreakTime;
        // document.querySelector(".main-cont").style.background = "linear-gradient(-20deg, #514edf 36%, #c933c066)";
        document.querySelector(".main-cont").style.opacity = "1";
        pauseBt.removeEventListener('click', doneBreak)
        pauseBt.addEventListener('click', pauseWork)
        pauseBt.childNodes[0].src = "static/images/timer-pause-big.png";
        pomodoro = setInterval(setWork, 1000)
    }    
}
function doneBreak(){
    clearInterval(pomodoro);
    document.querySelector(".main-cont").style.opacity = "1";
    pauseBt.removeEventListener('click', doneBreak)
    pauseBt.addEventListener('click', pauseWork)
    pauseBt.childNodes[0].src = "static/images/timer-pause-big.png";
    pomodoro = setInterval(setWork, 1000)
}
function pauseWork(){
    clearInterval(pomodoro);
    
    pauseBt.childNodes[0].src = "static/images/timer-start-big.png";
    pauseBt.removeEventListener('click', pauseWork)
    pauseBt.addEventListener('click', playWork)
    stopBt.style.display = 'inline';
}
function playWork(){
    pomodoro = setInterval(setWork,1000)
    workTime -=1
    pauseBt.childNodes[0].src = "static/images/timer-pause-big.png";
    pauseBt.removeEventListener('click', playWork)
    pauseBt.addEventListener('click', pauseWork)
    stopBt.style.display = 'none';
}

function stop(){
    clearInterval(pomodoro);
    workTime = userWorkTime;
    breakTime = userBreakTime;
    document.querySelector("#time").innerHTML = `${("0" + Math.floor(workTime%86400%3600/60)).slice(-2)}:${("0" + workTime%86400%3600%60).slice(-2)}`;
    
    pauseBt.childNodes[0].src = "static/images/timer-start-big.png";
    pauseBt.addEventListener('click', playWork)
    stopBt.style.display = "none"
}

// const fs = require("fs");
// let output = fs.createWriteStream("numbers.txt");
// for(let i = 0; i < 100; i++) {
// output.write(`${i}\n`);
// }
// output.end();

function donePomodoro(set){
    let pomodoroIcons = document.querySelectorAll(".done-cont .pomodoro img");
    if (set == 1){
        try {pomodoroIcons[setsNumber].src = "static/images/pomodoro-done.png";}
        catch (e){}//console.error(e)}
    } else if (set == 0){
        for (let icon of pomodoroIcons){
            icon.src = "static/images/pomodoro-unfinished.png";
        }
    }
    
}
document.body.onload = setTimeout(restoreData, 100);
