import { api } from "~/utils/api";

type DiagramProps = {
  diagramText: string;
  width?: number;
  height?: number;
};

export const Diagram = ({ diagramText, width, height} : DiagramProps) => {
  const { data: svgContent, isLoading } = api.diagram.fetchSvgPost.useQuery({text: diagramText});
  
  let styleText = ''
  if (width && height) {
    styleText = `style="width: ${width}px; height: ${height}px;"`
  } else if (width) {
    styleText = `style="width: ${width}px;"`
  } else if (height) {
    styleText = `style="height: ${height}px;"`
  }

  return (
    <div>
      {/* Display fetched SVG content if available */}
      {svgContent ? (
        <div dangerouslySetInnerHTML={{ __html: svgContent.replace('<svg', `<svg ${styleText}`),
        }} />
      ) : (
        <p>{isLoading ? ("Loading...") : ("Error fetching SVG content.")}</p>
      )}
    </div>
  );
};