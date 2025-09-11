// FRONT-END (CLIENT) JAVASCRIPT HERE

function renderHTMLRow(item) {
  return `
    <td class="cellVinyl">${escapeHtml(item.vinyl)}</td>
    <td class="cellArtist">${escapeHtml(item.artist)}</td>
    <td class="cellOwned">${item.owned ? "✅" : "❌"}</td>
    <td class="cellLink">${item.link ? `<a href="${escapeAttr(item.link)}" target="_blank">Buy</a>` : ""}</td>
    <td class="cellActions">
      <button class="editButton" data-slug="${escapeAttr(item.slug)}">Edit</button>
      <button class="deleteButton" data-slug="${escapeAttr(item.slug)}">Delete</button>
    </td>
  `
}


function escapeHtml(s) {
  return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
}

function escapeAttr(s) {
  return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#39;")
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
}

let currentlyEditing = null

const displayResults = async function () {
  try {
    const response = await fetch("/results")
    const data = await response.json()

    const tbody = document.querySelector("#results-table tbody")
    if (!tbody) return

    tbody.innerHTML = ""
    data.forEach(item => {
      const tr = document.createElement("tr")
      tr.dataset.slug = item.slug
      tr.innerHTML = renderHTMLRow(item)
      tr.dataset.original = JSON.stringify(item)
      tbody.appendChild(tr)
    })


    tbody.onclick = async function(e) {
      const btn = e.target
      const tr = btn.closest("tr")
      if (!tr) return


      if (btn.matches(".editButton")) {
        if (currentlyEditing && currentlyEditing !== tr) {
          alert("Finish or cancel the other edit first.")
          return
        }
        currentlyEditing = tr

        const item = JSON.parse(tr.dataset.original)
        tr.innerHTML = `
          <td><input class="input-vinyl" value="${escapeAttr(item.vinyl)}"></td>
          <td><input class="input-artist" value="${escapeAttr(item.artist)}"></td>
          <td><input class="input-owned" type="checkbox" ${item.owned ? "checked" : ""}></td>
          <td>
            <div class="link-edit-field" style="${item.owned ? "display:none;" : ""}">
                <input class="input-link" value="${escapeAttr(item.link || "")}">
            </div>
           </td>

          <td>
            <button class="saveButton" data-slug="${escapeAttr(item.slug)}">Save</button>
            <button class="cancelButton">Cancel</button>
          </td>
        `
        tr.querySelector(".input-vinyl").focus()

        const ownedInput = tr.querySelector(".input-owned")
        const linkField = tr.querySelector(".link-edit-field")
        const linkInput = tr.querySelector(".input-link")

        ownedInput.addEventListener("change", () => {
          if (ownedInput.checked) {
            linkField.style.display = "none"
            linkInput.value = ""
          } else {
            linkField.style.display = "block"
          }
        })


        return
      }


      if (btn.matches(".saveButton")) {
        const slug = btn.dataset.slug
        const vinylVal = tr.querySelector(".input-vinyl").value.trim()
        const artistVal = tr.querySelector(".input-artist").value.trim()
        const ownedChecked = tr.querySelector(".input-owned").checked
        const linkVal = tr.querySelector(".input-link").value.trim()

        const original = JSON.parse(tr.dataset.original)

        const updated = {
          slug: slug,
          vinyl: vinylVal !== "" ? vinylVal : original.vinyl,
          artist: artistVal !== "" ? artistVal : original.artist,
          owned: ownedChecked,
          link: linkVal !== "" ? linkVal : original.link
        }

        await fetch("/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated)
        })

        currentlyEditing = null
        displayResults()
        return
      }

      if (btn.matches(".cancelButton")) {
        const original = JSON.parse(tr.dataset.original)
        tr.innerHTML = renderHTMLRow(original)
        tr.dataset.original = JSON.stringify(original)
        currentlyEditing = null
        return
      }

      if (btn.matches(".deleteButton")) {
        const slug = btn.dataset.slug
        const actionCell = tr.querySelector(".cellActions")
        actionCell.innerHTML = `
          <span>Delete "${escapeHtml(tr.querySelector(".cellVinyl").textContent)}"?</span>
          <button class="confirmDelete" data-slug="${escapeAttr(slug)}">Yes</button>
          <button class="cancelDelete">No</button>
        `
        return
      }

      if (btn.matches(".confirmDelete")) {
        const slug = btn.dataset.slug
        await fetch("/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug })
        })
        displayResults()
        return
      }

      if (btn.matches(".cancelDelete")) {
        const original = JSON.parse(tr.dataset.original)
        tr.innerHTML = renderHTMLRow(original)
        tr.dataset.original = JSON.stringify(original)
      }
    }

  } catch (err) {
    console.error("Error in getting the results from the server:", err)
  }
}


const submit = async function( event ) {
  event.preventDefault()


  const vinylInput = document.querySelector("#vinyl")
  const artistInput = document.querySelector("#artist")
  const ownedInput = document.querySelector("#owned")
  const linkInput = document.querySelector("#link")

  const json = {
    vinyl: vinylInput.value,
    artist: artistInput.value,
    owned: ownedInput.checked,
    link: ownedInput.checked ? "" : linkInput.value
  }

  const response = await fetch("/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(json)

  })

  const updatedData = await response.json()
  console.log("Updated data:", updatedData)

  displayResults()


  vinylInput.value = ''
  artistInput.value = ''
  ownedInput.checked = false
  linkInput.value = ''
}


const ownedCheckbox = document.getElementById("owned");
const linkField = document.getElementById("link-field");
const linkInput = document.getElementById("link");

if (ownedCheckbox && linkField && linkInput) {
  ownedCheckbox.addEventListener("change", () => {
    if (ownedCheckbox.checked) {
      linkField.style.display = "none";
      linkInput.value = "";
    } else {
      linkField.style.display = "block";
    }
  });
}


window.onload = function() {
  const form = document.querySelector("#vinylForm");
  if (form) {
    form.onsubmit = submit
  }
  const resultsTable = document.querySelector("#results-table")
    if (resultsTable) {
      displayResults()
    }
}