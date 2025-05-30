import { useEffect, useState } from "react";

export default function UnsplashImage() {
  const UNSPLASH_ACCESS_KEY = "LKLQMX3lpwSJbnQCOH7aDVn_PDgqBTRlUjTcuYPdQwI";
  const [images, setImages] = useState([]);
  const repeatedImages = [...images, ...images];

  useEffect(() => {
    fetch(
      `https://api.unsplash.com/photos/random?query=landscape&count=6&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Error fetching Unsplash images:", err));
  }, []);

  return (
    <div className="gallery-container">
      <div className="row-gallery row-3">
        {repeatedImages.slice(0, 3).map((img, index) => (
          <img
            key={index}
            src={img.urls.regular}
            alt={img.alt_description || "Landscape"}
          />
        ))}
      </div>

      <div className="row-gallery row-2">
        {repeatedImages.slice(3, 5).map((img, index) => (
          <img
            key={index + 3}
            src={img.urls.regular}
            alt={img.alt_description || "Landscape"}
          />
        ))}
      </div>

      <div className="row-gallery row-1">
        <img
          src={repeatedImages[5 % repeatedImages.length]?.urls.regular}
          alt={
            repeatedImages[5 % repeatedImages.length]?.alt_description ||
            "Landscape"
          }
        />
      </div>
    </div>
  );
}
