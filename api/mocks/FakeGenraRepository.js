/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import helpTextsJSON from '~/assets/fixtures/helpTexts.json'

export default class FakeGenraRepository {
  async index(params) {
    console.log('Fake Genra repo: ', params)
    return Promise.resolve(helpTextsJSON)
  }

  async getNeighbors(params) {
    console.log('Fake Genra repo (getNeighbors): ', params)
    return Promise.resolve([
      {
        dtxsid: 'DTXSID7020182',
        dtxcid: 'DTXCID30182',
        value: 1,
        name: 'Bisphenol A',
        selected: true,
        weight: 228.29100036621094,
      },
      {
        dtxsid: 'DTXSID8021771',
        dtxcid: 'DTXCID001771',
        value: 0.4838709677419355,
        name: '4-(2-Methylbutan-2-yl)phenol',
        selected: true,
        weight: 164.2480010986328,
      },
      {
        dtxsid: 'DTXSID9022360',
        dtxcid: 'DTXCID602360',
        value: 0.45454545454545453,
        name: '4-(1,1,3,3-Tetramethylbutyl)phenol',
        selected: true,
        weight: 206.329,
      },
      {
        dtxsid: 'DTXSID3020465',
        dtxcid: 'DTXCID10465',
        value: 0.29411764705882354,
        name: 'Diethylstilbestrol',
        selected: true,
        weight: 268.3559875488281,
      },
      {
        dtxsid: 'DTXSID4022529',
        dtxcid: 'DTXCID402529',
        value: 0.2777777777777778,
        name: 'Methylparaben',
        selected: true,
        weight: 152.1490020751953,
      },
      {
        dtxsid: 'DTXSID2020006',
        dtxcid: 'DTXCID606',
        value: 0.2777777777777778,
        name: 'Acetaminophen',
        selected: true,
        weight: 151.1649932861328,
      },
      {
        dtxsid: 'DTXSID6020220',
        dtxcid: 'DTXCID60220',
        value: 0.2777777777777778,
        name: 'tert-Butylhydroquinone',
        selected: true,
        weight: 166.22000122070312,
      },
      {
        dtxsid: 'DTXSID0021834',
        dtxcid: 'DTXCID201834',
        value: 0.2647058823529412,
        name: '4-Nitrophenol',
        selected: true,
        weight: 139.11000061035156,
      },
      {
        dtxsid: 'DTXSID5021124',
        dtxcid: 'DTXCID501124',
        value: 0.25925925925925924,
        name: 'Phenol',
        selected: true,
        weight: 94.11299896240234,
      },
      {
        dtxsid: 'DTXSID5044495',
        dtxcid: 'DTXCID3024495',
        value: 0.2564102564102564,
        name: '4-(4-Hydroxyphenyl)butan-2-one',
        selected: true,
        weight: 164.20399475097656,
      },
      {
        dtxsid: 'DTXSID3052858',
        dtxcid: 'DTXCID0031269',
        value: 0.25,
        name: 'Isopropylparaben',
        selected: true,
        weight: 180.2030029296875,
      },
    ])
  }
}
