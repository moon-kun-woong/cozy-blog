import { PrimaryKey } from "drizzle-orm/mysql-core";

export interface spaceDto {
    id : PrimaryKey,
    uid: string,
    title : string,
    state : string,
    slug : string
}