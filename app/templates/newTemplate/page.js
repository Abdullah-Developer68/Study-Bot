// ---------- THIS IS MDX EDITOR IMPLEMENTATION -----------

// "use client";
// import dynamic from "next/dynamic";
// import { useState } from "react";

// // This tells Next.js: "Only load this on the client's computer"
// const Editor = dynamic(() => import("@/components/mdEditor/mdEditor"), {
//   ssr: false,
// });

// const NewTemplate = () => {
//   const [content, setContent] = useState(
//     "# My New Document\nStart typing here...",
//   );

//   return (
//     <div className="p-8 w-full bg-gray-400 mx-auto flex flex-col items-center justify-center">
//       <Editor markdown={content} onChange={(v) => setContent(v)} />

//       <div className="mt-10 p-4 bg-gray-50 rounded border">
//         <h2 className="text-sm font-mono text-gray-500 mb-2">
//           Saved Markdown Output:
//         </h2>
//         <pre className="text-xs">{content}</pre>
//       </div>
//     </div>
//   );
// };

// export default NewTemplate;

// ---------- THE FOLLOWING IS TIPTAP IMPLEMENTATION -------------
import Tiptap from "@/components/tiptab/Tiptab";

const newTemplate = () => {
  return (
    <>
      <Tiptap />
    </>
  );
};

export default newTemplate;
