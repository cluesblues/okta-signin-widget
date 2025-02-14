import { loc } from 'okta';
import { BaseForm, BaseView } from '../../internals';

const Body = BaseForm.extend({

  title() {
    return loc('oie.device.code.activated.title', 'login');
  },

  subtitle() {
    return loc('oie.device.code.activated.subtitle', 'login');
  },

  events: {
    'keyup input[name="userCode"]': function(e) {
      e.preventDefault();
      this.addHyphen(e);
    }
  },

  addHyphen(evt) {
    const currentVal = evt.target.value;
    // add hyphen after 4th character
    if (currentVal && currentVal.length === 4 && !['Backspace', 'Delete', '-'].includes(evt.key)) {
      evt.target.value = currentVal.concat('-');
    }
  }
});

export default BaseView.extend({
  Body
});
