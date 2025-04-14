/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import helpTextsJSON from '~/assets/fixtures/helpTexts.json'

export default class FakeHelpTextsRepository {
  async index(params) {
    console.log('Fake Help Text repo: ', params)
    return Promise.resolve(helpTextsJSON)
  }
}
