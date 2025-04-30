import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { History } from "./pages/History";
import { DefaultLayout } from "./layouts/DefaultLayout";

export const Router = () => {
    return(
        <Routes>
            {/* Esse route que wrappa o route de dentro, é um component que será renderizado para todos que 
            fizerem parte de alguma rota, como se fosse uma soma de paths / */}
            <Route path="/" element={<DefaultLayout/>}>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
            </Route>
        </Routes>
    );
}