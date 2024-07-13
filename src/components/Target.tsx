import { useContext, useEffect, useState } from 'react';
import DataContext from '../stores/Context';

//load assets
const gpaitan = '/src/assets/target.gif';

export type TargetProps = {
  id: number;
  initialX: number;
  initialY: number;
  directionX: number;
  directionY: number;
  rotation: number;
  gameBoardWidth: number;
  gameBoardHeight: number;
  offset: number;
  onClick: (id: number) => void;
  onOutOfBounds: (id: number) => void;
}

function Target({ id, initialX, initialY, directionX, directionY, rotation, gameBoardWidth, gameBoardHeight, offset, onClick, onOutOfBounds }: TargetProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const { isRunning } = useContext(DataContext);

  useEffect(() => {
    const moveTarget = () => {
      setPosition((prev) => {
        const newX = prev.x + directionX;
        const newY = prev.y + directionY;
        if (newX < 0 || newX > gameBoardWidth - offset || newY < 0 || newY > gameBoardHeight - offset) {
          onOutOfBounds(id);
        }
        return { x: newX, y: newY };
      });
    };

    if(isRunning) { // 遊戲進行中才移動目標
      const interval = setInterval(moveTarget, 50);
      return () => clearInterval(interval);
    }
  }, [gameBoardWidth, gameBoardHeight, id, onOutOfBounds, directionX, directionY, offset, isRunning]);

  return (
    <img
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 50,
        height: 50,
        transform: `rotate(${rotation}deg)`,
      }}
      className='overflow-hidden'
      onClick={() => onClick(id)}
      src={gpaitan}
      alt="G" />
  );
}

export default Target;