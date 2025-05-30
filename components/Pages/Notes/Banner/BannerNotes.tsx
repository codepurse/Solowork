import { Image, Palette, Pencil, Trash, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  NOTES_COLLECTION_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import { Tabs } from "../../../Elements/Tab/Tab";
import Space from "../../../space";
import BannerColors from "./BannerColors";
import UnsplashImage from "./UnsplashImage";

export default function BannerNotes({ selectedNote }: any) {
  const { useStoreNotes } = useStore();
  const { selectedNotes } = useStoreNotes();
  const [showModal, setShowModal] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [banner, setBanner] = useState<any>(
    "linear-gradient( -20deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)"
  );
  const router = useRouter();
  const { notes } = router.query;

  const [activeTab, setActiveTab] = useState("colors");

  const tabs = [
    { id: "colors", label: "Colors", icon: <Palette size={15} /> },
    { id: "image", label: "Image", icon: <Image size={15} /> },
  ];

  const handleSave = async () => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        (selectedNotes as any).$id,
        {
          banner: banner,
        }
      );
      mutate(`notes/${notes}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedNote) {
      setBanner(selectedNote?.banner);
    }
  }, [selectedNote]);

  const isImageUrl = (value: string) => value?.includes("http");
  const isGradient = (value: string) => value?.includes("linear-gradient");

  return (
    <>
      <div
        className="cover-image-container animate__animated animate__slideInDown"
        style={{
          backgroundImage: isImageUrl(banner)
            ? `url(${banner})`
            : isGradient(banner)
            ? banner
            : "none",
          backgroundSize: isImageUrl(banner) ? "cover" : "auto",
          backgroundPosition: isImageUrl(banner) ? "center" : "initial",
          backgroundRepeat: isImageUrl(banner) ? "no-repeat" : "initial",
        }}
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
        onHide={() => {
          setShowModal(false);
          handleSave();
        }}
      >
        <Space align="evenly">
          <p className="modal-title">Edit cover image</p>
          <i
            className="modal-close-icon"
            onClick={() => {
              setShowModal(false);
              handleSave();
            }}
          >
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
        {activeTab === "colors" && (
          <BannerColors
            onSelect={(e) => {
              setBanner(e);
            }}
          />
        )}
        {activeTab === "image" && (
          <UnsplashImage
            onSelect={(e) => {
              setBanner(e);
            }}
          />
        )}
      </Modal>
    </>
  );
}
