import {
    initializeApp,
    getApps,
    App,
    getApp,
    cert,
} from "firebase-admin/app"

import { getFirestore } from "firebase-admin/firestore"

// THIS LETS US WRITE TO AND DELETE ANYTHING

const serviceKey = require("@/service_key.json")

let app: App;

if (getApps().length===0){
    app=initializeApp({
        credential: cert(serviceKey),
    });
} else{
    app = getApp();
}
// NOTE: this adminDb is only used for operations that require elevated priveleges. Only used in backend
const adminDb = getFirestore(app);

export {app as adminApp, adminDb}