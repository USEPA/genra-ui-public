export default {
  getHelpTexts(state) {
    return state.helpTexts
  },
  getByPageUrl: state => (input) => {
    let helpTexts = [...state.helpTexts]
    if (input !== '') {
      helpTexts = helpTexts.filter(message => message.helpTextId.toLowerCase() === input.toLowerCase())
    }
    return helpTexts[0]
  },
}
