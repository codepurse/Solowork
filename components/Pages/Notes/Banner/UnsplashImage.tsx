import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UnsplashImage({ onSelect }: any) {
  const UNSPLASH_ACCESS_KEY = "LKLQMX3lpwSJbnQCOH7aDVn_PDgqBTRlUjTcuYPdQwI";
  const [images, setImages] = useState([]);
  const { data } = useSWR(
    `https://api.unsplash.com/photos/random?query=landscape&count=20&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setImages(data);
    }
  }, [data]);

  return (
    <div className="cover-image-colors-container animate__animated animate__slideInLeft">
      {images.map((img, index) => (
        <img
          key={index}
          src={img.urls.regular}
          alt={img.alt_description || "Landscape"}
          className="cover-image-container-color"
          onClick={() => onSelect(img.urls.regular)}
        />
      ))}
    </div>
  );
}
