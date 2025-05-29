import { Check, Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Space from "../../space";

export default function BannerNotes() {
  const [showModal, setShowModal] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [selectedColor, setSelectedColor] = useState("linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)");

  const arrayColor = [
    "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
    "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)",
    "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)",
    "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)",
  ];

  return (
    <>
      <div
        className="cover-image-container animate__animated animate__slideInDown"
        onMouseEnter={() => setShowIcons(true)}
        onMouseLeave={() => setShowIcons(false)}
      >
        {showIcons && (
          <div className="cover-image-container-actions animate__animated animate__fadeIn">
            <Space gap={8}>
              <i>
                <Pencil
                  size={15}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowModal(true);
                    console.log("clicked");
                  }}
                />
              </i>
              <i>
                <Trash size={15} />
              </i>
            </Space>
          </div>
        )}
      </div>
      <Modal
        className="modal-container"
        show={showModal}
        centered
        onHide={() => setShowModal(false)}
      >
        <Space align="evenly">
          <p className="modal-title">Edit cover image</p>
          <i className="modal-close-icon" onClick={() => setShowModal(false)}>
            <X size={17} />
          </i>
        </Space>
        <p className="modal-description">Edit the cover image of your note.</p>
        <div>
          <hr
            className="not-faded-line"
            style={{ margin: "5px 0px", background: "#252525" }}
          />
        </div>
        <div className="cover-image-colors-container">
          {arrayColor.map((color, index) => (
            <div
              key={index}
              className={`cover-image-container-color ${
                selectedColor === color ? 'selected' : ''
              }`}
              onClick={() => setSelectedColor(color)}
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
      </Modal>
    </>
  );
}
