import { View } from 'okta';
import hbs from 'handlebars-inline-precompile';


const ConsentViewFooter = View.extend({
  className: 'consent-footer',
  template: hbs(
    '\
      {{#if termsOfService}}\
        <a class="terms-of-service" href="{{termsOfService}}" target="_blank">\
          {{i18n code="consent.required.termsOfService" bundle="login"}}\
        </a>\
        {{#if privacyPolicy}}\
          &#8226\
        {{/if}}\
      {{/if}}\
      {{#if privacyPolicy}}\
        <a class="privacy-policy" href="{{privacyPolicy}}" target="_blank">\
          {{i18n code="consent.required.privacyPolicy" bundle="login"}}\
        </a>\
      {{/if}}\
    '
  ),
  getTemplateData: function() {
    const appState = this.options.appState;
    const app = appState.get('app');

    return {
      termsOfService: app.termsOfService && app.termsOfService.href,
      privacyPolicy: app.privacyPolicy && app.privacyPolicy.href,
    };
  },
});

export default ConsentViewFooter;
