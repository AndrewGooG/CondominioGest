import React, { useEffect, useState } from "react";
import axios from "axios";
import './DepartamentosCss.css';

import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardImg, CardBody, CardTitle , Button } from 'reactstrap';
import ModalConfirm from "./ModalConfirm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faPenToSquare , faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const endpoint = 'http://localhost:8000/api';
const endpointImg = 'http://localhost:8000';
const cookies = new Cookies();
const MostrarDep = () => {
    const [departamentos, setDepartamentos] = useState ([]);
    const [switchStates, setSwitchStates] = useState({});
    const [isOpenModal1, setIsOpenModal1] = useState(false);
    const [isOpenModal2, setIsOpenModal2] = useState(false);
    const [estadoIdDepa, setEstadoIdDepa] = useState([null]);


    useEffect(() => {
        getAllDepartments();
        cookies.remove('idDepa');
    }, []);

    const getAllDepartments = async () => {
        const response = await axios.get(`${endpoint}/departamentos`);
        setDepartamentos(response.data);
        const initialSwitchStates = {};
        response.data.forEach(departamento => {
            initialSwitchStates[departamento.id]  = departamento.disponibilidad;
        });
        setSwitchStates(initialSwitchStates);
    }

    const deleteDepartment = async (id) => {
        await axios.delete(`${endpoint}/departamento/${id}`);
        getAllDepartments();
    }

    const handleClickEditar = (idDepa) => {
        cookies.set('idDepa', idDepa);
        window.location.href = '/dashboard/editarDepa'; 
      };

    const handleClickInfo = (idDepa) => {
        cookies.set('idDepa', idDepa);
        window.location.href = '/dashboard/infoDepartamento';
    };
    
    const handleBotonSwitch = (idDepa) => {
        if (!switchStates[idDepa]) {
            //axios.put(`${endpoint}/departamentos/${idDepa}/actualizarDisp`, {
            //disponibilidad: 1,
            //});
            setEstadoIdDepa(idDepa);
            setIsOpenModal1(true);
        } else {
            //cookies.set('idDepa', idDepa);
            //window.location.href = '/dashboard/crearContrato';
            setEstadoIdDepa(idDepa);
            setIsOpenModal1(true);
        }
    }

    const handleConfirm = (idDepa) => {
        setSwitchStates(prevState => ({
            ...prevState,
            [idDepa]: !prevState[idDepa]
        }));

        if (!switchStates[idDepa]) {
            axios.put(`${endpoint}/departamentos/${idDepa}/actualizarDisp`, {
            disponibilidad: 1,
            });
        } else {
            cookies.set('idDepa', idDepa);
            window.location.href = '/dashboard/crearContrato';
        }
        setIsOpenModal1(false);
    }

    return(
        <div className="Deps">
            <ModalConfirm
                isOpen={isOpenModal1}
                toggle={() => setIsOpenModal1(false)}
                confirm={() => handleConfirm(estadoIdDepa)}
                message="¿Está seguro de que deseas cambiar el estado de este departamento?"
            />
            <h1 className="title">Departamentos</h1>
        
            <div className= "lista">
                {departamentos.map((departamento) => (
                    
                    
                    <Card className="cardDepa" key={departamento.id}>
                        
                        <CardImg
                            alt="Card image cap"
                            src={`${endpointImg}/${departamento.imagen_departamento}`}
                            top
                            width="100%"
                        />
                        <CardBody>
                            <CardTitle tag="h5">{departamento.nombre_departamento}</CardTitle>
                            <div className="botones">
                                <Button className="botoncard" onClick={() => deleteDepartment(departamento.id)}><FontAwesomeIcon icon={faTrashAlt} className="iconos"/></Button>
                                <Button className="botoncard" onClick={() => handleClickEditar(departamento.id)} ><FontAwesomeIcon icon={faPenToSquare} className="iconos"/></Button>
                                <Button className="botoncard" onClick={() => handleClickInfo(departamento.id)} ><FontAwesomeIcon icon={faArrowCircleRight} className="iconos"/></Button>
                                <label className="switch">
                                    <input type="checkbox" checked={switchStates[departamento.id]} onChange={() => { handleBotonSwitch(departamento.id); }} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            
                            

                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default MostrarDep;
