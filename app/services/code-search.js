import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Service.extend({
  apiAjax: inject.service(),

  store: inject.service(),

  addonData: computed(function() {
    return this.get('store').peekAll('addon').sortBy('score').reverse().map(function(addon) {
      return {
        name: addon.get('name'),
        addon
      };
    });
  }),

  addons(query) {
    return this.get('apiAjax').request('/search/addons', {
      data: {
        query
      }
    }).then((response) => {
      let addons = [];
      response.results.forEach((item) => {
        let addonData = this.get('addonData').findBy('name', item.addon);
        if (addonData) {
          addons.pushObject({ addon: addonData.addon, count: item.count });
        }
      });
      return addons;
    });
  },

  usages(addon, query) {
    return this.get('apiAjax').request('/search/source', {
      data: {
        addon, query
      }
    }).then((response) => {
      return response.results;
    });
  }
});
