import { handlerPath } from "@libs/handler-resolver";

//Definition of Lambda Functions
export const login = {
    handler: `${handlerPath(__dirname)}/handler.login`,
    events: [
        {
            http: {
                path: "user/login",
                method: "POST",
                cors: true
            },
        },
    ],
};

export const register = {
    handler: `${handlerPath(__dirname)}/handler.register`,
    events: [
        {
            http: {
                path: "user/register",
                method: "POST",
                cors: true
            },
        },
    ],
};

export const auth = {
    handler: `${handlerPath(__dirname)}/handler.auth`,
    cors: true
};
