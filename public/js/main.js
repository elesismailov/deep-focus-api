
let userWorkTime = 1500,
userBreakTime = 300,
userLongBreakTime = 900;

function changeTime() { 
    userWorkTime = Number(document.querySelector("#pomodoroTime").value)*60;
    userBreakTime = Number(document.querySelector("#breakTime").value)*60;
    userLongBreakTime = Number(document.querySelector("#longBreakTime").value)*60;
    document.querySelector("#pomodoroTimeMin").innerHTML =  document.querySelector("#pomodoroTime").value;
    document.querySelector("#breakTimeMin").innerHTML =  document.querySelector("#breakTime").value;
    document.querySelector("#longBreakTimeMin").innerHTML =  document.querySelector("#longBreakTime").value;
    stopTimer()
    saveData()
}
function saveData(){
    let timeData = {};
    timeData.uWTime = userWorkTime;
    timeData.uBTime = userBreakTime;
    timeData.uLBTime = userLongBreakTime;
    localStorage.setItem("timeData", JSON.stringify(timeData))

    let postT = new XMLHttpRequest();
    postT.open('POST', "/saveTimeData");
    postT.setRequestHeader("Content-Type", "application/json");
    // postT.send(JSON.stringify(timeData));
}
function restoreData(){
    let restoredTimeData = JSON.parse(localStorage.getItem("timeData"));
    document.querySelector("#time").innerHTML = `${("0" + Math.floor(workTimer.time%86400%3600/60)).slice(-2)}:${("0" + workTimer.time%86400%3600%60).slice(-2)}`;
    document.querySelector("#pomodoroTime").value = restoredTimeData.uWTime/60;
    document.querySelector("#breakTime").value = restoredTimeData.uBTime/60;
    document.querySelector("#longBreakTime").value = restoredTimeData.uLBTime/60;
    changeTime()

    let postT = new XMLHttpRequest();
    postT.open('GET', "/restoreTimeData");
    // postT.setRequestHeader("Content-Type", "application/json");
    postT.send();
}
// new Date().toJSON().slice(0,10)



let settingsCont = document.getElementById("settingsCont"),
    settingsContent = document.querySelector(".settings-content"),
    settingsIcon = document.querySelector(".settings-icon"),
    closeSettings = document.querySelector(".close-settings");

settingsIcon.onclick = function() {
    settingsCont.style.display = "block";

} 
closeSettings.onclick = function() {
    settingsCont.style.animationName = "fadeOut";
    settingsContent.style.animationName = "slideOutSettings";
    setTimeout(function(){
        settingsCont.style.animationName = "fadeIn"; 
        settingsContent.style.animationName = "slideInSettings";
        settingsCont.style.display = "none"; 
    }, 400);
}   
window.onclick = function(event) {
    if (event.target == settingsCont) {
        settingsCont.style.animationName = "fadeOut";
        settingsContent.style.animationName = "slideOutSettings";
        setTimeout(function(){
            settingsCont.style.animationName = "fadeIn"; 
            settingsContent.style.animationName = "slideInSettings";
            settingsCont.style.display = "none"; 
        }, 400);
    }
}

