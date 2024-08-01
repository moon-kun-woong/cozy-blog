export class NodeWrapper {
    origin: Record<string, any>;
    id: string;

    constructor(target: Record<string, any>) {
        this.origin = target;
        this.id = target.id;
    }
}