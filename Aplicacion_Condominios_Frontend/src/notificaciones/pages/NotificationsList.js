import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Imprimir from "./Imprimir";

export const NotificationsList = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaComunicacion, setFechaComunicacion] = useState("");
  const [fechaRealizacion, setFechaRealizacion] = useState("");
  const [noticeToPrint, setNoticeToPrint] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/avisos")
      .then((response) => {
        if (Array.isArray(response.data.avisos)) {
          setNotices(response.data.avisos);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setTitulo("");
    setDescripcion("");
  };

  const handleTituloChange = (e) => setTitulo(e.target.value);
  const handleDescripcionChange = (e) => setDescripcion(e.target.value);

  const handleSaveNotice = () => {
    const newNotice = {
      titulo: titulo,
      descripcion: descripcion,
    };

    axios
      .post("http://127.0.0.1:8000/api/avisos", newNotice)
      .then((response) => {
        setNotices([...notices, response.data]);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error saving notice:", error);
      });
  };

  const handleDeleteNotice = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/avisos/${id}`)
      .then((response) => {
        setNotices(notices.filter((notice) => notice.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting notice:", error);
      });
  };

  const handlePrintModalClose = () => setShowPrintModal(false);

  const handlePrintNotice = (notice) => {
    setNoticeToPrint(notice);
    setShowPrintModal(true);
  };

  return (
    <div>
      <h3>Lista de Notificaciones</h3>
      <button className="btn btn-primary" onClick={handleOpenModal}>
        Agregar aviso
      </button>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNoticeTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el título"
                value={titulo}
                onChange={handleTituloChange}
              />
            </Form.Group>
            <Form.Group controlId="formNoticeSubject">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el asunto"
                value={descripcion}
                onChange={handleDescripcionChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveNotice}>
            Guardar Aviso
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPrintModal}
        onHide={handlePrintModalClose}
        centered
        size="lg"
        className="bg-body-secondary"
      >
        <Modal.Body>
          {noticeToPrint && (
            <Imprimir
              titulo={noticeToPrint.titulo}
              descripcion={noticeToPrint.descripcion}
              fechaComunicacion={fechaComunicacion}
              fechaRealizacion={fechaRealizacion}
              setFechaComunicacion={setFechaComunicacion}
              setFechaRealizacion={setFechaRealizacion}
            />
          )}
        </Modal.Body>
      </Modal>

      <table className=" mt-3 table table-striped text-center">
        <thead className="bg-primary text-white">
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(notices) &&
            notices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.titulo}</td>
                <td>{notice.descripcion}</td>
                <td>
                  <Button
                    variant="danger"
                    className="m-2"
                    onClick={() => handleDeleteNotice(notice.id)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handlePrintNotice(notice)}
                  >
                    Imprimir
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
