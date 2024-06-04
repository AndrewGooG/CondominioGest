import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { Card, CardImg, CardBody, CardTitle , CardText} from 'reactstrap';
import Cookies from 'universal-cookie';
const endpoint = 'http://localhost:8000/api';
const endpointImg = 'http://localhost:8000';
const cookies = new Cookies();
const VisualizarBloques = () => {
    const [bloques, setBloques] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getAllBloques();
        cookies.remove('idBloque');
    }, []);
    const getAllBloques = async () => {
        try {
            const response = await axios.get(`${endpoint}/bloques`);
            const bloques = response.data;
            setBloques(bloques);
        } catch (error) {
            console.error('Error al obtener bloques:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickEdificios = (idBloque) => {
        cookies.set('idBloque', idBloque);
        window.location.href = '/dashboard/edificios';
    };
    return (
        <>
            <h1 className="title">Bloques</h1>
            {isLoading ? (
                <div className="d-flex justify-content-center my-5">
                    <ClipLoader color={'#5B9223'} loading={isLoading} size={50} />
                </div>
            ):(
            <div className="row">
                {bloques.map((bloque) => (
                    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3" key={bloque.id}>
                        <Card className="mt-3 mb-3 flex-fill cardDepa" onClick={() => handleClickEdificios(bloque.id)}>
                            <CardImg
                                alt="Card image cap"
                                src={`${endpointImg}/${bloque.imagen_bloque}`}
                                style={{ objectFit: "cover", width: "100%", height: "235px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                            />
                            <CardBody className="d-flex flex-column justify-content-between align-items-stretch">
                                <CardTitle>
                                    <p id="infoEdifcio">Bloque: {bloque.nombre_bloque}</p>
                                </CardTitle>
                                <CardText>
                                    <p id="infoEdifcio">Descripción: {bloque.descripcion_bloque}</p>
                                </CardText>
                            </CardBody>
                        </Card>
                    </div>
                ))}
            </div>
            )}
        </>
    );
}
export default VisualizarBloques;
