import Axios from "axios"

const SERVER_API_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT + "/api/"

var axios = Axios.create({
  withCredentials: false,
})

export const httpService = {
  get(endpoint, data) {
    return ajax(endpoint, "GET", data)
  },
  post(endpoint, data) {
    return ajax(endpoint, "POST", data)
  },
  put(endpoint, data) {
    return ajax(endpoint, "PUT", data)
  },
  delete(endpoint, data) {
    return ajax(endpoint, "DELETE", data)
  },
}

async function ajax(endpoint, method = "GET", data = null) {
  try {
    const res = await axios({
      url: `${SERVER_API_ENDPOINT}${endpoint}`,
      method,
      data,
      params: method === "GET" ? data : null,
    })
    return res.data
  } catch (err) {
    console.log(
      `Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `,
      data
    )
    console.dir(err)
    if (err.response && err.response.status === 401) {
      sessionStorage.clear()
      window.location.assign("/")
    }
    throw err
  }
}
