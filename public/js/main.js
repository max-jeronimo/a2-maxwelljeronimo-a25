// FRONT-END (CLIENT) JAVASCRIPT HERE

const displayResults = async function () {
  try {
    const response = await fetch("/results")
    const data = await response.json()

    const tbody = document.querySelector("#results-table tbody")
    tbody.innerHTML = ""

    data.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
    <td>${item.album}</td>
    <td>${item.artist}</td>
    <td>${item.year}</td>
    <td>${item.songs}</td>
    `
      tbody.appendChild(tr)

    })
  } catch (err) {
    console.error("Error in getting the results from the server:", err)
  }
}

const submit = async function( event ) {
  event.preventDefault()


  const albumInput = document.querySelector("#album")
  const artistInput = document.querySelector("#artist")
  const yearInput = document.querySelector("#year")
  const songsInput = document.querySelector("#songs")

  const json = {
    album: albumInput.value,
    artist: artistInput.value,
    year: parseInt(yearInput.value),
    songs: parseInt(songsInput.value)
  }

  const body = JSON.stringify(json)

  const response = await fetch("/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(json)

  })

  await response.json()
  console.log("Updated dataset:", data)
  displayResults()


  albumInput.value = ''
  artistInput.value = ''
  yearInput.value = ''
  songInput.value = ''
}


window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
  displayResults()
}