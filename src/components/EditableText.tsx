import React, { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  id: string;
  defaultContent: string;
  multiline?: boolean;
  className?: string;
  darkMode?: boolean;
  onChange?: (value: string) => void;
}

const EditableText = ({ 
  id, 
  defaultContent, 
  multiline = false, 
  className,
  darkMode = false,
  onChange
}: EditableTextProps) => {
  const { isEditing, updateContent, contents } = useEditor();
  const [localContent, setLocalContent] = useState(defaultContent);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    updateContent(id, e.target.value);
    onChange?.(e.target.value);
  };

  if (!isEditing) {
    return <div className={className}>{contents[id] || defaultContent}</div>;
  }

  const inputClassName = cn(
    darkMode ? "text-white" : "text-black",
    "w-full",
    !darkMode && "bg-white border-gray-300",
    darkMode && "bg-gray-800 border-gray-700"
  );

  return multiline ? (
    <Textarea
      value={localContent}
      onChange={handleChange}
      className={cn("min-h-[100px]", inputClassName)}
    />
  ) : (
    <Input
      value={localContent}
      onChange={handleChange}
      className={inputClassName}
    />
  );
};

export default EditableText;