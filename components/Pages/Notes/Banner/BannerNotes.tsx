import { Image, Palette, Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Tabs } from "../../../Elements/Tab/Tab";
import Space from "../../../space";
import BannerColors from "./BannerColors";
import UnsplashImage from "./UnsplashImage";

export default function BannerNotes() {
  const [showModal, setShowModal] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  const [activeTab, setActiveTab] = useState("colors");

  const tabs = [
    { id: "colors", label: "Colors", icon: <Palette size={15} /> },
    { id: "image", label: "Image", icon: <Image size={15} /> },
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
        size="lg"
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
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(e) => setActiveTab(e)}
          />
        </div>
        {activeTab === "colors" && <BannerColors />}
        {activeTab === "image" && <UnsplashImage />}
      </Modal>
    </>
  );
}
