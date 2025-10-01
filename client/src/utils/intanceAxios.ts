import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Definir tipos para las respuestas y errores, según tu API
interface ApiError {
  message?: string;
  errorMsg?: any;
  // Otros campos según la estructura de tus errores
}

// Crear una instancia de Axios con opciones comunes
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_URL_API}`,
  headers: {
    "Content-Type": "application/json",
    // Otros encabezados comunes
  },
});

// Función para realizar peticiones utilizando la instancia creada
async function InstanceOfAxios<T>(
  ruta: string,
  metodo: string,
  datos?: any,
  token?: string // Token opcional como parámetro
  ): Promise<T | ApiError> {
  
    
  
  try {
    // Configurar opciones de la petición
    const options: AxiosRequestConfig = {
      method: metodo,
      url: ruta,
      data: datos,
      headers: {
        ...axiosInstance.defaults.headers, // Copiar encabezados comunes
        "user-token": token, // Añadir token como "user-token"
      } as any,
      // Otras opciones específicas de la petición
    };
    const response: AxiosResponse<T> = await axiosInstance.request(options);


    // Manejar la respuesta según tus necesidades
    // console.log(response.data);

    return response.data;
  } catch (error: any) {
    // Manejar errores
    const apiError: ApiError = {
      message: "Error al procesar la solicitud.",
      errorMsg: error.response?.data.error,
      // Otros campos según la estructura de tus errores
    };

    return apiError;
  }
}

export default InstanceOfAxios;
