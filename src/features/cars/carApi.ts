import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Car, CreateCarPayload, UpdateCarPayload } from "../../types/Car";

/**
 * Fetches a single car by its unique identifier.
 *
 * @param carId Identifier of the car to retrieve.
 * @returns The car record returned by the API.
 */
export async function getCarById(carId: number): Promise<Car> {
    try {
        const { data } = await apiClient.get<ApiResponse<Car>>(`/cars/${carId}`);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Creates a new car for the currently authenticated user.
 *
 * @param payload Car data submitted to create the vehicle.
 * @returns The newly created car entity.
 */
export async function createCar(payload: CreateCarPayload): Promise<Car> {
    try {
        const { data } = await apiClient.post<ApiResponse<Car>>("/cars", payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Updates an existing car.
 *
 * @param carId Identifier of the car to update.
 * @param payload Partial car data used to update the vehicle.
 * @returns The updated car entity.
 */
export async function updateCar(carId: number, payload: UpdateCarPayload): Promise<Car> {
    try {
        const { data } = await apiClient.put<ApiResponse<Car>>(`/cars/${carId}`, payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Deletes a car by its unique identifier.
 *
 * @param carId Identifier of the car to delete.
 * @returns A promise that resolves when the deletion request succeeds.
 */
export async function deleteCar(carId: number): Promise<void> {
    try {
        await apiClient.delete(`/cars/${carId}`);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Searches cars by free-text input and an optional brand filter.
 *
 * @param regex Free-text query sent as the `q` search parameter.
 * @param brand Brand name used to narrow the search results.
 * @returns The list of cars matching the provided filters.
 */
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
