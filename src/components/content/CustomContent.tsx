import { useState, useEffect } from "react";
import { useEditor } from "@/contexts/EditorContext";
import ContentBlock from "./ContentBlock";
import { toast } from "sonner";
import { saveToStorage, loadFromStorage } from "@/utils/storage";

type ContentBlockType = {
  id: string;
  type: "title" | "subtitle" | "paragraph" | "image";
  content: string;
  style?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
  };
};

const CustomContent = () => {
  const { isEditing } = useEditor();
  const [blocks, setBlocks] = useState<ContentBlockType[]>([]);

  useEffect(() => {
    const savedContent = loadFromStorage().customContent || [];
    setBlocks(savedContent);
  }, []);

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    saveToStorage({ customContent: newBlocks });
    toast.success("Content block deleted");
  };

  const updateBlock = (id: string, updatedBlock: ContentBlockType) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? updatedBlock : block
    );
    setBlocks(newBlocks);
    saveToStorage({ customContent: newBlocks });
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {blocks.map((block) => (
            <ContentBlock
              key={block.id}
              id={block.id}
              initialContent={block}
              onDelete={deleteBlock}
              onUpdate={updateBlock}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomContent;