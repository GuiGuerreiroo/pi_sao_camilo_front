// src/hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: 'Geolocalização não é suportada pelo seu navegador.',
      });
      return;
    }

    // Função de sucesso ao capturar a localização
    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    // Função de erro (ex: usuário negou a permissão)
    const handleError = (error: GeolocationPositionError) => {
      setState({
        coordinates: null,
        loading: false,
        error: error.message,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true, // Tenta usar o GPS do celular se disponível
      timeout: 10000, // Tempo máximo de espera (10 segundos)
      maximumAge: 0, // Não usa localização em cache (pega a atual)
    });

  }, []); // Executa apenas uma vez quando o componente é montado

  return state;
}