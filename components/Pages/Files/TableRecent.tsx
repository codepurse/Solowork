import dayjs from "dayjs";
import { Camera, File, Headphones, Pencil, Video } from "lucide-react";
import { useState } from "react";
import { UPLOAD_FILES } from "../../../constant/dummy";
import Checkbox from "../../Elements/Checkbox";
import Space from "../../space";

const formatDate = (date: string) => {
  return dayjs(date).format("DD-MM-YYYY");
};

function bytesToMB(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(decimals)} MB`;
}

const renderIcon = (type: string) => {
  switch (type) {
    case "image":
      return <Camera size={18} color="#42A5F5" />;
    case "video":
      return <Video size={18} color="#FF8A65" />;
    case "audio":
      return <Headphones size={18} color="#FFB74D" />;
    default:
      return <File size={18} color="#607D8B" />;
  }
};

function getFileCategory(
  typeOrName: string
): "image" | "video" | "document" | "unknown" {
  const type = typeOrName.toLowerCase();

  if (
    type.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(type)
  ) {
    return "image";
  }

  if (type.startsWith("video/") || /\.(mp4|mov|avi|mkv|webm)$/.test(type)) {
    return "video";
  }

  if (
    type.startsWith("application/") ||
    /\.(pdf|docx?|xlsx?|pptx?|txt|csv|rtf)$/.test(type)
  ) {
    return "document";
  }

  return "unknown";
}

export default function TableRecent() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(UPLOAD_FILES.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles((prev) => [...prev, fileId]);
    } else {
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    }
  };

  return (
    <div className="file-table">
      <table className="file-table-table">
        <thead>
          <tr>
            <th>
              <Checkbox
                style={{ paddingTop: "4px" }}
                id="select-all"
                checked={selectedFiles.length === UPLOAD_FILES.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th>File Name</th>
            <th>Type</th>
            <th>Uploaded Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {UPLOAD_FILES.map((file) => (
            <tr key={file.id}>
              <td
                style={{
                  maxWidth: "20px",
                  width: "20px",
                  marginTop: "-10px",
                }}
              >
                <Checkbox
                  style={{ marginTop: "-25px" }}
                  id={file.id}
                  checked={selectedFiles.includes(file.id)}
                  onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                />
              </td>
              <td>
                <Space gap={0}>
                  <div>
                    <span className="file-table-name">{file.name}</span>
                    <p className="file-table-size">{bytesToMB(file.size)}</p>
                  </div>
                </Space>
              </td>

              <td>{file.type}</td>
              <td>{formatDate(new Date().toISOString())}</td>
              <td>
                <Space gap={10}>
                  <i>
                    <Pencil size={15} color="lightgray" />
                  </i>
                </Space>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
