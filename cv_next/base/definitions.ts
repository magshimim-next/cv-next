export default class Definitions {
    public static readonly undefinedIndex = -1;
  
    public static readonly FIREBASE_CONFIG = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGEING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };
  }
  
  