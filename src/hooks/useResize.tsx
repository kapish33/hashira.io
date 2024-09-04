import { useState, useEffect, useRef } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export const useResize = (): [Dimensions, React.RefObject<SVGSVGElement>] => {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 2000, height: 550 });
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        });
      }
    };

    // Set initial dimensions
    handleResize();

    // Attach resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return [dimensions, ref];
};