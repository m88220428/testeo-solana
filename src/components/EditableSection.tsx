import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor } from '@/contexts/EditorContext';
import { GripVertical } from 'lucide-react';

interface EditableSectionProps {
  id: string;
  children: React.ReactNode;
}

const EditableSection = ({ id, children }: EditableSectionProps) => {
  const { isEditing } = useEditor();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {isEditing && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move"
        >
          <GripVertical className="h-6 w-6 text-gray-400" />
        </div>
      )}
      {children}
    </div>
  );
};

export default EditableSection;