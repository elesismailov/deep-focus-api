

const http = require("http");
const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();


let db;


const server = http.createServer((request, response) => {
  if (request.method == "POST"){

    if (request.url === "/saveTimerData") {
      let body = '';
      request.on('data', chunk => {
          body += chunk;
      });
      request.on("end", ()=>{
        body = JSON.parse(body)
        db = new sqlite3.Database('./db/data.db', sqlite3.OPEN_READWRITE, (err) => {if (err) throw err;});
        
        db.run(`UPDATE timeData SET UserWorkTime = ${body.userWorkTime}`)
        db.run(`UPDATE timeData SET UserBreakTime = ${body.userBreakTime}`)
        db.run(`UPDATE timeData SET UserLongBreakTime = ${body.userLongBreakTime}`)

        db.close()
        // save this body to data.json
      })
    } else if (request.url === "/saveSessionData") {
      let body = '';
      request.on("data", c => {
        body += c
      });
      request.on("end", () => {
        body = JSON.parse(body)
        db = new sqlite3.Database('./db/data.db', sqlite3.OPEN_READWRITE, (err) => {if (err) throw err;});
        
        db.run(`UPDATE timeData SET TotalFocusTime = TotalFocusTime + ${body.sessionTime}`)
        db.run(`UPDATE timeData SET TotalDoneSets = TotalDoneSets + ${body.doneSets}`)

        db.close()
      })
    }
  } else if (request.method == "GET") {
    if (request.url === "/restoreTimeData") {
      response.writeHead(200, {"Content-Type": "application/json"})
      db = new sqlite3.Database('./db/data.db', sqlite3.OPEN_READWRITE, (err) => {if (err) throw err;});
      db.get(`SELECT * FROM timeData`, (err, rows) => {
        response.write(JSON.stringify(rows))
        response.end()
      })
      db.close()
    } else if (request.url === "/get-report-data") {
      response.writeHead(200, {"Content-Type": "application/json"})
      db = new sqlite3.Database('./db/data.db', sqlite3.OPEN_READWRITE, (err) => {if (err) throw err;});
      db.all(`SELECT * FROM dateReport ORDER BY id DESC LIMIT 30`, (err, rows) => {
        response.write(JSON.stringify({dateReport: rows}))
        response.end()
      })
      db.close()
    } else{
 
    let filePath = path.join(
      __dirname, "public", request.url === "/" ? "index.html" : request.url
    );
    let extname = path.extname(filePath);
    let contentType = "text/html";
    switch (extname) {
      case ".js":      contentType = "text/javascript";      break;
      case ".css":      contentType = "text/css";      break;
      case ".json":      contentType = "application/json";      break;
      case ".png":      contentType = "image/png";      break;
      case ".jpg":      contentType = "image/jpg";      break;
    }
    if (contentType == "text/html" && extname == "") filePath += ".html";
    fs.readFile(filePath, (err, content)=>{
      // response.writeHead(200, {"Content-Type": "text/html"})
      response.end(content, contentType)
    })}
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
	console.log("Server's running on:");
  console.log(`http://localhost:${PORT}/`);
})