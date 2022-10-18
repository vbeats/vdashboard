export interface Menu {
    title: string,
    path: string,
    key?: string,
    action?: string,
    icon: string,
    children?: Array<Menu>
    buttons?: Array<string>
}