import { Account, Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6805f3ad0012f839c390");

export const account = new Account(client);
export const databases = new Databases(client);

export default client; 