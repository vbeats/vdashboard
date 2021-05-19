export interface UserFormState {
    id?: number,
    username?: string,
    password?: string,
    phone?: string,
    role_id?: number
}

export interface RoleFormState {
    id?: number,
    role_name: string
}