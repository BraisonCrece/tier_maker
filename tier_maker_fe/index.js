import {
  createTier,
  getTierLists,
  updateTier,
  deleteTier
} from "./javascript/tierCrudFunctions.js"

const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)
const log = element => console.log(element)

const imageInput = $("#image-input")
const itemsSection = $("#selector-items")
const resetButton = $("#reset")
const headerColumn = $("#header-column")
const tierBody = $(".rows")
const shadowRightBox = $("#shadow-right")
const rows = $$(".tier .row")
const saveButton = $("#save")

const ITEMS_PER_ROW_BEFORE_SCROLL = 7
const IMAGE_WIDTH = 50

let draggedElement = null
let sourceContainer = null

let defaultRowWidth = ITEMS_PER_ROW_BEFORE_SCROLL * IMAGE_WIDTH

saveButton.addEventListener("click", () => {
  const items = $$(".item-image")
  createTier(items)
})

resetButton.addEventListener("click", reset)
tierBody.addEventListener("scroll", applyScrolledShadow)
itemsSection.addEventListener("drop", handleDrop)
itemsSection.addEventListener("drop", handleDropFromDesktop)
itemsSection.addEventListener("dragover", handleDragOver)
itemsSection.addEventListener("dragover", handleDragOverFromDesktop)
itemsSection.addEventListener("dragleave", handleDragLeave)

rows.forEach(row => {
  row.addEventListener("drop", handleDrop)
  row.addEventListener("dragover", handleDragOver)
  row.addEventListener("dragleave", handleDragLeave)
})

imageInput.addEventListener("change", e => {
  addImagesFromInput(e.target)
})

function setRowsWidth(width) {
  rows.forEach(row => {
    row.style.width = `${width}px`
  })
}

function removeShadows() {
  headerColumn.classList.remove("floating-shadow-left")
  shadowRightBox.classList.remove("floating-shadow-right")
}

function hasHorizontalOverflow(element) {
  return element.scrollWidth > element.clientWidth
}

function applyScrolledShadow() {
  if (hasHorizontalOverflow(tierBody)) {
    headerColumn.classList.toggle(
      "floating-shadow-left",
      tierBody.scrollLeft > 0
    )

    shadowRightBox.classList.toggle(
      "floating-shadow-right",
      tierBody.scrollLeft + tierBody.clientWidth < tierBody.scrollWidth
    )
  }
}

function reset() {
  const items = $$(".tier .item-image")
  items.forEach(item => {
    item.remove()
    itemsSection.appendChild(item)
  })
  setRowsWidth(defaultRowWidth)
  removeShadows()
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
  const imageElement = createItem(src)

  currentTarget.appendChild(imageElement)
  sourceContainer.removeChild(draggedElement)
  currentTarget.classList.remove("drag-over")
  removePreviewElemet(currentTarget)

  const largestRowWidth = getLargestRowWidth()

  const currentMaxWidth = Math.max(largestRowWidth, defaultRowWidth)
  setRowsWidth(currentMaxWidth)
  imageElement.scrollIntoView({ behavior: "smooth", block: "nearest" })

  if (!(largestRowWidth > defaultRowWidth)) {
    removeShadows()
  }
}

function getLargestRowWidth() {
  return Math.max(
    ...Array.from(rows).map(row => row.children.length * IMAGE_WIDTH)
  )
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
