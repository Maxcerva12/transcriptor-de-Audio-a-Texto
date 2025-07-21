import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy para obtener los modelos disponibles desde el backend
 */
export async function GET(request: NextRequest) {
  try {
    // URL del backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://transcriptor-de-audio-a-texto-back.onrender.com';

    // Enviar la solicitud al backend
    console.log(`Proxy: Obteniendo modelos de ${apiUrl}/api/v1/models`);
    const response = await fetch(`${apiUrl}/api/v1/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      console.error(`Error al obtener modelos: ${response.status} ${response.statusText}`);
      
      // Si el endpoint no existe, proporcionar una lista predeterminada de modelos
      if (response.status === 404) {
        return NextResponse.json({
          models: ["tiny", "base", "small", "medium"],
          default_model: "base",
          message: "Modelos predeterminados (el endpoint del backend no existe)"
        });
      }
      
      return NextResponse.json({
        error: `Error del servidor: ${response.statusText}`,
        status: response.status,
      }, {
        status: response.status
      });
    }

    // Procesar la respuesta del backend
    const data = await response.json();
    
    // Devolver la respuesta al frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener modelos:', error);
    
    // En caso de error, proporcionar una lista predeterminada de modelos
    return NextResponse.json({
      models: ["tiny", "base", "small", "medium"],
      default_model: "base",
      message: "Modelos predeterminados (error de conexión)"
    });
  }
}
