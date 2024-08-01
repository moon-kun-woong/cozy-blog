export class PageNodeWrapper {
    properties: Record<string, any>;
    updatedAt: Date

    constructor(target: Record<string, any>) {
        this.properties = target.properties;
        this.updatedAt = target.last_edited_time;
    }
}

export class PostNodeWrapper{

}

export class MetaNodeWrapper{
    
}