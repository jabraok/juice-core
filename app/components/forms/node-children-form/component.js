import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import { unitTypes } from 'juice-core/constants/unit-conversions';

export default Component.extend({
  uoms: unitTypes,
  showCreateIngredient: false,

  startCreateIngredient(newName) {
    this.set('tempIngredientName', newName);
    this.set('showCreateIngredient', true);
  },

  actions: {
    search(q, data) {
      const reg = new RegExp(q, "i");
      const matches = data.options.filter(n => reg.test(n.get('label')));

      if(isEmpty(matches)) {
        return [
          {
            label:`${q} not found, create it...`,
            stashedName: q,
            action:'createIngredient'
          }
        ]
      } else {
        return matches;
      }
    },

    cancelCreateIngredient() {
      this.set('showCreateIngredient', false);
    },

    createIngredient() {
      this.get('createAndAddNode')('ingredient', this.get('newIngredientName'), this.get('newIngredientUom'));
      this.set('showCreateIngredient', false);
    },

    handleSelect(option) {
      if(option.action === "createIngredient") {
        this.startCreateIngredient(option.stashedName);
      } else {
        this.get('addNode')(option);
      }
    }
  }
});
