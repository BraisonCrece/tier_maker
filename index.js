const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)
const log = element => console.log(element)

const imageInput = $("#image-input")
const itemsSection = $("#selector-items")
const resetButton = $("#reset")

let draggedElement = null
let sourceContainer = null

const rows = $$(".tier .row")

resetButton.addEventListener("click", reset)

imageInput.addEventListener("change", e => {
  addImagesFromInput(e.target)
})

rows.forEach(row => {
  row.addEventListener("drop", handleDrop)
  row.addEventListener("dragover", handleDragOver)
  row.addEventListener("dragleave", handleDragLeave)
})

itemsSection.addEventListener("drop", handleDrop)
itemsSection.addEventListener("dragover", handleDragOver)
itemsSection.addEventListener("dragleave", handleDragLeave)

itemsSection.addEventListener("drop", handleDropFromDesktop)
itemsSection.addEventListener("dragover", handleDragOverFromDesktop)

function reset() {
  const items = $$(".tier .item-image")
  items.forEach(item => {
    item.remove()
    itemsSection.appendChild(item)
  })
}

function addImagesFromInput(input) {
  const { files } = input
  if (!files || !files.length) return

  Array.from(files).forEach(file => {
    const reader = new FileReader()

    reader.onload = e => {
      itemsSection.appendChild(createItem(e.target.result))
    }

    reader.readAsDataURL(file)
  })
}

function createItem(src) {
  const imageElement = document.createElement("img")
  imageElement.draggable = true
  imageElement.src = src
  imageElement.classList.add("item-image")

  imageElement.addEventListener("dragstart", handleDragStart)
  imageElement.addEventListener("dragend", handleDragEnd)
  return imageElement
}

function addPreviewElement(target, draggedElement) {
  const previewElement = draggedElement.cloneNode(true)
  previewElement.classList.add("drag-preview")
  target.appendChild(previewElement)
}

function removePreviewElemet(target) {
  target.querySelector(".drag-preview")?.remove()
}

function handleDragStart(e) {
  draggedElement = e.target
  sourceContainer = draggedElement.parentNode
  e.dataTransfer.setData("text/plain", draggedElement.src)
}

function handleDragEnd() {
  draggedElement = null
  sourceContainer = null
}

function handleDrop(e) {
  e.preventDefault()

  const { currentTarget, dataTransfer } = e

  if (!draggedElement || !sourceContainer) return

  const src = dataTransfer.getData("text/plain")
  currentTarget.appendChild(createItem(src))
  sourceContainer.removeChild(draggedElement)
  currentTarget.classList.remove("drag-over")
  removePreviewElemet(currentTarget)
}

function handleDragOver(e) {
  e.preventDefault()

  const { currentTarget } = e

  if (!draggedElement || currentTarget === sourceContainer) return
  currentTarget.classList.add("drag-over")

  if (draggedElement && !currentTarget.querySelector(".drag-preview")) {
    addPreviewElement(currentTarget, draggedElement)
  }
}

function handleDragLeave(e) {
  e.preventDefault()

  const { currentTarget } = e
  currentTarget.classList.remove("drag-over")
  removePreviewElemet(currentTarget)
}

function handleDragOverFromDesktop(e) {
  e.preventDefault()
  const { currentTarget } = e
  if (!e.dataTransfer.types.includes("Files")) return

  currentTarget.classList.add("drag-files-over")
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
}
