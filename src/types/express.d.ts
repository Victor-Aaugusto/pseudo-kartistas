declare global{
    namespace Express{
        interface Request{
            authenticatedUser?: {
                id: number,
                email: string,
                name: string,
                role: string
            }
        }
    }
}
export {}