

//////////                 TIMER FUNCTION-ALITY    AND    SAVING DATA         /////////


let userWorkTime = 1500,
userBreakTime = 300,
userLongBreakTime = 600;

function changeTime() { 
    userWorkTime = Number(document.querySelector("#pomodoroTime").value)*60;
    userBreakTime = Number(document.querySelector("#breakTime").value)*60;
    userLongBreakTime = Number(document.querySelector("#longBreakTime").value)*60;
    document.querySelector("#pomodoroTimeMin").innerHTML =  document.querySelector("#pomodoroTime").value;
    document.querySelector("#breakTimeMin").innerHTML =  document.querySelector("#breakTime").value;
    document.querySelector("#longBreakTimeMin").innerHTML =  document.querySelector("#longBreakTime").value;
    stopTimer()
    saveTimerData()
}
 
function saveSessionData () {
    let data = {
        sessionTime: thisSessionTime,
        doneSets: setsNum ? 1 : 0,
    }
    let request = new XMLHttpRequest();
    request.open('POST', "/saveSessionData");
    request.setRequestHeader("Content-Type", "application/json");
    thisSessionTime ? request.send(JSON.stringify(data)) : 0;

}
function saveTimerData(){
    let timeData = {};
    timeData.userWorkTime = userWorkTime;
    timeData.userBreakTime = userBreakTime;
    timeData.userLongBreakTime = userLongBreakTime;

    let postT = new XMLHttpRequest();
    postT.open('POST', "/saveTimerData");
    postT.setRequestHeader("Content-Type", "application/json");
    postT.send(JSON.stringify(timeData));
}
function restoreData(){
    let getT = new XMLHttpRequest();
    getT.open('GET', "/restoreTimeData");
    getT.send();
    getT.addEventListener("load", function(){
        let restoredTimeData = JSON.parse(getT.response);
        document.querySelector("#pomodoroTime").value = restoredTimeData.UserWorkTime/60;
        document.querySelector("#breakTime").value = restoredTimeData.UserBreakTime/60;
        document.querySelector("#longBreakTime").value = restoredTimeData.UserLongBreakTime/60;
        userWorkTime = Number(document.querySelector("#pomodoroTime").value)*60;
        userBreakTime = Number(document.querySelector("#breakTime").value)*60;
        userLongBreakTime = Number(document.querySelector("#longBreakTime").value)*60;
        document.querySelector("#pomodoroTimeMin").innerHTML =  document.querySelector("#pomodoroTime").value;
        document.querySelector("#breakTimeMin").innerHTML =  document.querySelector("#breakTime").value;
        document.querySelector("#longBreakTimeMin").innerHTML =  document.querySelector("#longBreakTime").value;
        stopTimer()
    })
}
// new Date().toJSON().slice(0,10)


///////                  ANIMATION PART                 ///////////

let settingsCont = document.getElementById("settingsCont"),
    settingsContent = document.querySelector(".settings-content"),
    settingsIcon = document.querySelector(".settings-icon"),
    closeSettings = document.querySelector(".close-settings"),
    reportIcon = document.querySelector(".report-icon"),
    reportContent = document.querySelector(".report-content"),
    closeReport = document.querySelector(".close-report");

closeSettings.addEventListener("click", resetAnimation);
closeReport.addEventListener("click", resetAnimation);

settingsIcon.addEventListener("click", function() {
    settingsCont.style.display = "block";
    reportContent.style.display = 'none';
    settingsContent.style.display = "block"
});
reportIcon.addEventListener("click", function(){
    settingsCont.style.display = "block"
    settingsContent.style.display = "none";
    reportContent.style.display = "block";
    let request = new XMLHttpRequest();
    request.open('GET', "/get-report-data");
    request.send();
    request.addEventListener("load", () => {
        reportCanvas = document.querySelector("#report-canvas");
        reportCanvas.width = reportCanvas.parentElement.parentElement.getClientRects()[0].width-52;
        rContext = reportCanvas.getContext("2d");
        renderCanvas(JSON.parse(request.response))
    })
});
function resetAnimation() {
    settingsCont.style.animationName = "fadeOut";
    settingsContent.style.animationName = "slideOutSettings";
    reportContent.style.animationName = "slideOutSettings";
    setTimeout(function(){
        settingsContent.style.animationName = "slideInSettings";
        reportContent.style.animationName = "slideInSettings";
        settingsCont.style.animationName = "fadeIn"; 
        settingsCont.style.display = "none"; 
    }, 250);
}

window.onclick = function(event) {
    if (event.target == settingsCont) resetAnimation();
}




////          DATA REPORT               ////////

let reportCanvas;
let rContext;

function renderCanvas(reportData) {
    let maxLines = reportData.dateReport.reduce( (a, arr) => arr.DoneSets > a ? arr.DoneSets : a, 0) + 1; // find maximum done pomodoros of the last 7 days
    let dateReport = reportData.dateReport;

    rContext.lineWidth = 0.4;
    rContext.strokeStyle = "rgba(0, 0, 0, 0.4)";
    rContext.fillStyle = "#000";
    rContext.font = "13px Poppins";
    
    if (window.innerWidth < 500) {
        // reportCanvas.style.width = (reportCanvas.parentElement.getClientRects()[0].width-50) + 'px';
        // reportCanvas.style.height = (reportCanvas.parentElement.getClientRects()[0].width-50)/4*3 + 'px';
        reportCanvas.height = (reportCanvas.parentElement.getClientRects()[0].width-50)*3/4;
        // reportCanvas.height = (reportCanvas.parentElement.getClientRects()[0].width-50)*3;
        
        rContext.lineWidth = 0.4;
        rContext.strokeStyle = "rgba(0, 0, 0, 0.4)";
        rContext.font = "10px Poppins";
    }
    rContext.beginPath()
    for (let i = 1; i < maxLines; i++) {
        rContext.moveTo(reportCanvas.width/8,reportCanvas.height/maxLines*i);
        rContext.lineTo(reportCanvas.width, reportCanvas.height/maxLines*i)
        rContext.fillText(maxLines-i, reportCanvas.width/8-20, reportCanvas.height/maxLines*i)
    }
    dateReport.reverse()
    for (let j = 1; j < 8; j++) {
        rContext.moveTo(reportCanvas.width/8*j, reportCanvas.height)
        rContext.lineTo(reportCanvas.width/8*j, 0)
        rContext.fillText(dateReport.slice(-7)[j-1].Date.slice(-2), (reportCanvas.width/8*j+5), reportCanvas.height-5)
    }
    dateReport.reverse()
    rContext.stroke()
    rContext.closePath()
    
    rContext.save()
    rContext.fillStyle = "black";
    rContext.rotate(-Math.PI / 2);
    rContext.fillText("Done Units", -180, 15)
    rContext.restore()
    rContext.fillText("Date", 7, reportCanvas.height-5)

    rContext.beginPath()
    rContext.lineWidth = 1.5;
    rContext.strokeStyle = "#ff0000"
    rContext.moveTo(0,0)
    rContext.lineTo(reportCanvas.width, reportCanvas.height)
    rContext.stroke()
    rContext.closePath()
}
