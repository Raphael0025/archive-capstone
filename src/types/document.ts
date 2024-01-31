export interface NewDocumentType{
    title: string;
    authors: string;
    category: string;
    abstract: string;
    field: string;
    level: string;
    advisor: string;
    file: string;
    resourceType: string;
}

export interface DocumentType{
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
    resourceType: string;
}

export interface FormErrors {
    title?: string;
    authors?: string;
    category?: string;
    abstract?: string;
    field?: string;
    level?: string;
    advisor?: string;
    file?: string;
    resourceType?: string;
}

export interface UpdateFormErrors {
    title?: string;
    authors?: string;
    category?: string;
    abstract?: string;
    field?: string;
    level?: string;
    advisor?: string;
    file?: string;
    resourceType?: string;
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
    timestamp: string;
}
 