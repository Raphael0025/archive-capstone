import { addDoc, DocumentData, QueryDocumentSnapshot, deleteDoc, setDoc, doc, arrayUnion, getDocs, query, orderBy, limit, where, collection, getFirestore, getCountFromServer, serverTimestamp, increment } from 'firebase/firestore'
import { NewDocumentType, PostType, ViewPostType, eBookData } from '../types/document'

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

import { storage } from './firebase'
import { app } from './firebase'

export const firestore = getFirestore(app)

// Books Collection
export const eBookCollection = collection(firestore, 'eBooks')

// Announcements Collection
export const postCollection = collection(firestore, 'announcements')

// Define the collection for user registrations
export const usersCollection = collection(firestore, 'users')

// Define the collection for user registrations
export const requestsCollection = collection(firestore, 'student-inquiries')

interface UserData {
    // Define the properties of the userData object
    // Adjust the types accordingly based on your actual data structure
    userName: string;
    password: string;
    fullName: string;
    email: string;
    userID: string;
    // ... other properties
}

interface GuestUserData {
    // Define the properties of the userData object
    // Adjust the types accordingly based on your actual data structure
    userName: string;
    password: string;
    fullName: string;
    email: string;
    // ... other properties
}

interface StudentID {
    studID: string;
    // ... other properties
}

// Function to add a user registration document to Firestore
export const registerUser = async (userData: GuestUserData) => {
    try {
      // Add document to Firestore in the "users" collection
        const userDataWithRole = {
            ...userData,
            role: 'guest', // Set the role to 'student'
        };
    
        // Add document to Firestore in the "users" collection
        const newUser = await addDoc(usersCollection, {
            ...userDataWithRole,
            timestamp: serverTimestamp(),
        });
    
        console.log(`New User Registered: ${newUser.id}`);
        return newUser.id;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

// UPDATE DOCUMENT
export const registerUserData = async (id : string, userRole:string, userData: UserData) => {
    try {
        // Get the reference to the document in Firestore
        const userDocRef = doc(firestore, `users/${id}`);

        // Merge the new user data with existing data in the document
        const updatedUserData = {
            ...userData, // New user data
            role: userRole,
            timestamp: serverTimestamp() // Add timestamp field if necessary
        };

        // Set the document data in Firestore with merge option
        await setDoc(userDocRef, updatedUserData, { merge: true });

        console.log('User data updated successfully');
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
}

export const verifyID = async (studID: string) => {
    try {
        const q = query(usersCollection, where('userID', '==', studID));
        const querySnapshot = await getDocs(q);

        // Check if a user with the provided student ID exists
        if (querySnapshot.size === 0) {
            alert('ID is incorrect.')
            throw new Error('User not found');
        } else {
            // Return the document
            const doc = querySnapshot.docs[0].data();
            
            // Check if the document has a filled userName field
            if (doc.userName) {
                alert('Student already has an account.');
                throw new Error('User already has an account.');
            }

            // Return the document ID
            return querySnapshot.docs[0].id;
        }

    } catch (error) {
        console.error('Error logging in:');
        throw error;
    }
}

export const loginUser = async (userName: string, password: string) => {
    try {
        const q = query(usersCollection, where('userName', '==', userName));
        const querySnapshot = await getDocs(q);
    
        // Check if a user with the provided username exists
        if (querySnapshot.size === 0) {
          // If the username is not found, try using it as a student ID
          const qByStudentId = query(usersCollection, where('userID', '==', userName));
          const querySnapshotByStudentId = await getDocs(qByStudentId);

          // Check if a user with the provided student ID exists
          if (querySnapshotByStudentId.size === 0) {
            alert('User Name or ID is incorrect.')
            throw new Error('User not found');
          }

          // Get the first user matching the student ID
          const user = querySnapshotByStudentId.docs[0].data();
          
          // Check if the password matches
          if (user.password !== password) {
            alert('Password is incorrect.')
            throw new Error('Incorrect password');
          }

          // User is authenticated
          console.log('User logged in:', user);

          // Store the user's ID in localStorage for sessions
          localStorage.setItem('customToken', user.userName);

          // You can return the user object or any relevant information
          return user;
        }

        // Get the first user matching the username
        const user = querySnapshot.docs[0].data();
        console.log(user)
        // Check if the password matches
        if (user.password !== password) {
            alert('Password is incorrect.')
            throw new Error('Incorrect password');
        }

        // User is authenticated
        console.log('User logged in:', user);

        // Store the user's ID in localStorage for sessions
        localStorage.setItem('customToken', user.userName);

        // You can return the user object or any relevant information
        return user;
    } catch (error) {
        console.error('Error logging in:');
        throw error;
    }
}

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

// COUNT Number of DOCS
export const countUsers = async () => {
    try {
        const q = query(usersCollection, where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.size;
    } catch (error) {
        console.error('Error counting students:', error);
        return 0;
    }
}

// ADD STUDENT INQUIRY
export const addStudentInquiry = async (inquiryData: any) => {
    try {
      // Ensure that userId is defined in inquiryData
      if (!inquiryData.uid) {
        console.error('Error adding student inquiry: userId is undefined');
        return;
      }
  
      // Add document to Firestore in the "student-inquiries" collection
      const newInquiry = await addDoc(collection(firestore, 'student-inquiries'), inquiryData);
      console.log(`New Student Inquiry Added: ${newInquiry.id}`);
  
      // Increment downloadCount in the "eBooks" collection
      const eBookDocRef = doc(firestore, 'eBooks', inquiryData.articleId);
        await setDoc(eBookDocRef, {downloadCount: increment(1)}, {merge: true});

        // Add the new inquiry ID to the user's "downloads" array
        const userDocRef = doc(firestore, 'users', inquiryData.uid);
        await setDoc(userDocRef, {
            downloads: arrayUnion(newInquiry.id),
        }, {merge: true});
    } catch (error) {
      console.error('Error adding student inquiry:', error);
    }
  };

// ADD STUDENT INQUIRY
export const approveStudentInquiry = async (inquiryId: string) => {
    try {
        // Reference to the specific document in "student-inquiries" collection
        const inquiryDocRef = doc(firestore, 'student-inquiries', inquiryId);
    
        // Update the status field to 'approved' without overwriting existing data
        await setDoc(inquiryDocRef, { status: 'approved' }, { merge: true });
    
        console.log(`Student Inquiry Approved: ${inquiryId}`);
    } catch (error) {
        console.error('Error approving student inquiry:', error);
    }
};

// ADD STUDENT INQUIRY
export const cancelStudentInquiry = async (inquiryId: string) => {
    try {
        // Reference to the specific document in "student-inquiries" collection
        const inquiryDocRef = doc(firestore, 'student-inquiries', inquiryId);
    
        // Update the status field to 'approved' without overwriting existing data
        await setDoc(inquiryDocRef, { status: 'cancelled' }, { merge: true });
    
        console.log(`Student Inquiry was Cancelled: ${inquiryId}`);
    } catch (error) {
        console.error('Error cancelling student inquiry:', error);
    }
};

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
                    advisor: data.advisor,
                    file: data.file,
                    downloadCount: data.downloadCount,
                    viewCount: data.viewCount,
                    url: data.url,
                });
        });
        console.log('Top Downloads Array:', topDownloadsArray);
        return topDownloadsArray;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getTopViews = async (): Promise<eBookData[]> => {
    try {
        const q = query(eBookCollection, orderBy('viewCount', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
    
        const topViewArray: eBookData[] = [];
    
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const data = doc.data() as eBookData;
                topViewArray.push({
                    id: doc.id,
                    title: data.title,
                    authors: data.authors,
                    category: data.category,
                    abstract: data.abstract,
                    field: data.field,
                    advisor: data.advisor,
                    file: data.file,
                    downloadCount: data.downloadCount,
                    viewCount: data.viewCount,
                    url: data.url,
                });
        });
        console.log('Top Views Array:', topViewArray);
        return topViewArray;
    } catch (error) {
        console.error(error);
        return [];
    }
}

