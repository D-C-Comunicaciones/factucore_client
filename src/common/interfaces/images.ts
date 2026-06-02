export interface Image {
    id: number;
    url: string;
    name: string;
    size: number;
    created_at: string;
    updated_at: string;
}

export interface ItemImage {
    id?: number;
    url: string;
    file?: File;
    alt?: string;
    order?: number;
    is_primary?: boolean;
}