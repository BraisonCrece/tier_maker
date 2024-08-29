const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)
const log = element => console.log(element)
const itemsSection = $("#selector-items")
const imageInput = $("#image-input")

let draggedElement = null
let sourceContainer = null

itemsSection.addEventListener("drop", handleDropFromDesktop)
itemsSection.addEventListener("dragover", handleDragOverFromDesktop)
itemsSection.addEventListener("dragleave", handleDragLeaveFromDesktop)

itemsSection.addEventListener("dragstart", handleDragStart)
itemsSection.addEventListener("dragover", handleDragOverSort)
itemsSection.addEventListener("drop", handleDropSort)

imageInput.addEventListener("change", e => {
  addImagesFromInput(e.target)
})

function handleDragStart(e) {
  draggedElement = e.target
}

function handleDragOverSort(e) {
  e.preventDefault()
  if (e.target.classList.contains("item-container")) {
    e.target.style.outline = "2px dashed #ccc"
  }
}

function handleDropSort(e) {
  e.preventDefault()
  if (e.target.classList.contains("item-container")) {
    e.target.style.border = ""
    itemsSection.insertBefore(draggedElement, e.target)
    draggedElement = null
  }
}

function addImagesFromInput(input) {
  const { files } = input
  if (!files || !files.length) return

  Array.from(files).forEach(file => {
    if (!file.type.startsWith("image/")) {
      alert("Solo se pueden subir archivos de imagen.")
      return
    }

    const reader = new FileReader()

    reader.onload = e => {
      const item = createItem(e.target.result)
      itemsSection.appendChild(item)
      updatePlaceholderVisibility()
    }

    reader.readAsDataURL(file)
  })
}

function createItem(src) {
  const container = document.createElement("div")
  container.classList.add("item-container")
  container.style.position = "relative"

  const imageElement = document.createElement("img")
  imageElement.draggable = false
  imageElement.src = src
  imageElement.classList.add("item-image")

  const removeButton = document.createElement("button")
  removeButton.innerHTML = "✖"
  removeButton.classList.add("remove-button")
  removeButton.onclick = () => {
    container.remove()
    updatePlaceholderVisibility()
  }

  container.appendChild(imageElement)
  container.appendChild(removeButton)

  return container
}

function handleDragOverFromDesktop(e) {
  e.preventDefault()
  const { currentTarget } = e
  if (!e.dataTransfer.types.includes("Files")) return

  currentTarget.classList.add("drag-files-over")

  if (itemsSection.children.length === 0) {
    currentTarget.dataset.originalContent = currentTarget.innerHTML
    currentTarget.innerHTML = ""
  }
}

function handleDropFromDesktop(e) {
  e.preventDefault()
  const { currentTarget, dataTransfer } = e
  if (!dataTransfer.types.includes("Files")) return

  currentTarget.classList.remove("drag-files-over")

  const { files } = dataTransfer
  if (!files || !files.length) return

  addImagesFromInput({ files })
}

function handleDragLeaveFromDesktop(e) {
  e.preventDefault()
  const { currentTarget } = e
  currentTarget.classList.remove("drag-files-over")

  if (itemsSection.children.length === 0) {
    currentTarget.innerHTML = currentTarget.dataset.originalContent || ""
  }
}

function updatePlaceholderVisibility() {
  if (itemsSection.children.length > 0) {
    itemsSection.classList.add("has-items")
    itemsSection.style.setProperty("--before-content", "''")
  } else {
    itemsSection.classList.remove("has-items")
    itemsSection.style.setProperty(
      "--before-content",
      "'Arrastra las imágenes aquí o haz clic para subir'"
    )
  }
}
