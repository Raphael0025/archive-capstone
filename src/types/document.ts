import { Timestamp } from 'firebase/firestore';
import firebase from 'firebase/app';
export interface eBookData {
    id: string;
    slug: string;
    title: string;
    authors: string;
    category: string;
    abstract: string;
    field: string;
    advisor: string;
    file: string;
    downloadCount: number;
    viewCount: number;
    url: string;
}

export interface NewDocumentType{
    title: string;
    authors: string;
    category: string;
    field: string;
    advisor: string;
    file: string;
}

export interface DocumentType{
    id: string;
    slug: string;
    title: string;
    authors: string;
    category: string;
    field: string;
    advisor: string;
    file: string;
    downloadCount: number;
    viewCount: number;
    url: string;
}

export interface DocumentTypeWithTimestamp{
    id: string;
    slug: string;
    title: string;
    authors: string;
    category: string;
    field: string;
    advisor: string;
    file: string;
    timestamp: Timestamp;
    downloadCount: number;
    viewCount: number;
    url: string;
}
export interface FormErrors {
    title?: string;
    authors?: string;
    category?: string;
    abstract?: string;
    field?: string;
    advisor?: string;
    file?: string;
}

export interface UpdateFormErrors {
    title?: string;
    authors?: string;
    category?: string;
    abstract?: string;
    field?: string;
    advisor?: string;
    file?: string;
}

export interface PostFormError {
    header?: string;
    caption?: string;
    content?: string;
    file?: string;
}

export interface PostType {
    header: string;
    caption: string;
    content: string;
    file: string;
}

export interface ViewPostType {
    id: string
    header: string;
    caption: string;
    content: string;
    file: string;
    timestamp: Timestamp;
}

export interface LoginError {
    id?: string;
    userName?: string;
    password?: string;
}

export interface UserRegisteration {
    id: string;
    userName: string;
    password: string;
    fullName: string;
    userID: string;
    email: string;
}

export interface UserType {
    id: string;
    userName: string;
    role: string;
    password: string;
    fullName: string;
    userID: string;
    email: string;
    downloads: Array<string>;
}

export interface requestType {
    id: string;
    articleId: string;
    title: string;
    fullName: string;
    userID: string;
    uid: string;
    url: string;
    status: string;
}
 
export interface RegistrationError {
    id?: string;
    userName?: string;
    password?: string;
    fullName?: string;
    userID?: string;
    email?: string;
}

export interface PostedType {
    id: string;
    url: string;
    header: string;
    caption: string;
    timestamp: Timestamp;
    content: string;
    file: string;
  }

export interface PostType {
    id: string;
    url: string;
    header: string;
    caption: string;
    content: string;
    file: string;
  }