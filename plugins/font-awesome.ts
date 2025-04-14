// eslint-disable-next-line import/no-extraneous-dependencies
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
// eslint-disable-next-line import/no-extraneous-dependencies
import {library} from '@fortawesome/fontawesome-svg-core'
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  faPlusCircle,
  faMinusCircle,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import {defineNuxtPlugin, Context} from '#app'

export default defineNuxtPlugin((nuxtApp: Context) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)

  library.add(faPlusCircle)
  library.add(faMinusCircle)
  library.add(faChevronDown)
  library.add(faChevronUp)
})
