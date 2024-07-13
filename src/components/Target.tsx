import { useContext, useEffect, useState, MouseEvent } from 'react';
import DataContext from '../stores/Context';

//load assets
import gpaitan from '/src/assets/target.gif';

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
  onClick: (id: number) => (event: MouseEvent<HTMLDivElement>) => void;
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
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 55,
        height: 55,
        transform: `rotate(${rotation}deg)`,
        backgroundImage: `url(${gpaitan})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
      className='overflow-hidden'
      onMouseDown={onClick(id)}>
      </div>
  );
}

export default Target;