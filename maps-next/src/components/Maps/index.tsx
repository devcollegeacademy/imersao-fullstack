import { useContext, useRef, useEffect } from "react";
import { ContentMap } from "./styles";
import { CustomerContext } from "@/contexts/CustomerContext";
import instance from "@/services/axios";

interface Coords {
    lat: number;
    lng: number;
}

export default function Maps() {
    const { customers, setCustomers } = useContext(CustomerContext);

    let directionsService: any;
    let directionsRenderer: any;
    const map = useRef<HTMLDivElement>(null);
    const routes = useRef<HTMLDivElement>(null);
    let currentLocation: Coords;

    const getCoords = async (address: string): Promise<Coords> => {
        try {
            return new Promise((resolve, reject) => {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address }, (results: any, status: any) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        const location = results[0].geometry.location;
                        const lat = location.lat();
                        const lng = location.lng();
                        resolve({ lat, lng });
                    } else {
                        reject(`Geocodificação falhou para o endereço: ${address}`);
                    }
                });
            });
        } catch (error: any) {
            console.error("Erro ao obter coordenadas:", error.message);
            throw error;
        }
    };

    const getCurrentLocation = async (): Promise<Coords> => {
        try {
            if ("geolocation" in navigator) {
                const position: GeolocationPosition = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude: lat, longitude: lng } = position.coords;
                return { lat, lng };
            } else {
                console.error("Geolocalização não é suportada neste navegador.");
                throw new Error("Geolocalização não é suportada neste navegador.");
            }
        } catch (error: any) {
            console.error("Erro ao obter geolocalização:", error.message);
            throw error;
        }
    }

    const addMarket = (mapInstance: google.maps.Map, destination: Coords, title: string, label: string) => {        
        const marker = new google.maps.Marker({
            position: destination,
            map: mapInstance,
            title: title,
            label: label
        });

        marker.addListener('click', () => {
            calculateAndDisplayRoute(currentLocation, destination);
        });
    };

    const initMap = async () => {
        try {
            directionsRenderer = new google.maps.DirectionsRenderer();

            currentLocation = await getCurrentLocation();
            const mapInstance = new google.maps.Map(map.current!, {
                zoom: 14,
                center: currentLocation,
                disableDefaultUI: false,
            });

            directionsRenderer.setMap(mapInstance);
            directionsRenderer.setPanel(routes.current!);

            addMarket(mapInstance, currentLocation, 'Minha Localização', '0')

            if (customers.length > 0) {
                for (let i = 0; i < customers.length; i++) {
                    const customer = customers[i];
                    const coods = await getCoords(customer.address);                
                    addMarket(mapInstance, coods, customer.title, i.toString());
                }
            }
        } catch (error: any) {
            console.error("Erro ao inicializar o mapa:", error.message);
            alert("Erro ao inicializar o mapa");
        }
    };

    const calculateAndDisplayRoute = async (origin: Coords, destination: Coords) => {
        try {
            directionsService = new google.maps.DirectionsService();
            if (!directionsService || !directionsRenderer) return;
            const response = await directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: 'DRIVING',
                language: 'pt-BR'
            });
            directionsRenderer.setDirections(response);
        } catch (error: any) {
            console.error("Falha na solicitação de direções:", error.message);
            alert("Falha na solicitação de direções");
        }
    };

    useEffect(() => {
        initMap();
    }, []);

    useEffect(() => {
        initMap();
    }, [customers, setCustomers]);

    useEffect(() => {
        (async () => {
            try {
                const response = await instance.get('/customer/filter');
                if (response.data.length > 0) {
                    setCustomers(response.data);
                } else {
                    setCustomers([]);
                }
            } catch (error: any) {
                console.error("Erro ao buscar clientes:", error.message);
                alert("Erro ao buscar clientes");
            }
        })();
    }, []);

    return (
        <ContentMap>
            <div ref={map} className="map"></div>
            <div ref={routes} className="routes"></div>
        </ContentMap>
    )
}
