import { Account, Client } from 'appwrite';

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6805f3ad0012f839c390");

export const account = new Account(client);

export default client; 