export interface NewDocumentType{
    title: string;
    authors: string;
    affiliation: string;
    abstract: string;
    field: string;
    level: string;
    advisor: string;
    file: string;
    url: string | null;
    resourceType: string;
    language: string;
}

export interface FormErrors {
    title?: string;
    authors?: string;
    affiliation?: string;
    abstract?: string;
    field?: string;
    level?: string;
    advisor?: string;
    file?: string;
    url?: string | null;
    resourceType?: string;
    language?: string;
}