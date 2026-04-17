import ImageResizer from "react-native-image-resizer";

export const compressImage = async (uri) => {
    try {
        const result = await ImageResizer.createResizedImage(
            uri,
            800,
            800,
            "JPEG",
            70
        );
        return result.uri;
    } catch (err) {
        console.log("❌ Image compression error:", err);
        return uri; // fallback
    }
};
