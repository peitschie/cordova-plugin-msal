// example response
// resp = {
//   token: 'eyJ0eXAiOiJKV1QiLCJub...',
//   account: {
//       id: 'abc-someguid-123',
//       username: 'wrobins@myemailaddr.com',
//       claims: [
//           {key: "name", value: "Robins, Walter"},
//           {key: "ver", value: "2.0"},
//           { ... }
//       ]
//   }
// }

/**
 * Azure AD Authory listings
 *
 * As per https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-configuration
 */

interface JwtClaim {
  key: string;
  value: string | string[];
}

interface JwtAccount {
  id: string;
  username: string;
  claims: JwtClaim[];
}

interface JwtToken {
  token: string;
  account: JwtAccount;
}

interface AzureADB2CAccount {
  id: string;
  username: string;
  claims: JwtClaim[];
}

type AzureADAuthority =
  | {
      type: "AAD";
      audience:
        | "AzureADandPersonalMicrosoftAccount"
        | "AzureADMyOrg"
        | "AzureADMultipleOrgs"
        | "PersonalMicrosoftAccount";

      /** default value: MSALAzurePublicCloudInstance */
      cloudInstance?: string;
      default?: boolean;
    }
  | {
      type: "B2C";
      authorityUrl: string;
      /** default value: MSALAzurePublicCloudInstance */
      cloudInstance?: string;
      default: boolean;
    };

interface InitOptions {
  authorities: Array<AzureADAuthority>;
  authorizationUserAgent?: "DEFAULT" | "WEBVIEW" | "BROWSER";
  /** Default value is false */
  multipleCloudsSupported?: boolean;
  /** Default value is false */
  brokerRedirectUri?: boolean;

  /** Sets app account mode
   *
   * https://docs.microsoft.com/en-us/azure/active-directory/develop/single-multi-account
   * 
   * Default value is "MULTIPLE"
   */
  accountMode?: "SINGLE" | "MULTIPLE";

  /**
   * Scopes to request
   *
   * A common list of these can be found at
   *  https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
   */
  scopes: Array<string>;
}

interface InteractiveSignInOptions {
  loginHint: string;
  /** Default value is "WHEN_REQUIRED" */
  prompt:
    | "SELECT_ACCOUNT"
    | "LOGIN"
    | "CONSENT"
    | "WHEN_REQUIRED";
  authorizationQueryStringParameters: string;
  otherScopesToAuthorize: string;
  webViewType: string;
}

interface MSALPlugin {
  msalInit(success: () => any, error: (err: any) => any, options: InitOptions);

  signInSilent(
    success: (resp: JwtToken) => any,
    error: (err: any) => any,
    accountId?: string
  );

  signInInteractive(
    success: (resp: JwtToken) => any,
    error: (err: any) => any,
    signInOptions?: Partial<InteractiveSignInOptions>
  );

  signOut(
    success: (resp: JwtToken) => any,
    error: (err: any) => any,
    accountId?: any
  );

  getAccounts(
    success: (resp: AzureADB2CAccount[]) => any,
    error: (err: any) => any
  );
}

interface CordovaPlugins {
  msalPlugin: MSALPlugin;
}
