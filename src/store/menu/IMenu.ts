export interface TopMenu {
    title: string,
    key: string,
    icon: string
}

export interface Menu {
    title: string,
    path: string,
    key: string,
    icon: string,
    children?: Array<Menu>
    buttons?: Array<string>
}