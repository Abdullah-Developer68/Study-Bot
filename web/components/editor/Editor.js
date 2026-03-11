"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const Editor = ({ initialContent, onChange }) => {
  return <SimpleEditor initialContent={initialContent} onChange={onChange} />;
};

export default Editor;
