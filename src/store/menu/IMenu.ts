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
    buttons?: Array<string>
}