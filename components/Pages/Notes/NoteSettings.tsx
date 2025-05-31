import {
  Copy,
  EyeOff,
  Footprints,
  Move,
  PencilOff,
  Pin,
  Printer,
  Save,
  ScanEye,
  SpellCheck,
  Trash
} from "lucide-react";
import { useState } from "react";
import Switch from "../../Elements/Switch";
import Space from "../../space";

export default function NoteSettings() {
  const [hideNotesBanner, setHideNotesBanner] = useState(false);
  const [spellCheck, setSpellCheck] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <div className="note-settings">
      <div className="note-settings-content">
        <Space gap={5} align="evenly" className="note-settings-content-item">
          <Space gap={8}>
            <i>
              <EyeOff color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Hide banner</p>
          </Space>
          <Switch
            checked={hideNotesBanner}
            onChange={() => setHideNotesBanner(!hideNotesBanner)}
            size="small"
          />
        </Space>
        <Space gap={5} align="evenly" className="note-settings-content-item">
          <Space gap={8}>
            <i>
              <ScanEye color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Focus mode</p>
          </Space>
          <Switch
            checked={focusMode}
            onChange={() => setFocusMode(!focusMode)}
            size="small"
          />
        </Space>
        <Space gap={5} align="evenly" className="note-settings-content-item">
          <Space gap={8}>
            <i>
              <Footprints color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Show footer</p>
          </Space>
          <Switch
            checked={showFooter}
            onChange={() => setShowFooter(!showFooter)}
            size="small"
          />
        </Space>
        <hr className="not-faded-line" />

        <Space gap={5} align="evenly" className="note-settings-content-item">
          <Space gap={8}>
            <i>
              <SpellCheck color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Spell check</p>
          </Space>
          <Switch
            checked={spellCheck}
            onChange={() => setSpellCheck(!spellCheck)}
            size="small"
          />
        </Space>
        <Space gap={5} align="evenly" className="note-settings-content-item">
          <Space gap={8}>
            <i>
              <Save color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Auto save</p>
          </Space>
          <Switch
            checked={autoSave}
            onChange={() => setAutoSave(!autoSave)}
            size="small"
          />
        </Space>

        <Space gap={5} align="evenly" className="note-settings-content-item">
          <Space gap={8}>
            <i>
              <PencilOff color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Read only</p>
          </Space>
          <Switch
            checked={readOnly}
            onChange={() => setReadOnly(!readOnly)}
            size="small"
          />
        </Space>
        <hr className="not-faded-line" />
        <div>
          <Space gap={8} className="note-settings-content-item">
            <i>
              <Copy color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Copy to</p>
          </Space>
          <Space gap={8} className="note-settings-content-item">
            <i>
              <Move color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Move to</p>
          </Space>
          <Space gap={8} className="note-settings-content-item">
            <i>
              <Pin color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Pin note</p>
          </Space>
          <Space gap={8} className="note-settings-content-item">
            <i>
              <Printer color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Print note</p>
          </Space>
          <Space gap={8} className="note-settings-content-item">
            <i>
              <Trash color="#fff" size={16} />
            </i>
            <p className="note-settings-content-title">Delete note</p>
          </Space>
        </div>
      </div>
    </div>
  );
}
