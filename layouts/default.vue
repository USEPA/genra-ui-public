<template>
  <div>
    <transition enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutUp" mode="out-in">
      <Header v-if="showEpaHeader" />
    </transition>
    <NavBar />
    <Nuxt />
    <!-- Add white space if epa header active and genra flow not started -->
    <div v-if="showEpaHeader && currentStep < 1" style="height: 300px; width: 100%" />
    <transition enter-active-class="animate__animated animate__fadeInUp" leave-active-class="animate__animated animate__fadeOutDown" mode="out-in">
      <Footer v-if="showEpaHeader" />
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'
import NavBar from '~/components/UI/NavBar.vue'
import Footer from '~/components/UI/Footer.vue'
import Header from '~/components/UI/Header.vue'


export default {
  components: {
    NavBar,
    Footer,
    Header,
  },
  computed: {
    ...mapGetters({
      showEpaHeader: 'getShowEpaHeader',
      currentStep: 'getStep',
    }),
  },
}
</script>

<style>
html {
  font-family:
  BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  height: 100%;
  min-height: 100%
}
body {
  min-height: 100%
}
#header-footer-toast {
  margin-top: 10%
}
</style>
