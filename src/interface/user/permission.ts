export interface Permission {  // user:['add','update']
    action: string,
    perms: Array<string>
}