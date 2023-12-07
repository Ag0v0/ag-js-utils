export const mimeMap: Map<string, string[]> = new Map([
  ["png", ["image/png"]],
  ["jpg", ["image/jpg", "image/pjpeg"]],
  ["jpeg", ["image/jpeg", "image/pjpeg"]],
  ["gif", ["image/gif"]],
  ["svg", ["image/svg+xml"]],
  ["pdf", ["application/pdf", "application/x-pdf"]],
  ["doc", ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]],
  ["docx", ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]],
  ["xls", ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]],
  ["xlsx", ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]],
  ["ppt", ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]],
  ["pptx", ["application/vnd.openxmlformats-officedocument.presentationml.presentation"]],
  ["zip", ["application/zip", "application/x-zip-compressed", "multipart/x-zip"]],
  ["rar", ["application/x-rar", "application/rar", "application/x-rar-compressed"]],
  ["7z", ["application/x-7z-compressed", "application/x-7z-compressed"]],
  ["mp3", ["audio/mpeg"]],
  ["mp4", ["video/mp4"]],
  ["avi", ["video/x-msvideo", "video/avi"]],
  ["webm", ["video/webm"]],
]);

export function isMime(string: string = ""): boolean {
  const reg = /^[-\w]+\/[-\w+.]+$/;
  return reg.test(string);
}

export function getExtension(mime: string = ""): string | null {
  if (!isMime(mime)) {
    console.error(`mime '${mime}' is not valid`);
    return null;
  }

  const entry = [...mimeMap.entries()].find((entry) => entry[1].includes(mime));

  return entry ? entry[0] : null;
}

export function getMimeType(extension: string, all = false) {
  if (!extension) return null;
  const mimes = mimeMap.get(extension) || [];
  return all ? mimes : mimes[0];
}

export function getTypesByCategory(category: "image" | "video" | "audio" | "other"): string[] {
  return [...mimeMap.entries()]
    .filter((entry) => entry[1].some((el) => el.split("/")[0] === category))
    .map((entry) => entry[1])
    .flat();
}
