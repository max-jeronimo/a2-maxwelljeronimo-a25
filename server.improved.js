const http = require( "http" ),
      fs   = require( "fs" ),
      path = require( "path")

const DATA_FILE = path.join(__dirname, "data.json")
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" )
      dir  = "public/"
      port = 3000

let appdata = []
try {
  if (fs.existsSync(DATA_FILE)) {
    appdata = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
  }
} catch (err) {
  console.error("Error loading data file:", err)
  appdata = []
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appdata, null, 2))
  } catch (err) {
    console.error("Error saving data file:", err)
  }
}

function makeSlug(vinyl, artist) {
  return `${vinyl.toLowerCase().replace(/\s+/g, "-")}-${artist.toLowerCase().replace(/\s+/g, "-")}`
}

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" && request.url === "/submit" ){
    handlePost( request, response )
  } else if (request.method === "POST" && request.url === "/update") {
    handleUpdate(request, response)
  } else if (request.method === "POST" && request.url === "/delete") {
    handleDelete(request, response)
  } else {
    response.writeHead(404)
    response.end("404 Error: Not Found")
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if (request.url === "/results") {
    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
    }
  else if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", chunk => dataString += chunk )

  request.on("end", () => {
    const newVinyl = JSON.parse(dataString)
    const slug = makeSlug(newVinyl.vinyl, newVinyl.artist)

    if (appdata.find (v => v.slug === slug)) {
      response.writeHead(400, {"Content-Type": "application/json"})
      response.end(JSON.stringify({error: "This Vinyl already exists"}))
      return
    }

    const record = {
      vinyl: newVinyl.vinyl,
      artist: newVinyl.artist,
      owned: Boolean(newVinyl.owned),
      link: newVinyl.owned ? "": (newVinyl.link || ""),
      slug,
      dateAdded: new Date().toISOString()
    }
    appdata.push(record)
    saveData()

    response.writeHead( 200, {"Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  })
}

const handleUpdate = function( request, response ) {
  let dataString = ""

  request.on("data", chunk => dataString += chunk)

  request.on("end", () => {
    const updated = JSON.parse(dataString)
    const index = appdata.findIndex(v => v.slug === updated.slug)

    if (index !== -1) {
      appdata[index].vinyl = updated.vinyl
      appdata[index].artist = updated.artist
      appdata[index].owned = updated.owned
      appdata[index].link = updated.owned ? "" : updated.link
      appdata[index].slug = makeSlug(updated.vinyl, updated.artist)
      saveData()
    }

    response.writeHead (200, {"Content-Type": "application/json"})
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function ( request, response ) {
  let dataString = ""

  request.on("data", chunk => dataString += chunk)

  request.on("end", () => {
    const { slug } = JSON.parse(dataString)
    appdata =  appdata.filter (v => v.slug !== slug)
    saveData()

    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

server.listen( process.env.PORT || port )
