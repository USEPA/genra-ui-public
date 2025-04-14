import helpTextsJSON from '~/assets/fixtures/helpTexts.json'

export default {
  helpTexts(vuexContext, context) {
    let errorObj = {}
    try {
      const result = helpTextsJSON
      // console.log(result)
      vuexContext.commit('setHelpTexts', result)
    } catch (e) {
      if (e.response) {
        errorObj = {
          status: e.response,
        }
      } else {
        errorObj = e
      }
    }
  },
}
