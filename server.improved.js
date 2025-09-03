const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

const appdata = [
  { "album": "Call Me If You Get Lost: The Estate Sale", "artist": "Tyler, the Creator", "year": 2021, "songs": 24 },
  { "album": "Igor", "artist": "Tyler, the Creator", "year": 2019, "songs": 12 },
  { "album": "Chromakopia", "artist": "Tyler, the Creator", "year": 2024, "songs": 14}
]

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
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

  request.on( "end", () => {
    const newAlbum = JSON.parse(dataString)
    appdata.push(newAlbum)

    response.writeHead( 200, {"Content-Type": "application/json" })
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
