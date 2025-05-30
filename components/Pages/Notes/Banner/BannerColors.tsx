import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function BannerColors({ onSelect }: any) {
  const [selectedColor, setSelectedColor] = useState(
    "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)"
  );
  const [buttonSizes, setButtonSizes] = useState<string[]>([]);

  const arrayColor = [
    "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
    "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)",
    "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)",
    "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)",
    "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)",
    "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)",
  ];

  useEffect(() => {
    // Generate random sizes for each button
    const sizes = arrayColor.map(() => {
      const randomSize = Math.floor(Math.random() * 3);
      return ["small", "medium", "large"][randomSize];
    });
    setButtonSizes(sizes);
  }, []); // Only run once on mount

  return (
    <div style={{ overflow: "hidden" }}>
      <div className="cover-image-colors-container animate__animated animate__slideInLeft">
        {arrayColor.map((color, index) => (
          <div
            key={index}
            className={`cover-image-container-color ${buttonSizes[index]} ${
              selectedColor === color ? "selected" : ""
            }`}
            onClick={() => {
              console.log(color);
              setSelectedColor(color);
              onSelect(color);
            }}
            style={{ background: color }}
          >
            {selectedColor === color && (
              <div className="check-icon">
                <Check size={16} color="white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
