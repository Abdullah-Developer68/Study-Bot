import BoldBtn from "./bold/BoldBtn";
import HighLight from "./highlight/HighLight";
const ToolBar = ({ editor }) => {
  return (
    <>
      <BoldBtn editor={editor} />
      <HighLight editor={editor} />
    </>
  );
};

export default ToolBar;
