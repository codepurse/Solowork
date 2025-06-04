import { Image, Minimize, Music } from "lucide-react";
import Space from "../components/space";

export default function Focus() {
  return (
    <section className="container-focus">
      <div className="glows">
        <div className="glow"></div>
      </div>
      <div className="settings-container">
        <Space gap={20}>
          <i>
            <Music size={20} />
          </i>
          <i>
            <Image  size={20} />
          </i>
          <i>
            <Minimize  size={20} />
          </i>
        </Space>
      </div>
    </section>
  );
}
