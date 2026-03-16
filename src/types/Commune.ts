export interface CommuneApiItem {
    code: string;
    nom: string;
    codesPostaux: string[];
}

export interface CityPostalOption {
    cityName: string;
    postalCode: string;
    cityCode: string;
}