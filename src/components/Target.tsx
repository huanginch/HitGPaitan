import { useContext, useEffect, useState, MouseEvent } from 'react';
import DataContext from '../stores/Context';

//load assets
import gpaitan from '/src/assets/target.gif';
import dead from '/src/assets/dead.png';

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
  const [speed, setSpeed] = useState(50);
  const [imgUrl, setImgUrl] = useState(gpaitan);
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
      if (Math.random() < 0.5) {
        setSpeed(prevSpeed => prevSpeed * 0.95);
      }
      const interval = setInterval(moveTarget, speed);
      return () => clearInterval(interval);
    }
  }, [gameBoardWidth, gameBoardHeight, id, onOutOfBounds, directionX, directionY, offset, isRunning, speed]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setImgUrl(dead);
    //stop moving after click and wait for 300ms to remove the target
    setSpeed(1000);
    setTimeout(() => onClick(id), 300);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 80,
        height: 80,
        transform: `rotate(${rotation}deg)`,
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
      className='overflow-hidden'
      onMouseDown={handleClick}>
      </div>
  );
}

export default Target;