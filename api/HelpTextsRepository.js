/* eslint-disable import/extensions */
import createRepository from '~/api/Repository'
import FakeHelpTextsRepository from '~/api/mocks/FakeHelpTextsRepository'

export default class HelpTextsRepository {
  constructor(ctx) {
    this.axios = ctx.$axios
    this.settings = ctx.$endpointSettings
  }

  build() {
    const repositoryWithAxios = createRepository(this.axios)

    return process.env.NODE_ENV === 'local' ?
      new FakeHelpTextsRepository() :
      repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${this.settings.HELPTEXT_API}`)
  }
}
