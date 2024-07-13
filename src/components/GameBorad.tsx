import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import Target from './Target';
import { TargetProps } from './Target';

import cursor from '/src/assets/slipper48.png';
interface GameBoardProps {
  targets: TargetProps[];
  onDimensionsChange: (width: number, height: number) => void;
}

const GameBoard = forwardRef<HTMLDivElement, GameBoardProps>(({ targets, onDimensionsChange }, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (innerRef.current) {
        onDimensionsChange(innerRef.current.clientWidth, innerRef.current.clientHeight);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onDimensionsChange]);

  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  return (
    <div
     ref={innerRef}
     className="w-1/2 h-[80vh] border border-black relative"
     style={{ cursor: `url(${cursor}),auto` }}
     >
      {targets.map((target) => (
        <Target key={`${target.id}`} {...target} />
      ))}
    </div>
  );
});

export default GameBoard;