export interface Permission {  // login:['add','update']
    action: string,
    perms: Array<string>
}