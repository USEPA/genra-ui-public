export default {
  async getSetup(vueContext, {chem_id: chemId, flags}) {
    try {
      const setupParams = {
        ...vueContext.rootGetters.getParams,
        chem_id: chemId,
        ...(flags && {flags}),
      }
      const setupObj = await this.$repositories.genra.getSetup(setupParams)
      return setupObj
    } catch (err) {
      return err
    }
  },
}
