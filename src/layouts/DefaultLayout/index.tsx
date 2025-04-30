import { Outlet } from "react-router-dom"
import { Header } from "../../components/Header"
import { LayoutContainer } from "./styles"

export const DefaultLayout = () => {
    return(
        <LayoutContainer>
            <Header/>
            {/* outlet renderizará um conteudo reservado de uma pagina do Router */}
            <Outlet />
        </LayoutContainer>
    )
}