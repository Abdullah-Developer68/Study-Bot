// "use client";
// import { useEditorState } from "@tiptap/react";
// import { Highlighter } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Button } from "@/components/ui/button";

// const HighLight = ({ editor }) => {
//   const editorState = useEditorState({
//     editor,
//     selector: () => {
//       if (!editor) {
//         return null;
//       }

//       return {
//         isHighlightActive: editor.isActive("highlight") ?? false,
//       };
//     },
//   });
//   return (
//     <>
//       <div className="control-group">
//         <div className="button-group">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 onClick={() => editor.chain().focus().toggleHighlight().run()}
//                 className={editor.isActive("highlight") ? "is-active" : ""}
//               >
//                 <Highlighter size={24} />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Highlighter</TooltipContent>
//           </Tooltip>

//           <button
//             onClick={() =>
//               editor.chain().focus().toggleHighlight({ color: "#ffc078" }).run()
//             }
//             className={
//               editor.isActive("highlight", { color: "#ffc078" })
//                 ? "is-active"
//                 : ""
//             }
//           >
//             Orange
//           </button>
//           <button
//             onClick={() =>
//               editor.chain().focus().toggleHighlight({ color: "#8ce99a" }).run()
//             }
//             className={
//               editor.isActive("highlight", { color: "#8ce99a" })
//                 ? "is-active"
//                 : ""
//             }
//           >
//             Green
//           </button>
//           <button
//             onClick={() =>
//               editor.chain().focus().toggleHighlight({ color: "#74c0fc" }).run()
//             }
//             className={
//               editor.isActive("highlight", { color: "#74c0fc" })
//                 ? "is-active"
//                 : ""
//             }
//           >
//             Blue
//           </button>
//           <button
//             onClick={() =>
//               editor.chain().focus().toggleHighlight({ color: "#b197fc" }).run()
//             }
//             className={
//               editor.isActive("highlight", { color: "#b197fc" })
//                 ? "is-active"
//                 : ""
//             }
//           >
//             Purple
//           </button>
//           <button
//             onClick={() =>
//               editor.chain().focus().toggleHighlight({ color: "red" }).run()
//             }
//             className={
//               editor.isActive("highlight", { color: "red" }) ? "is-active" : ""
//             }
//           >
//             Red
//           </button>

//           <button
//             onClick={() => editor.chain().focus().unsetHighlight().run()}
//             disabled={!editor.isActive("highlight")}
//           >
//             Unset highlight
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HighLight;

"use client";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";

const HighLight = ({ editor }) => {
  return (
    <>
      <ColorHighlightPopover
        editor={editor}
        hideWhenUnavailable={true}
        onApplied={({ color, label }) =>
          console.log(`Applied highlight: ${label} (${color})`)
        }
      />
    </>
  );
};

export default HighLight;
