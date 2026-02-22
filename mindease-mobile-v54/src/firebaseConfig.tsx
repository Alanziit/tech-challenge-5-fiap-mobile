import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

import { Auth, getAuth } from 'firebase/auth';

import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};


let app:FirebaseApp;
let auth: Auth;

if(!getApps().length){
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}else{
  app = getApp();
  auth = getAuth(app);
}

export { app, auth };
export const storage = getStorage(app);
export const database = getDatabase(app);
