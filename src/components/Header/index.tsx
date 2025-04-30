import { HeaderContainer } from "./style"
import logo from '../../assets/ignite_logo.svg'
import { Scroll, Timer } from "@phosphor-icons/react"
import { NavLink } from "react-router-dom"

export const Header = () => {
    return(
        <HeaderContainer>
            <img src={logo} alt=""/>
            <nav>
                <NavLink to="/" title="Timer">
                    <Timer size={24} />
                </NavLink>
                <NavLink to="/history" title="Histórico">
                    <Scroll size={24} />
                </NavLink>
            </nav>
        </HeaderContainer>
    )
}