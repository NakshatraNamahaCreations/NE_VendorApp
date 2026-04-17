// // import { Video } from "react-native-video-compressor";
// import VideoCompressor from "react-native-video-compressor";


// export const compressVideo = async (uri) => {
//     try {
//         console.log("🎥 Compressing video:", uri);

//         const compressed = await VideoCompressor.compress(
//             uri,
//             {
//                 compressionMethod: "auto",
//                 maxSize: 720,
//                 quality: "medium",
//             },
//             (progress) => {
//                 console.log("Video Compression Progress:", progress);
//             }
//         );

//         console.log("✅ Compressed Video:", compressed);
//         return compressed;
//     } catch (err) {
//         console.log("❌ Video compression error:", err);
//         return uri;
//     }
// };
