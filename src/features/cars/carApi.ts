import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Car, CreateCarPayload, UpdateCarPayload } from "../../types/Car";

export async function getCarById(carId: number): Promise<Car> {
    try {
        const { data } = await apiClient.get<ApiResponse<Car>>(`/cars/${carId}`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function createCar(payload: CreateCarPayload): Promise<Car> {
    try {
        const { data } = await apiClient.post<ApiResponse<Car>>("/cars", payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function updateCar(carId: number, payload: UpdateCarPayload): Promise<Car> {
    try {
        const { data } = await apiClient.put<ApiResponse<Car>>(`/cars/${carId}`, payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function deleteCar(carId: number): Promise<void> {
    try {
        await apiClient.delete(`/cars/${carId}`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function searchCar(regex: string, brand: string): Promise<Car[]> {
    try{
        const {data} = await apiClient.get<ApiResponse<Car[]>>(`/cars/search`, {
            params: {
                q: regex,
                brand: brand,
            },
            showGlobalLoader: false,
        });
        return data.data;
    }catch(error){
        throw new Error(extractApiErrorMessage(error));
    }
}