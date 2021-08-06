    
// var requestURL = "./data.json";
// const request = new XMLHttpRequest();
// request.open('GET', requestURL);
// request.responseType = "json";
// request.send();

// request.addEventListener("load", function(){
//     console.log(request.response)
// })


// const fs = require("fs");
// let output = fs.createWriteStream("numbers.txt");
// for(let i = 0; i < 100; i++) {
// output.write(`${i}\n`);
// }
// output.end();

// // const fs = require("fs");

// let text = fs.readFileSync("data.json", "utf8")
// console.log(text)



const settingsCont = document.getElementById("settingsCont"),
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




var userWorkTime = 1500,
    userBreakTime = 300,
    userLongBreakTime = 900;

function changeTime() { 
  userWorkTime = document.querySelector("#pomodoroTime").value*60;
  userBreakTime = document.querySelector("#breakTime").value*60;
  userLongBreakTime = document.querySelector("#longBreakTime").value*60;
  document.querySelector("#pomodoroTimeMin").innerHTML =  document.querySelector("#pomodoroTime").value;
  document.querySelector("#breakTimeMin").innerHTML =  document.querySelector("#breakTime").value;
  document.querySelector("#longBreakTimeMin").innerHTML =  document.querySelector("#longBreakTime").value;
  stop()
  saveData()
}
function saveData(){
  let timeData = {};
  timeData.uWTime = userWorkTime;
  timeData.uBTime = userBreakTime;
  timeData.uLBTime = userLongBreakTime;
  localStorage.setItem("timeData", JSON.stringify(timeData))
}

function restoreData(){
  let restoredTimeData = JSON.parse(localStorage.getItem("timeData"));
  document.querySelector("#time").innerHTML = `${("0" + Math.floor(workTime%86400%3600/60)).slice(-2)}:${("0" + workTime%86400%3600%60).slice(-2)}`;
  document.querySelector("#pomodoroTime").value = restoredTimeData.uWTime/60;
  document.querySelector("#breakTime").value = restoredTimeData.uBTime/60;
  document.querySelector("#longBreakTime").value = restoredTimeData.uLBTime/60;
  changeTime()
}