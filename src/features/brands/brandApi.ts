import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Brand } from "../../types/Brand";

/**
 * Retrieves the list of car brands exposed by the catalog API.
 *
 * @returns An array of available car brands.
 */
export async function getBrands(): Promise<Brand[]> {
    try {
        const { data } = await apiClient.get<ApiResponse<Brand[]>>("/brands");
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}
