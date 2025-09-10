// FRONT-END (CLIENT) JAVASCRIPT HERE

const displayResults = async function () {
  try {
    const response = await fetch("/results")
    const data = await response.json()

    const tbody = document.querySelector("#results-table tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    data.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.album}</td>
        <td>${item.artist}</td>
        <td>${item.year}</td>
        <td>${item.songs}</td>
        <td>
            <button class="editButton" data-album="${item.album}">Edit</button>
            <button class="deleteButton" data-album="${item.album}">Delete</button>
        </td>
      `
      tbody.appendChild(tr)
    })

    function renderHTMLRow(item) {
      return `
        <td class="cellAlbum>${escapeHtml(item.album)}</td>
        <td class="cellArtist>${escapeHtml(item.album)}</td>
        <td class="cellYear>${escapeHtml(item.album)}</td>
        <td class="cellSongs>${escapeHtml(item.album)}</td>
        <td class = "cellActions">
            button class="editButton" data-album="$(escapeAttr(item.album))">Edit</button>
            button class="deleteButton" data-album="$(escapeAttr(item.album))">Delete</button>
        ` </td>

       
    }

    document.querySelectorAll(".editButton").forEach(button => {
      button.onclick = async function () {
        const albumName = this.dataset.album
        const record = data.find(r => r.album === albumName)

        const newAlbum = prompt("Enter new album name:", record.album)
        const newArtist = prompt("Enter new artist:", record.artist)
        const newYear = prompt("Enter new year:", record.year)
        const newSongs = prompt("Enter new number of songs:", record.songs)

        const updated = {
          oldAlbum: albumName,
          album: newAlbum !== null && newAlbum.trim() !== "" ? newAlbum : record.album,
          artist: newArtist !== null && newArtist.trim() !== "" ? newArtist : record.artist,
          year: (newYear !== null && newYear.trim() !== "" && !isNaN(parseInt(newYear)))
              ? parseInt(newYear) : record.year,
          songs: (newSongs !== null && newSongs.trim() !== "" && !isNaN(parseInt(newSongs)))
        ? parseInt(newSongs) : record.songs
        }

        const response = await fetch("/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated)
        })

        await response.json()
        displayResults()
      }
    })

    document.querySelectorAll(".deleteButton").forEach(button => {
      button.onclick = async function () {
        const albumName = this.dataset.album
        if (!confirm(`Are you sure you want to delete "${albumName}"?`)) return

        const response = await fetch("/delete", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({album: albumName})
        })
        await response.json()
        displayResults()
      }
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

  const response = await fetch("/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(json)

  })

  const updatedData = await response.json()
  console.log("Updated data:", updatedData)

  displayResults()


  albumInput.value = ''
  artistInput.value = ''
  yearInput.value = ''
  songsInput.value = ''
}


window.onload = function() {
  const form = document.querySelector("#albumForm");
  if (form) {
    form.onsubmit = submit
  }
  const resultsTable = document.querySelector("#results-table")
    if (resultsTable) {
      displayResults()
    }
}