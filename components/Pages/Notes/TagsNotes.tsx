import { X } from "lucide-react";
import Button from "../../Elements/Button";
import Text from "../../Elements/Text";

interface TagsNotesProps {
  onClose: () => void;
}

export default function TagsNotes({ onClose }: Readonly<TagsNotesProps>) {
  return (
    <div className="tags-notes animate__animated animate__fadeIn">
      <div className="tags-notes-header">
        <span>Add tags</span>
        <i onClick={onClose}>
          <X size={18} color="#bdbdbd" />
        </i>
      </div>
      <hr className="not-faded-line" style={{ margin: "5px 0px" }} />
      <Text placeholder="Add tag" variant="sm" className="mt-1" />
      <Button size="sm" fill className="mt-1">
        Add tag
      </Button>
    </div>
  );
}
