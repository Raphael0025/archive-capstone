import { addDoc, DocumentData, QueryDocumentSnapshot, deleteDoc, setDoc, doc, getDocs, query, orderBy, limit, collection, getFirestore, getCountFromServer, serverTimestamp } from 'firebase/firestore'
import { NewDocumentType, PostType, ViewPostType } from '../types/document'

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

import { storage } from './firebase'
import { app } from './firebase'

export const firestore = getFirestore(app)

// Books Collection
export const eBookCollection = collection(firestore, 'eBooks')

// Announcements Collection
export const postCollection = collection(firestore, 'announcements')

// COUNT Number of DOCS
export const countDocs = async () => {
    try {
        const snapshot = await getCountFromServer(eBookCollection)
        return snapshot.data().count
    } catch (error) {
        console.error('Error counting documents:', error)
        return 0
    }
}

export interface eBookData {
    id: string;
    title: string;
    authors: string;
    category: string;
    abstract: string;
    field: string;
    level: string;
    advisor: string;
    file: string;
    downloadCount: number;
    viewCount: number;
    url: string;
    resourceType: string;
}

export const getTopDownloads = async (): Promise<eBookData[]> => {
    try {
      const q = query(eBookCollection, orderBy('downloadCount', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
  
      const topDownloadsArray: eBookData[] = [];
  
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data() as eBookData;
        topDownloadsArray.push({
          id: doc.id,
          title: data.title,
          authors: data.authors,
          category: data.category,
          abstract: data.abstract,
          field: data.field,
          level: data.level,
          advisor: data.advisor,
          file: data.file,
          downloadCount: data.downloadCount,
          viewCount: data.viewCount,
          url: data.url,
          resourceType: data.resourceType,
        });
      });
  
      console.log('Top Downloads Array:', topDownloadsArray);
      return topDownloadsArray;
    } catch (error) {
      console.error(error);
      // Return an empty array or handle the error as appropriate
      return [];
    }
  };

//ADD NEW DOCUMENT
export const addDocFile = async (docData: NewDocumentType, fileData: any, category: string, file: string, resource: string) => {
    try {
        // Upload file to Storage
        const fileRef = ref(storage, `Documents/${category}/${resource}/${file}`)
        const data = await uploadBytes(fileRef, fileData[0])
        const url = await getDownloadURL(data.ref)
        const downloadCount = 0;
        const viewCount = 0;

        // Append url to docData
        const updatedDocData = { ...docData, url, downloadCount, viewCount, timestamp: serverTimestamp() }

        // Add document to Firestore
        const newDoc = await addDoc(eBookCollection, updatedDocData);
        console.log(`New Document Uploaded ${newDoc.path}`)
    } catch (error) {
        console.error('Error uploading post:', error)
    }
}

//ADD NEW POST
export const addPost = async (docData: PostType, fileData: any, file: string) => {
    try {
        // Upload file to Storage
        const fileRef = ref(storage, `Media/posts/${file}`)
        const data = await uploadBytes(fileRef, fileData[0])
        const url = await getDownloadURL(data.ref)

        // Append url to docData
        const updatedDocData = { ...docData, url, timestamp: serverTimestamp() }

        // Add document to Firestore
        const newPost = await addDoc(postCollection, updatedDocData)
        console.log(`New Post Uploaded ${newPost.path}`)
    } catch (error) {
        console.error('Error uploading post:', error)
    }
}

// DELETE A RECORD
export const deleteRecord = async (id: string | undefined, category: string | undefined, resource: string | undefined, file: string | undefined) => {
    const fileUrl = `Documents/${category}/${resource}/${file}`
    try {
        // Delete the file from Storage
        if (fileUrl) {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
            console.log('File deleted from Storage');
        }

        // Delete the document from Firestore
        const document = doc(firestore, `eBooks/${id}`);
        await deleteDoc(document);
        console.log('Record Deleted');
    } catch (error) {
        console.error('Error deleting record:', error);
    }
}

// DELETE A POST
export const deletePost = async (id: string | undefined, file: string | undefined) => {
    const fileUrl = `Media/posts/${file}`
    try {
        // Delete the image from Storage
        if (fileUrl) {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
            console.log('Post deleted from Storage');
        }

        // Delete the post from Firestore
        const post = doc(firestore, `announcements/${id}`);
        await deleteDoc(post);
        console.log('Post Deleted');
    } catch (error) {
        console.error('Error deleting Post:', error);
    }
}

// UPDATE DOCUMENT
export const updateDoc = async (id : string, docData: NewDocumentType, fileData: any, oldCategory: string, category: string, file: string, oldFileName: string, resource: string, oldResource: string) => {
    try {
        const oldFile = ref(storage, `Documents/${oldCategory}/${oldResource}/${oldFileName}`);
        await deleteObject(oldFile);

        // Upload file to Storage
        const fileRef = ref(storage, `Documents/${category}/${resource}/${file}`)
        const data = await uploadBytes(fileRef, fileData[0])
        const url = await getDownloadURL(data.ref)

        // Append url to docData
        const updatedDocData = { ...docData, url }

        // Add document to Firestore
        const getDoc = doc(firestore, `eBooks/${id}`)
        await setDoc(getDoc, updatedDocData, {merge: true})
        console.log('Document updated successfully')
    } catch (error) {
        console.error('Error uploading file or adding document:', error)
    }
}

// UPDATE POST
export const updatePost = async (id : string, docData: PostType, fileData: any, file: string, oldFileName: string) => {
    try {
        const oldFile = ref(storage, `Media/posts/${oldFileName}`);
        await deleteObject(oldFile);

        // Upload file to Storage
        const fileRef = ref(storage, `Media/posts/${file}`)
        const data = await uploadBytes(fileRef, fileData[0])
        const url = await getDownloadURL(data.ref)

        // Append url to docData
        const updatedDocData = { ...docData, url }

        // Add Post to Firestore
        const getDoc = doc(firestore, `announcements/${id}`)
        await setDoc(getDoc, updatedDocData, {merge: true})
        console.log('Post updated successfully')
    } catch (error) {
        console.error('Error uploading post:', error)
    }
}