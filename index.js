

const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((request, response) => {

  // fs.readFile("./data.json", "utf8", (err, content)=>{
  //   console.log(JSON.parse(content))
  // })

  if (request.method == "POST"){

    if (request.url == "/saveTimeData") {

      console.log("hello url")
      let body = '';
      request.on('data', chunk => {
          body += chunk; // convert Buffer to string
      });
      request.on("end", ()=>{
        console.log(body)
        // save this body to data.json
      })

    }
  } else if (request.method == "GET") {
    if (request.url == "/restoreTimeData"){
      console.log("time data restored")
    }

    let filePath = path.join(
      __dirname, "public",   request.url === "/" ? "index.html" : request.url
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
    })
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
	console.log("Server running on port ", PORT);
})