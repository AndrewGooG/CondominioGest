import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";
import MostrarDep from "./departamento/components/MostrarDep.js";
import CrearDep from "./departamento/components/CrearDepartamento.js";
import EditarDep from "./departamento/components/EditarDep.js";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>{routes}</Route>
        <Route path="/depas" element={<MostrarDep/>}/>
        <Route path="/crearDepartamento" element={<CrearDep/>}/>
        <Route path="/editDepartamento/:idDep" element={<EditarDep/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
