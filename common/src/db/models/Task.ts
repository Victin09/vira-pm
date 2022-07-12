export interface TaskAttributes {
    id: number;
    name: string;
    description: string;
    order: number;
    priority: "HIGH" | "NORMAL" | "LOW"
    colId: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
