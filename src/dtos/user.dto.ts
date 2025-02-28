export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}
export interface UpdateUserDTO extends Partial<CreateUserDTO> {
    isEmailVerified?: boolean;
}
