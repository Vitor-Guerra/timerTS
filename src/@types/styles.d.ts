// aqui so tem codigos de tipagem, por isso usamos d.ts (definicao de tipos)
import styles from "styled-components";
import { defaultTheme } from "../styles/themes/default";

type ThemeType = typeof defaultTheme

// toda vez que importar styled-components em algum componente ele vai puxar as tipagens que criei acima ^
declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}