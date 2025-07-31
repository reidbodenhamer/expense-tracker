import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";
import { isAxiosError } from "axios";

export const uploadImage = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post<{ imageUrl: string }>(
            API_PATHS.IMAGE.UPLOAD_IMAGE,
            formData, 
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Image upload failed");
        } else {
            throw new Error("An unexpected error occurred during image upload");
        }
    }
}

export default uploadImage;