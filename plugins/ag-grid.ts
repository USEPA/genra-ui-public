/* eslint-disable import/no-duplicates */
import {AgGridVue} from 'ag-grid-vue'

import 'ag-grid-enterprise'
// eslint-disable-next-line no-duplicate-imports
import {LicenseManager} from 'ag-grid-enterprise'
import {defineNuxtPlugin, Context} from '#app'

export default defineNuxtPlugin((nuxtApp: Context) => {
  LicenseManager.setLicenseKey('CompanyName=United States Environmental Protection Agency,LicensedGroup=Wade Slate,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-030324,SupportServicesEnd=3_December_2024_[v2]_MTczMzE4NDAwMDAwMA==fdf9944cbd70383b5fad44ca373062a0')

  nuxtApp.vueApp.component('ag-grid-vue', AgGridVue)
})
