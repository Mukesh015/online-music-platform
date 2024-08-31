import * as admin from 'firebase-admin';

const firebaseKeyBase64 = process.env.FIREBASE_PRIVATE_KEY;
if (!firebaseKeyBase64) {
  throw new Error('Firebase private key is not set in environment variables');
}


const firebaseKeyJson = Buffer.from(firebaseKeyBase64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(firebaseKeyJson);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firebaseAdmin = admin;