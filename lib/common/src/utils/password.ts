import { compare, hash } from "bcrypt";


export async function hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
}

export async function verifyPassword(source: string, target: string): Promise<boolean> {
    return await compare(source, target);
}
