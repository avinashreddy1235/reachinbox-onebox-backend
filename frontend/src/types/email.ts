export interface Email {
    id: string;
    from: string;
    to: string[];
    subject: string;
    text: string;
    html?: string;
    date: string;
    categories?: string[];
    attachments?: Attachment[];
}

export interface Attachment {
    filename: string;
    contentType: string;
    size: number;
    content?: Buffer;
}

export interface EmailSearchParams {
    query?: string;
    from?: string;
    to?: string;
    subject?: string;
    startDate?: string;
    endDate?: string;
    categories?: string[];
    page?: number;
    pageSize?: number;
}

export interface EmailSearchResponse {
    emails: Email[];
    total: number;
    page: number;
    pageSize: number;
}