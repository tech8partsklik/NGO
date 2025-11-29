export const detectFileType = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  const videoExtensions = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"];
  return videoExtensions.includes(ext) ? "Video" : "Image";
};
