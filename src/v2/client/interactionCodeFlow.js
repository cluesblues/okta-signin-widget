/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import Enums from 'util/Enums';
import Errors from 'util/Errors';
import { toQueryString } from '@okta/okta-auth-js';

import { clearTransactionMeta } from './transactionMeta';

export async function interactionCodeFlow(settings, idxResponse) {
  const { interactionCode } = idxResponse;
  const authClient = settings.getAuthClient();
  const transactionMeta = authClient.transactionManager.load();
  const state = authClient.options.state || transactionMeta.state;

  // In remediation mode the transaction is owned by another client.
  const isRemediationMode = settings.get('mode') === 'remediation';
  
  // server-side applications will want to received interaction_code as a query parameter
  // this option can also be used to force a redirect for client-side/SPA applications
  const shouldRedirect = settings.get('redirect') === 'always';
  if (shouldRedirect) {
    const redirectUri = settings.get('redirectUri');
    if (!redirectUri) {
      throw new Errors.ConfigError('"redirectUri" is required');
    }
    const qs = toQueryString({ 'interaction_code': interactionCode, state });
    window.location.assign(redirectUri + qs);
    return;
  }
  
  // Return a promise (or call success callback) to client-side apps in remediation mode.
  if (isRemediationMode) {
    settings.callGlobalSuccess(Enums.SUCCESS, {
      'interaction_code': interactionCode,
      state
    });
    return;
  }

  // Operating in "relying-party" mode. The widget owns this transaction.
  // Complete the transaction client-side and call success/resolve promise
  const { codeVerifier } = transactionMeta;
  return authClient.token.exchangeCodeForTokens({ codeVerifier, interactionCode })
    .then(({ tokens }) => {
      settings.callGlobalSuccess(Enums.SUCCESS, { tokens });
    })
    .catch(err => {
      settings.callGlobalError(err);
    })
    .finally(() => {
      // clear all meta related to this transaction
      clearTransactionMeta(settings);
    });
}
