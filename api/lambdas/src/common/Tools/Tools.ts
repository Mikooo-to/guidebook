import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

const secretsManager = new SecretsManagerClient({
  region: 'eu-central-1',
});

export async function getSecret(secertName: string): Promise<string> {
  try {
    const command = new GetSecretValueCommand({ SecretId: secertName });
    const res = await secretsManager.send(command);
    return JSON.parse(res.SecretString || '{}');
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}
