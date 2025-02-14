import { View, _, loc } from 'okta';
import hbs from 'handlebars-inline-precompile';

const defaultLogo = '/img/logos/default.png';

const AdminConsentViewHeader = View.extend({
  className: 'consent-title detail-row',
  titleText: () => loc('oie.consent.admin.title', 'login'),
  hasIssuer: true,
  template: hbs`
    {{#if clientURI}}
    <a href="{{clientURI}}" class="client-logo-link" target="_blank">
    {{/if}}
    {{#if customLogo}}
      <img class="client-logo custom-logo" src="{{customLogo}}" alt="{{altText}}" aria-hidden="true" />
    {{else}}
      <img class="client-logo default-logo" src="{{defaultLogo}}" alt="{{altText}}" aria-hidden="true" />
    {{/if}}
    {{#if clientURI}}
      </a>
    {{/if}}
    <h1>
      <span class="title-text">
        <b>{{appName}}</b>&nbsp;{{titleText}}
      </span>
      {{#if issuer}}
        <div class="issuer"><span>{{issuer}}</span></div>
      {{/if}}
    </h1>`,
  getTemplateData: function() {
    const { appState } = this.options;
    const { label, clientUri, logo } =  appState.get('app');
    const { issuer: issuerObj } = appState.get('authentication');

    const customLogo = logo?.href;
    const altText = logo?.alt || 'aria logo';
    const appName = _.escape(label);
    const clientURI = clientUri?.href;

    const issuer = this.hasIssuer ? issuerObj?.uri : null;
    const titleText = this.titleText();

    return {
      customLogo,
      defaultLogo,
      clientURI,
      issuer,
      altText,
      appName,
      titleText,
    };
  }
});

export default AdminConsentViewHeader;
