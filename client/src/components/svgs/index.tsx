import { SVG_PATHS } from "../../svg/svg"

type SvgProps = {
    iconName: keyof typeof SVG_PATHS;
    size?: number;
    color?: string;
  };
  
  export const SvgComponent: React.FC<SvgProps> = ({ iconName = "", size = 24, color = 'black' }) => {
    const pathData = SVG_PATHS[iconName];
    if (!pathData) return null;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d={pathData.d} />
      </svg>
    );
  }
  
  