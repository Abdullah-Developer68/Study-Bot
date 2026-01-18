"use client";
import {
  MDXEditor,
  headingsPlugin,
  toolbarPlugin,
  listsPlugin,
  quotePlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  ListsToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

// This is using MDX Editor package to create a markdown editor component
const mdEditor = ({ markdown, onChange }) => {
  return (
    <MDXEditor
      markdown={markdown}
      onChange={onChange}
      // "prose" makes it look like a real document
      className="prose max-w-none border rounded-md shadow-sm"
      contentEditableClassName="min-h-[300px] p-4 focus:outline-none"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        // This plugin builds your GUI toolbar
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
            </>
          ),
        }),
      ]}
    />
  );
};

export default mdEditor;