//ADD NEW DOCUMENT
export const addDocFile = async (docData: NewDocumentType, fileData: any, category: string, file: string) => {
    try {
        // Upload file to Storage
        const fileRef = ref(storage, `Documents/${category}/${file}`)
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

// Function to check if the title already exists in Firestore
export const checkIfTitleExists = async (title: string): Promise<boolean> => {
    try {
        const querySnapshot = await getDocs(query(eBookCollection, where('title', '==', title)));
        return !querySnapshot.empty; // Returns true if the title exists, false otherwise
    } catch (error) {
        console.error('Error checking if title exists:', error);
        return false; // Assume title doesn't exist in case of an error
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
export const deleteRecord = async (id: string | undefined, category: string | undefined, file: string | undefined) => {
    const fileUrl = `Documents/${category}/${file}`
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

export const deleteUser = async (id: string | undefined) => {
    try {
        // Delete the user from Firestore
        const user = doc(firestore, `users/${id}`);
        await deleteDoc(user);
        console.log('User Deleted');
    } catch (error) {
        console.error('Error deleting user:', error);
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
export const updateDoc = async (id : string, docData: NewDocumentType, fileData: any, oldCategory: string, category: string, file: string, oldFileName: string) => {
    try {
        const oldFile = ref(storage, `Documents/${oldCategory}/${oldFileName}`);
        await deleteObject(oldFile);

        // Upload file to Storage
        const fileRef = ref(storage, `Documents/${category}/${file}`)
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