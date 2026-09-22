import toast from "react-hot-toast";

import api from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";

type UploadContentImageResponse = {
  success: boolean;
  data?: { url: string; ref?: string };
};

/** Upload inline image for blog/news rich text; returns public API URL path. */
export async function uploadEditorImage(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    const name = file.name?.trim() || `pasted-image-${Date.now()}.png`;
    formData.append("image", file, name);

    const { data } = await api.post<UploadContentImageResponse>(
      "/files/content-images/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const url = data.data?.url;
    if (!url) {
      toast.error("Image upload failed");
      return null;
    }

    return url;
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Image upload failed"));
    return null;
  }
}
