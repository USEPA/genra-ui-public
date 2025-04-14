/* eslint-disable no-console */
export default $axios => resource => ({

  index(params) {
    try {
      const result = $axios.$get(`${resource}${params}`)
      return result
    } catch (err) {
      console.log('error: ', err)
      const errorMsg = `${err.message} - ${err.statusText}`
      return errorMsg
    }
  },

  find(id) {
    try {
      return $axios.$get(`${resource}?id=${id}`)
    } catch (err) {
      console.log('error: ', err)
      const errorMsg = `${err.message} - ${err.statusText}`
      return errorMsg
    }
  },

  show(id) {
    return $axios.$get(`${resource}/${id}`)
  },

  create(payload) {
    return $axios.$post(`${resource}`, payload)
  },
})
