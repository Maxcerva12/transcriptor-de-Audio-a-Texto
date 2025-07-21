import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};

/**
 * Proxy para evitar problemas de CORS con el backend en Render
 * Recibe solicitudes del frontend y las reenvía al backend
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener el cuerpo de la solicitud para reenviarlo
    const body = await request.arrayBuffer();
    
    // URL del backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://transcriptor-de-audio-a-texto-back.onrender.com';

    // Obtener los headers necesarios para mantener el tipo de contenido
    const contentType = request.headers.get('content-type');

    // Enviar la solicitud al backend
    console.log(`Proxy: Enviando solicitud a ${apiUrl}/api/v1/transcribe`);
    const response = await fetch(`${apiUrl}/api/v1/transcribe`, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': contentType || 'multipart/form-data',
      },
      // Aumentar el timeout para archivos grandes
      signal: AbortSignal.timeout(180000), // 3 minutos de timeout
    });

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      console.error(`Error en el backend: ${response.status} ${response.statusText}`);
      return new NextResponse(JSON.stringify({
        error: `Error del servidor: ${response.statusText}`,
        status: response.status,
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Procesar la respuesta del backend
    const data = await response.json();
    
    // Devolver la respuesta al frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en el proxy:', error);
    return NextResponse.json(
      { 
        error: 'Error en la comunicación con el servidor', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
