// The .server.ts suffix ensures this code only runs on the server
const databases: string[] = [];
export function executeQuery(query: string): any {
    if (query.trim().toLowerCase().startsWith("create database")) {
        const match = query.match(/create database\s+([^\s;]+)/i);
        const database = match ? match[1] : "unknown";
        if(databases.includes(database)) {
            return {
                message: `Database ${database} already exists`,
                status: 400,
                alert: `Database ${database} already exists`
            };
        }
        databases.push(database);
        return {
            message: `Database ${database} created Successfully`,
            status: 201,
            alert: `Database ${database} created`
        };
    }
    else if(query.trim().toLowerCase().startsWith("drop database")) {
        const match = query.match(/drop database\s+([^\s;]+)/i);
        const database = match ? match[1] : "unknown";
        if(!databases.includes(database)) {
            return {
                message: `Database ${database} does not exist`,
                status: 400,
                alert: `Database ${database} does not exist`
            };
        }
        databases.splice(databases.indexOf(database), 1);
        return {
            message: `Database ${database} dropped Successfully`,
            status: 200,
            alert: `Database ${database} dropped`
        };
    }
    else if(query.trim().toLowerCase().startsWith("show databases")) {
        return { alert: `databases : ${databases.join(", ")}`, result: databases, status: 200}
    }
    else if(query.trim().toLowerCase().startsWith("create table")){

    }
    return { result: query };
}