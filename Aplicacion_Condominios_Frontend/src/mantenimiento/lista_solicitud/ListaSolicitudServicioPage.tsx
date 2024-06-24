import React, { useEffect, useState } from "react";
import "./style.css";
import { Stack, Chip, MenuItem } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import Box from "@mui/material/Box";
import {
  deleteSolicitudServicio,
  getAllSolicitudServicio,
  updateSolicitudServicio,
} from "../services/maintenance/solicitudMantenimientoService";

import { TextField } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./style.css";
import { getAllCategories } from "../services/maintenance/categoryService";
import {
  getAllPersonal,
  getPersonalByCategory,
} from "../services/maintenance/personalExternoService";
import { getAllEstados } from "../services/maintenance/estadoService";
import {
  getAllContratoPersonal,
  getContratoPersonal,
} from "../services/maintenance/contratoService";
import RegistroContratoPage from "../registro_contrato/RegistroContratoPage";

interface SolicitudServicioResponse {
  idRegistroSolicitud: number;
  idCategoria: number;
  idEstado: number;
  idPersonalExterno: number;
  descripcion: string;
  nombrePropietario: string;
  ubicacion: string;
  numerReferencia: string;
  encargado: string;
  fechaSolicitud: string;
  fechaFinalizado: string;
  categoria: { id: number; catnombre: string };
  estado: {
    idEstado: number;
    nombreEstado: string;
  };
}

interface Category {
  id: number;
  catnombre: string;
  catdescripcion: string;
  disabled: boolean;
}

interface PersonalExternoResponse {
  idPersonalExterno: number;
  nombre: string;
  telefono: string;
  direccion: string;
  categoria: { id: number; catnombre: string };
}
interface Estado {
  idEstado: number;
  nombreEstado: string;
  created_at: string;
  updated_at: string;
}

