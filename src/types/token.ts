export type AuthTokens = {
    access: {
        token: string;
        expires: Date;
    };
    refresh: {
        token: string;
        expires: Date;
    };
};
