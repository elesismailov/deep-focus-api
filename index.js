

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
      })
    } else if (request.url === "/saveSessionData") {
      let body = '';
      request.on("data", c => {
        body += c
      });
      request.on("end", () => {
        body = JSON.parse(body)
        db = new sqlite3.Database('./db/data.db', sqlite3.OPEN_READWRITE, (err) => {if (err) throw err;});
        db.get("SELECT * FROM dateReport ORDER BY id DESC", (err, row) => {
          if (row.Date === body.date) {
            db.run(`UPDATE dateReport SET 
              TotalFocusTime = TotalFocusTime + ${body.sessionTime}, 
              DoneSets = DoneSets + ${body.doneSets} 
              WHERE id = ${row.id}`)
          } else {
            db.run(`INSERT INTO dateReport(
              id,
              Date,
              TotalFocusTime,
              DoneSets)
              VALUES(${row.id +1}, '${body.date}', ${body.sessionTime}, ${body.doneSets})`)
          }
        })
        db.run(`UPDATE timeData SET TotalFocusTime = TotalFocusTime + ${body.sessionTime}`)
        db.run(`UPDATE timeData SET TotalDoneSets = TotalDoneSets + ${body.doneSets}`)
        db.close()
      })
    }
  } else if (request.method == "GET") {
    if (request.url === "/restoreTimeData") {
      db = new sqlite3.Database('./db/data.db', sqlite3.OPEN_READWRITE, (err) => {if (err) throw err;});
      db.get(`SELECT * FROM timeData`, (err, rows) => {
        response.writeHead(200, {"Content-Type": "application/json"})
        response.write(JSON.stringify(rows))
        response.end()
        db.close()
      })
    } else if (request.url === "/get-report-data") {
      db = new sqlite3.Database('./db/data.db', sqlite3.OPEN_READWRITE, (err) => {if (err) throw err;});
      db.all(`SELECT * FROM dateReport ORDER BY id DESC LIMIT 30`, (err, rows) => {
        // response.write(JSON.stringify({dateReport: rows}))
        db.get(`SELECT TotalFocusTime, TotalDoneSets FROM timeData`, (err, row) => {
          response.writeHead(200, {"Content-Type": "application/json"})
          response.write(JSON.stringify({dateReport: rows, timeReport: row}))
          response.end()
          db.close()
        })
      })
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