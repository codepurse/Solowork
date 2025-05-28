import { X } from "lucide-react";
import { useState } from "react";
import Button from "../../Elements/Button";
import Text from "../../Elements/Text";

interface TagsNotesProps {
  onClose: () => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}

export default function TagsNotes({
  onClose,
  tags,
  setTags,
}: Readonly<TagsNotesProps>) {
  const [newTag, setNewTag] = useState<string>("");

  const handleAddTag = () => {
    setTags([...tags, newTag]);
    onClose();
  };
  return (
    <div className="tags-notes animate__animated animate__fadeIn">
      <div className="tags-notes-header">
        <span>Add tags</span>
        <i onClick={onClose}>
          <X size={18} color="#bdbdbd" />
        </i>
      </div>
      <hr className="not-faded-line" style={{ margin: "5px 0px" }} />
      <Text
        placeholder="Add tag"
        variant="sm"
        className="mt-1"
        value={newTag}
        onChange={(e) => {
          setNewTag(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddTag();
          }
        }}
      />
      <Button size="sm" fill className="mt-1" onClick={handleAddTag}>
        Add tag
      </Button>
    </div>
  );
}
