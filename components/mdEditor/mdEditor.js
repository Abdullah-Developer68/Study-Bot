"use client";
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
  InsertCodeBlock,
  CreateLink,
  InsertImage,
  InsertTable,
  BlockTypeSelect,
  
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const mdEditor = ({ markdown, onChange }) => {
  return (
    <MDXEditor
      markdown={markdown}
      onChange={onChange}
      className="prose max-w-none border border-gray-300 shadow-sm bg-gray-300 w-[816px]"
      contentEditableClassName="min-h-[1056px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
        linkPlugin(),
        imagePlugin(),
        tablePlugin(),
        headingsPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarPosition: "top",
          toolbarClassName:
            "w-full border border-black sticky top-0 z-10 flex justify-center items-center",
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <BlockTypeSelect />

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
