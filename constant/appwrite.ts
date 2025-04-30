import { Account, Client, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6805f3ad0012f839c390");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const DATABASE_ID = "680c34d8000b99c9ed54";
export const COLLECTION_ID = "680c34e9003adbf5c0ef";
export const PROJECTS_COLLECTION_ID = "680daaa10025953e530d";
export const TASKS_COLLECTION_ID = "680dd9b5000ea2b16323";
export const TASKS_ATTACHMENTS_BUCKET_ID = "6811d2830009c6fbf99d";

export default client;
