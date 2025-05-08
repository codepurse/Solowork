import { Account, Client, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6805f3ad0012f839c390");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const DATABASE_ID = "680c34d8000b99c9ed54";
export const COLLECTION_ID = "680c34e9003adbf5c0ef";
export const USER_PROFILES_COLLECTION_ID = "680c34e9003adbf5c0ef";
export const PROJECTS_COLLECTION_ID = "680daaa10025953e530d";
export const TASKS_COLLECTION_ID = "680dd9b5000ea2b16323";
export const TASKS_ATTACHMENTS_BUCKET_ID = "6811d2830009c6fbf99d";
export const NOTES_FOLDER_ID = "681484fa002ce0251c0b";
export const NOTES_COLLECTION_ID = "68159eea003dbfc13119";
export const KANBAN_FOLDER_ID = "6816d8950028fdbe51e1";
export const KANBAN_COLLECTION_ID = "6816e54100149fe0b4c4";
export const RECENT_ACTIVITY_COLLECTION_ID = "681b58ce0018131bd62e";
export const DAILY_CHECKLIST_COLLECTION_ID = "681c26d8002b13f57581";

export default client;
