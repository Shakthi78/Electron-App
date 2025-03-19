import { Excalidraw } from "@excalidraw/excalidraw";
// import { useRef } from "react";

const WhiteBoard = () => {
  // const excalidrawRef = useRef(null);
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Excalidraw Example</h1>
      <div style={{ height: "500px" }}>
      <Excalidraw />
    </div>
    </>
    
  )
}

export default WhiteBoard