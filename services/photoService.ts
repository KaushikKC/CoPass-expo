import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export interface PhotoResult {
  uri: string;
  width: number;
  height: number;
  type: string;
  fileName?: string;
}

class PhotoService {
  async requestPermissions(): Promise<boolean> {
    try {
      // Request camera permissions
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermission = await MediaLibrary.requestPermissionsAsync();

      return (
        cameraPermission.status === "granted" &&
        mediaPermission.status === "granted"
      );
    } catch (error) {
      console.error("Permission request error:", error);
      return false;
    }
  }

  async takePhoto(): Promise<PhotoResult | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Camera permission not granted");
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type || "image",
          fileName: asset.fileName || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error("Take photo error:", error);
      throw new Error("Failed to take photo");
    }
  }

  async pickFromGallery(): Promise<PhotoResult | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Media library permission not granted");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type || "image",
          fileName: asset.fileName || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error("Pick from gallery error:", error);
      throw new Error("Failed to pick photo from gallery");
    }
  }

  async saveToGallery(uri: string): Promise<void> {
    try {
      const hasPermission = await MediaLibrary.requestPermissionsAsync();
      if (hasPermission.status !== "granted") {
        throw new Error("Media library permission not granted");
      }

      await MediaLibrary.saveToLibraryAsync(uri);
    } catch (error) {
      console.error("Save to gallery error:", error);
      throw new Error("Failed to save photo to gallery");
    }
  }

  async getPhotosFromGallery(limit: number = 20): Promise<PhotoResult[]> {
    try {
      const hasPermission = await MediaLibrary.requestPermissionsAsync();
      if (hasPermission.status !== "granted") {
        throw new Error("Media library permission not granted");
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        first: limit,
        sortBy: MediaLibrary.SortBy.creationTime,
      });

      return media.assets.map((asset) => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: "image",
        fileName: asset.filename || undefined,
      }));
    } catch (error) {
      console.error("Get photos from gallery error:", error);
      throw new Error("Failed to get photos from gallery");
    }
  }

  async uploadPhoto(photo: PhotoResult): Promise<string> {
    try {
      // Simulate photo upload to server
      // In a real app, this would upload to your backend or cloud storage

      // Create a FormData object for upload
      const formData = new FormData();
      formData.append("photo", {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName || "photo.jpg",
      } as any);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Return a mock upload URL
      const uploadUrl = `https://your-server.com/uploads/${Date.now()}.jpg`;
      return uploadUrl;
    } catch (error) {
      console.error("Upload photo error:", error);
      throw new Error("Failed to upload photo");
    }
  }

  async compressPhoto(
    photo: PhotoResult,
    quality: number = 0.8
  ): Promise<PhotoResult> {
    try {
      // In a real app, you would use a compression library
      // For now, we'll return the original photo
      return photo;
    } catch (error) {
      console.error("Compress photo error:", error);
      throw new Error("Failed to compress photo");
    }
  }
}

export const photoService = new PhotoService();
