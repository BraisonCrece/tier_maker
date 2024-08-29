const HOST = "http://localhost:3000"

async function request(method, path, body) {
  try {
    const response = await fetch(`${HOST}${path}`, {
      method: method,
      body: body,
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error("Error: " + response.error)
    }

    const data = await response.json()
    console.log(data)

    return data
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

async function createTier(name, items) {
  const formData = new FormData()
  formData.append("tier_list[name]", name)

  items.forEach(file => {
    formData.append(`tier_list[images][]`, file)
  })

  return await request("POST", "/tier_lists", formData)
}

function getTierLists() {
  return request("GET", "/tier_lists")
}

function updateTier(tierId, name, items) {
  const formData = new FormData()
  formData.append("tier_list[name]", name)

  items.forEach(file => {
    formData.append(`tier_list[images][]`, file)
  })

  return request("PATCH", `/tier_lists/${tierId}`, formData)
}

function deleteTier(tierId) {
  return request("DELETE", `/tier_lists/${tierId}`)
}

export { createTier, getTierLists, updateTier, deleteTier }
