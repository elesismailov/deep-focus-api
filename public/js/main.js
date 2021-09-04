
let lastDataTimer;
function debouncer(func, time) {
    clearTimeout(lastDataTimer)
    lastDataTimer = setTimeout(func, time)
}



//////////              THEME SWITCH               ///////////

let lastTheme;
function getTheme() {
    let request = new XMLHttpRequest();
    request.open('GET', "/theme");
    request.send();
    request.addEventListener("load", () => {
        lastTheme = JSON.parse(request.response).Theme;
        renderTheme(lastTheme)
    })
};

document.querySelector("#theme1").addEventListener("click", () => {renderTheme("theme1")})
document.querySelector("#theme2").addEventListener("click", () => {renderTheme("theme2")})
document.querySelector("#theme3").addEventListener("click", () => {renderTheme("theme3")})
function renderTheme(theme) {
    if (document.body.classList[0] && document.body.classList[0] != theme) {
        let request = new XMLHttpRequest();
        request.open('POST', "/theme");
        debouncer(()=>{request.send(JSON.stringify({theme}))}, 1000)
        
    }
    document.body.classList = theme;
    document.querySelector(`#${theme}`).checked = true;
}

getTheme()
restoreData()


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
    debouncer(saveTimerData, 600)
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
function saveSessionData () {
    let data = {
        sessionTime: thisSessionTime,
        doneSets: setsNum ? 1 : 0,
        date: new Date().toJSON().slice(0,10),
    }
    let request = new XMLHttpRequest();
    request.open('POST', "/saveSessionData");
    request.setRequestHeader("Content-Type", "application/json");
    thisSessionTime ? request.send(JSON.stringify(data)) : 0;

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

window.addEventListener("click", (event) => {
    if (event.target == settingsCont) resetAnimation();
}) 
window.addEventListener("keydown", (event) =>{
    if (event.key == "Escape" && settingsCont.style.display === "block") {
        closeReport.click()
        pauseBt.focus()
    }
})




////          DATA REPORT               ////////

let reportCanvas;
let monthlyCanvas;
let rContext;
let mContext;

function renderCanvas(reportData) {
    reportCanvas = document.querySelector("#report-canvas");
    rContext = reportCanvas.getContext("2d");
    monthlyCanvas = document.querySelector("#monthly-report-canvas");
    mContext = monthlyCanvas.getContext("2d");
    reportCanvas.width = reportCanvas.parentElement.parentElement.getClientRects()[0].width-52;
    monthlyCanvas.width = monthlyCanvas.parentElement.parentElement.getClientRects()[0].width-52;
    reportCanvas.height = (reportCanvas.parentElement.getClientRects()[0].width-50)*3/4;
    monthlyCanvas.height = (monthlyCanvas.parentElement.getClientRects()[0].width-50)*3/4;
    
    let textColor = getComputedStyle(document.body).getPropertyValue('--text-color');
    let strokeColor = getComputedStyle(document.body).getPropertyValue('--canvas-stroke');
    
    document.querySelector("#total-focus-time").innerHTML = (''+reportData.timeReport.TotalFocusTime/60/60).slice(0,4) +'h';
    document.querySelector("#total-done-sets").innerHTML = reportData.timeReport.TotalDoneSets;

    let dateReport = reportData.dateReport;
    dateReport.reverse()
    let maxLinesWeek = dateReport.slice(-7).reduce( (a, arr) => arr.DoneSets > a ? arr.DoneSets : a, 0) + 1; // find maximum done pomodoros of the last 7 days
    let maxLinesMonth = dateReport.reduce( (a, arr) => arr.DoneSets > a ? arr.DoneSets : a, 0) + 1; // find maximum done pomodoros of the last 30 days
    dateReport.reverse()

    rContext.font = "13px Poppins";
    mContext.font = "13px Poppins";
    
    if (window.innerWidth < 500) {
        // reportCanvas.style.width = (reportCanvas.parentElement.getClientRects()[0].width-50) + 'px';
        // reportCanvas.style.height = (reportCanvas.parentElement.getClientRects()[0].width-50)/4*3 + 'px';
        // reportCanvas.height = (reportCanvas.parentElement.getClientRects()[0].width-50)*3;
        reportCanvas.height = (reportCanvas.parentElement.getClientRects()[0].width-50)*3/4;
        monthlyCanvas.height = (monthlyCanvas.parentElement.getClientRects()[0].width-50)*3/4;
        
        rContext.font = "10px Poppins";
        
        mContext.font = "10px Poppins";
    }
    rContext.fillStyle = textColor;
    mContext.fillStyle = textColor;
    rContext.lineWidth = 0.4;
    mContext.lineWidth = 0.2;
    rContext.strokeStyle = strokeColor;
    mContext.strokeStyle = strokeColor;

    rContext.beginPath()
    for (let i = 1; i < maxLinesWeek; i++) {
        rContext.moveTo(reportCanvas.width/8,reportCanvas.height/maxLinesWeek*i);
        rContext.lineTo(reportCanvas.width, reportCanvas.height/maxLinesWeek*i)
        rContext.fillText(maxLinesWeek-i, reportCanvas.width/8-20, reportCanvas.height/maxLinesWeek*i)
    }
    dateReport.reverse()
    for (let j = 1; j < 8; j++) {
        rContext.moveTo(reportCanvas.width/8*j, reportCanvas.height)
        rContext.lineTo(reportCanvas.width/8*j, 0)
        try{
            rContext.fillText(dateReport.slice(-7)[j-1].Date.slice(-2), (reportCanvas.width/8*j+5), reportCanvas.height-5)
        } catch (err) {
            rContext.fillText('00', (reportCanvas.width/8*j+5), reportCanvas.height-5)
        }
    }
    dateReport.reverse()
    rContext.stroke()
    rContext.closePath()
    mContext.beginPath()
    for (let j = 1; j < 35; j++) {
        if (j > 2) {
            mContext.moveTo(monthlyCanvas.width/35*j, monthlyCanvas.height)
            mContext.lineTo(monthlyCanvas.width/35*j, 0)
        }
    }
    for (let i = 1; i < (maxLinesMonth+1); i++) {
        mContext.moveTo(monthlyCanvas.width/35*3,monthlyCanvas.height/(maxLinesMonth+1)*i);
        mContext.lineTo(monthlyCanvas.width, monthlyCanvas.height/(maxLinesMonth+1)*i)
        // mContext.fillText(maxLinesMonth-i, reportCanvas.width/8-20, reportCanvas.height/maxLinesWeek*i)
    }
    mContext.stroke()
    mContext.closePath()

    rContext.beginPath()    ///////
    rContext.lineWidth = 1.5;
    rContext.strokeStyle = "#ff0000"
    rContext.moveTo(reportCanvas.width/8, reportCanvas.height-1)
    dateReport.reverse()
    for (let i = 1; i < 8; i++) {
        try{
            rContext.lineTo(reportCanvas.width/8*i, reportCanvas.height/maxLinesWeek*(maxLinesWeek - dateReport.slice(-7)[i-1].DoneSets)-1)
        } catch (err){
            rContext.lineTo(reportCanvas.width/8*i, reportCanvas.height-1)
        }
    }
    dateReport.reverse()
    rContext.stroke()
    rContext.closePath()    ///////
    
    mContext.beginPath()
    mContext.lineWidth = 1.5;
    mContext.strokeStyle = "#ff0000"
    for (let j = 1; j < 35; j++) {
        if (j > 2) {
            if (34 - dateReport.length < j) {
                mContext.lineTo(monthlyCanvas.width/35*j, monthlyCanvas.height/(maxLinesMonth)*(maxLinesMonth - dateReport[34-j].DoneSets)-1)
            }else {
                mContext.lineTo(monthlyCanvas.width/35*j, monthlyCanvas.height-2)
            }
        }
    }
    mContext.stroke()
    mContext.closePath()

    
    rContext.save()
    rContext.rotate(-Math.PI / 2);
    rContext.fillText("Done Sets", (window.innerWidth < 500? -110:-170), (window.innerWidth < 500? 11:15))
    rContext.restore()
    rContext.fillText("Date", 7, reportCanvas.height-5)

    mContext.fillText("0", 25, monthlyCanvas.height-5)
    mContext.fillText("today", monthlyCanvas.width-(window.innerWidth < 500? 32:42), monthlyCanvas.height-5)
    mContext.fillText(maxLinesMonth-1, 20, monthlyCanvas.height/maxLinesMonth)

    mContext.save()
    mContext.rotate(-Math.PI / 2);
    mContext.fillText("Done Sets", (window.innerWidth < 500? -120:-180), 15)
    mContext.restore()
}


let box = document.getElementById("report-canvas");
function updateDisplay(event) {
  let x = event.pageX - reportCanvas.getClientRects()[0].x;  // get X mouse cords on on the report canvas
  let y = event.pageY - reportCanvas.getClientRects()[0].y;  // get Y mouse cords on on the report canvas
//   console.log({x,y})
}
box.addEventListener("mousemove", updateDisplay, false);
box.addEventListener("mouseenter", updateDisplay, false);
box.addEventListener("mouseleave", updateDisplay, false);