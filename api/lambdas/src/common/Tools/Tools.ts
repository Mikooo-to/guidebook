import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

/**
 * @deprecated
 * Use env variables which are set by cdk for each lambda function
 */

export async function getSecrets(
  secretNames: string[],
): Promise<Record<string, string>> {
  try {
    const secretsClient = new SecretsManagerClient({
      region: 'eu-central-1',
    });
    const secretPromises = secretNames.map(async (secretName) => {
      const command = new GetSecretValueCommand({ SecretId: secretName });
      const response = await secretsClient.send(command);
      return { [secretName]: response.SecretString };
    });
    const secrets = await Promise.all(secretPromises);

    return Object.assign({}, ...secrets);
  } catch (error) {
    console.error('Error retrieving secrets:', error);
    throw error;
  }
}
