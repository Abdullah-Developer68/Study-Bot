"use client";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  ListsToggle,
  codeBlockPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  // Corrected toolbar components:
  InsertCodeBlock, // Replaces CodeToggle
  CreateLink, // Replaces LinkToggle
  InsertImage, // Replaces ImageToggle
  InsertTable, // Replaces TableToggle
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const mdEditor = ({ markdown, onChange }) => {
  return (
    <MDXEditor
      markdown={markdown}
      onChange={onChange}
      className="prose max-w-none border rounded-md shadow-sm bg-white dark:bg-gray-800"
      contentEditableClassName="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
        linkPlugin(),
        imagePlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />

              {/* Corrected Toolbar Buttons */}
              <InsertCodeBlock />
              <CreateLink />
              <InsertImage />
              <InsertTable />
            </>
          ),
        }),
      ]}
    />
  );
};

export default mdEditor;
