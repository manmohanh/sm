import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import type { FC } from "react";

const toolbars: string[] = [
  "heading",
  "|",
  "bold",
  "italic",
  "|",
  "numberedList",
  "bulletedList",
  "|",
  "undo",
  "redo",
];

interface EditorInterface {
  value: string;
  onChange: (v: any) => void;
}

const Editor: FC<EditorInterface> = ({ value, onChange }) => {
  const CKE = CKEditor as any;

  const handleChange = (_: any, editor: any) => {
    const v = editor.getData();
    onChange(v);
  };

  return (
    <CKE
      editor={ClassicEditor}
      config={{ toolbar: toolbars }}
      data={value}
      onChange={handleChange}
    />
  );
};

export default Editor;
