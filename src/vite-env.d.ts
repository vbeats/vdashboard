/// <reference types="vite/client" />

declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

interface ImportMetaEnv {
    readonly VITE_ACCESS_TOKEN_EXPIRE: number
    readonly VITE_REFRESH_TOKEN_EXPIRE: number
}

declare module '@smallwei/avue' {
    const Avue: any;
    export default Avue;
}

declare module "query-string" {
    export function parse(str: string): Object;

    export function stringify(obj: Object): string;

    export function extract(str: string): string;
}