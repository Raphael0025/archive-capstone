import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { NewDocumentType } from '../types/document'

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { storage } from './firebase'
import { app } from './firebase'

export const firestore = getFirestore(app)

// Books Collection
export const eBookCollection = collection(firestore, 'eBooks')

//ADD NEW DOCUMENT
export const addDocument = async (docData: NewDocumentType) => {
    const newDoc = await addDoc(eBookCollection, {...docData})

    console.log(`New Document Uploaded ${newDoc.path}`)
}

// UPLOAD FILE TO FIREBASE
export const uploadFile = async (docData: any, file: string, resource: string): Promise<string | null> => {
    if (docData) {
      const fileRef = ref(storage, `Documents/${resource}/${file}`);
      
      try {
        const data = await uploadBytes(fileRef, docData[0]);
        const url = await getDownloadURL(data.ref);
        return url;
      } catch (error) {
        console.error("Error uploading file:", error)
        return null
      }
    }
    return null
}