export default function PersonalPage() {
  const [solicitudesList, setSolicitudes] = useState<
    SolicitudServicioResponse[]
  >([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [servicioActual, setServicioActual] =
    useState<SolicitudServicioResponse>({
      idRegistroSolicitud: 0,
      idCategoria: 0,
      idPersonalExterno: 0,
      idEstado: 0,
      descripcion: "",
      nombrePropietario: "",
      ubicacion: "",
      numerReferencia: "",
      encargado: "",
      fechaSolicitud: "",
      fechaFinalizado: "",
      categoria: { id: 0, catnombre: "" },
      estado: {
        idEstado: 0,
        nombreEstado: "",
      },
    });
  const [categoryService, setCategoryService] = useState<Category[]>();
  const [personalExterno, setPersonalExterno] =
    useState<PersonalExternoResponse[]>();
  const [estados, setEstados] = useState<Estado[]>();
  const [estadoActual, setEstadoActual] = useState<number>(1);

  const [contratoList, setContratoList] = useState([]);

  const [disabledEstado, setDisabledEstado] = useState(true);

  const [showModalContrato, setShowModalContrato] = useState(false);

  const [solicitudActual, setSolicitudActual] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const solicitudServicio = await getAllSolicitudServicio();
      console.log("🚀 ~ loadData ~ solicitudServicio:", solicitudServicio);
      setSolicitudes(solicitudServicio);
      const categoryService = await getAllCategories();
      //console.log("🚀 ~ loadData ~ categoryService:", categoryService);
      setCategoryService(categoryService);
      // const personal = await getPersonalByCategory(servicioActual.idCategoria);
      // console.log("🚀 ~ loadData ~ personal:", personal)
      // setPersonalExterno(personal);
      const estadoData = await getAllEstados();
      //console.log("🚀 ~ loadData ~ estadoData:", estadoData);
      setEstados(estadoData);

      const responseContrato = await getAllContratoPersonal();
      console.log("🚀 ~ loadData ~ responseContrato:", responseContrato);
      setContratoList(responseContrato);
    } catch (error) {}
  };

  useEffect(() => {
    const allPersonalExterno = async () => {
      const personal = await getPersonalByCategory(servicioActual.idCategoria);
      //console.log("🚀 ~ allPersonalExterno ~ personal:", personal);
      setPersonalExterno(personal);
    };
    allPersonalExterno();
  }, [servicioActual]);

  const handleOpenModal = (solicitudServicio: SolicitudServicioResponse) => {
    if (solicitudServicio.idEstado == 3) {
      alert("Este servicio ya se ha finalizado y no se puede modificar");
    } else {
      setEstadoActual(solicitudServicio.idEstado);
      setServicioActual(solicitudServicio);

      contratoList.filter((element: any) => {
        if (element.idSolicitud == solicitudServicio.idRegistroSolicitud) {
          setDisabledEstado(false);
        }
      });

      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDisabledEstado(true);
  };

  const handleDelete = async (id: number) => {
    console.log("🚀 ~ handleDelete ~ id:", id);
    await deleteSolicitudServicio(id);
    //window.location.reload();
  };

  const handleChangeEncargado = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const encargado = personalExterno?.find((element) => {
      if (element.idPersonalExterno === parseInt(e.target.value)) {
        return element;
      } else {
        return "";
      }
    });
    if (encargado !== undefined) {
      setServicioActual({
        ...servicioActual,
        encargado: encargado.nombre,
        idPersonalExterno: encargado.idPersonalExterno,
      });
    }
  };

  const handleClickGuardar = async () => {
    console.log("DATA", servicioActual);
    const dataToSend = { ...servicioActual };

    if (servicioActual.idEstado == 3) {
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const formatedDate = `${year}-${month}-${day}`;
      dataToSend.fechaFinalizado = formatedDate;
    }

    const response = await updateSolicitudServicio(
      dataToSend.idRegistroSolicitud,
      dataToSend
    );

    window.location.reload();
  };

  // Cambio de color de registro de cotnrato
  const getContratoStyle = (estado: number) => {
    switch (estado) {
      case 1:
        return { backgroundColor: "#6c757d", color: "white" };
      case 2:
        return { backgroundColor: "#dc3545", color: "white" };
      case 3:
        return { backgroundColor: "#20c997", color: "white" };
      default:
        return {};
    }
  };

  const getContratoLabel = (estado: number) => {
    switch (estado) {
      case 1:
        return "NO ASIGNADO";
      case 2:
        return "SIN CONTRATO";
      case 3:
        return "CONTRATADO";
      default:
        return "";
    }
  };

  const clickContrato = () => {
    console.log("contratado");
  };

  const handleShowModalContrato = (idSolicitud: number) => {
    setSolicitudActual(idSolicitud);
    console.log("Para contratar");
    setShowModalContrato(true);
  };

  return (
    <>
      {showModalContrato && (
        <RegistroContratoPage
          setShowModalContrato={setShowModalContrato}
          solicitudActual={solicitudActual}
        />
      )}
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "40ch", display: "flex" },
        }}
        noValidate
      >
        <div id="content">
          <h2>Lista de solicitud de servicios</h2>

          <div className="row">
            <div className="col">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="left">Categoría</th>
                    <th className="left">Ubicación</th>
                    <th className="left">Fecha de solicitud</th>
                    <th className="left">Encargado</th>
                    <th className="left">Fecha de finalización</th>
                    <th className="left">Estado de contrato</th>
                    <th className="righ">Estado</th>
                    <th className="righ">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesList.map((solicitud) => (
                    <>
                      <tr>
                        <td>{solicitud.categoria?.catnombre}</td>
                        <td>{solicitud.ubicacion}</td>
                        <td>{solicitud.fechaSolicitud}</td>
                        <td>{solicitud.encargado}</td>
                        <td>{solicitud.fechaFinalizado}</td>

                        {/* Registro de contrato */}
                        <td>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              className="prueba_chip"
                              style={getContratoStyle(
                                contratoList.some(
                                  (element: any) =>
                                    element.idSolicitud ===
                                    solicitud.idRegistroSolicitud
                                )
                                  ? 3
                                  : solicitud.encargado === null
                                  ? 1
                                  : 2
                              )}
                              label={getContratoLabel(
                                contratoList.some(
                                  (element: any) =>
                                    element.idSolicitud ===
                                    solicitud.idRegistroSolicitud
                                )
                                  ? 3
                                  : solicitud.encargado === null
                                  ? 1
                                  : 2
                              )}
                              onClick={
                                contratoList.some(
                                  (element: any) =>
                                    element.idSolicitud ===
                                    solicitud.idRegistroSolicitud
                                )
                                  ? clickContrato
                                  : solicitud.encargado === null
                                  ? () =>
                                      alert("Primero debe asignar un personal")
                                  : () =>
                                      handleShowModalContrato(
                                        solicitud.idRegistroSolicitud
                                      )
                              }
                            />
                          </Stack>
                        </td>
                        <td>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={estados?.map((element) => {
                                if (element.idEstado === solicitud.idEstado) {
                                  return element.nombreEstado;
                                }
                              })}
                              color="primary"
                            />
                          </Stack>
                        </td>
                        <td className="actions-container">
                          <button
                            className="button_editt"
                            type="button"
                            onClick={() => handleOpenModal(solicitud)}
                          >
                            <CreateOutlinedIcon
                              className="c-dark-blue "
                              fontSize="medium"
                            />
                          </button>
                          <button
                            className="button_deletee"
                            type="button"
                            onClick={() =>
                              handleDelete(solicitud.idRegistroSolicitud)
                            }
                          >
                            <DeleteOutlinedIcon
                              className="c-dark-blue "
                              fontSize="medium"
                            />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Box>
      <>
        {showModal && (
          <div id="" className="modal-servicio">
            <div className="modal-content-servicio">
              <div className="row">
                <div className="col text-xl">SERVICIOS</div>
                <div className="col text-right-servicio">
                  <CloseOutlinedIcon
                    className="close-btn"
                    fontSize="large"
                    onClick={handleCloseModal}
                  />
                </div>
              </div>

              <div className="width-80 margin-x-auto-servicio">
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": {
                      m: 1,
                      width: "40ch",
                      display: "flex",
                    },
                  }}
                  noValidate
                >
                  <div className="row">
                    <div className="col align-right-inputs-servicio">
                      <label htmlFor="outlined-select-currency">
                        Categoria de Servicio
                      </label>
                    </div>
                    <div className="col">
                      <TextField
                        id="outlined-select-currency"
                        value={servicioActual?.idCategoria}
                        disabled={true}
                        select
                      >
                        {categoryService?.map((option, index) => (
                          <MenuItem key={index} value={option.id}>
                            {option.catnombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs-servicio">
                      <label htmlFor="outlined-select-currency">
                        Descripción
                      </label>
                    </div>
                    <div className="col">
                      <TextField
                        id="outlined"
                        placeholder="Ingrese la descripción del servicio"
                        value={servicioActual?.descripcion}
                        disabled={true}
                        multiline
                      />
                    </div>
                  </div>
                  <>{console.log(servicioActual)}</>
                  <div className="row">
                    <div className="col align-right-inputs-servicio">
                      <label htmlFor="outlined-select-currency">
                        Nombre Propietario
                      </label>
                    </div>
                    <div className="col">
                      <TextField
                        required
                        id="outlined"
                        placeholder="Ingrese Nombre del Propietario"
                        value={servicioActual?.nombrePropietario}
                        disabled={true}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs-servicio">
                      <label htmlFor="outlined-select-currency">Telefono</label>
                    </div>
                    <div className="col">
                      <TextField
                        required
                        id="outlined"
                        type="number"
                        placeholder="Ingrese telefono"
                        value={servicioActual?.numerReferencia}
                        disabled={true}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs-servicio">
                      <label htmlFor="outlined-select-currency">
                        Encargado
                      </label>
                    </div>
                    <div className="col">
                      <TextField
                        id="outlined-select-currency"
                        value={servicioActual.idPersonalExterno}
                        onChange={(event) => handleChangeEncargado(event)}
                        select
                      >
                        {personalExterno?.map((option, index) => (
                          <MenuItem
                            key={index}
                            value={option.idPersonalExterno}
                          >
                            {option.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs-servicio">
                      <label htmlFor="outlined-select-currency">Estado</label>
                    </div>
                    <div className="col">
                      <TextField
                        id="outlined-select-currency"
                        value={estadoActual}
                        disabled={disabledEstado}
                        onChange={(event) => {
                          setEstadoActual(parseInt(event.target.value));
                          setServicioActual({
                            ...servicioActual,
                            idEstado: parseInt(event.target.value),
                          });
                        }}
                        select
                      >
                        {estados?.map((option, index) => (
                          <MenuItem key={index} value={option.idEstado}>
                            {option.nombreEstado}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs-servicio">
                      <label htmlFor="outlined-select-currency">Costo</label>
                    </div>
                    <div className="col">
                      <TextField
                        required
                        id="outlined"
                        //label="Costo"
                        type="number"
                        placeholder="Ingrese Costo"
                      />
                    </div>
                  </div>
                  <div className="center-button">
                    <button
                      className="block_button block_button_personalize margin-x-auto-servicio"
                      type="button"
                      onClick={handleClickGuardar}
                    >
                      Guardar
                    </button>
                  </div>
                </Box>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}
