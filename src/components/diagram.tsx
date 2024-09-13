import { api } from "~/utils/api";

type DiagramProps = {
  url: string;
  width?: number;
  height?: number;
};

export const Diagram = ({ url, width, height} : DiagramProps) => {
  const { data: instructionString } = api.diagram.getCommitTreeInfo.useQuery({url: url});
  const { data: svgContent, isLoading } = api.diagram.fetchSvgPost.useQuery({text: instructionString??''});
  
  const styleWidth = width? width.toString() + 'px': "auto";
  console.log(styleWidth);
  return (
    <div style={{
      height: 'auto',  // Optional: Set a maximum height for the scroll area
      width: styleWidth,   // Optional: Set a maximum width for the scroll area
      backgroundColor: "#f2f2f2",
      padding: '30px 10px 0px 10px',
      borderRadius: '7px'
    }}>
      <div style={{
        overflow: 'auto',  // Enables both horizontal and vertical scrolling
        maxHeight: '100vh',  // Optional: Set a maximum height for the scroll area
        maxWidth: '100vw',   // Optional: Set a maximum width for the scroll area
      }}
      >
        {/* Display fetched SVG content if available */}
        {svgContent ? (
          <div dangerouslySetInnerHTML={{ __html: svgContent,
          }} />
        ) : (
          <p>{isLoading ? ("Loading...") : ("Error fetching SVG content.")}</p>
        )}
      </div>
    </div>
  );
};