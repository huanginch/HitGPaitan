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
  const [baseSpeed, setBaseSpeed] = useState(18);
  const [imgUrl, setImgUrl] = useState(gpaitan);
  const { isRunning, score } = useContext(DataContext);

  useEffect(() => {
    const moveTarget = () => {
      setPosition((prev) => {
        const newX = prev.x + directionX;
        const newY = prev.y + directionY;
        if (newX < 0 - offset / 2 || newX > gameBoardWidth - offset / 2 || newY < 0 - offset / 2 || newY > gameBoardHeight - offset / 2) {
          onOutOfBounds(id);
        }
        return { x: newX, y: newY };
      });
    };

    if(isRunning) { // 遊戲進行中才移動目標
      const interval = setInterval(moveTarget, baseSpeed);
      return () => clearInterval(interval);
    }
  }, [gameBoardWidth, gameBoardHeight, id, onOutOfBounds, directionX, directionY, offset, isRunning, baseSpeed]);

  useEffect(() => {
    if (score > 0 && score % 10 === 0) { // Speed up every 10 points
      setBaseSpeed((prev) => Math.max(10, prev - 3)); // Adjust the decrement as needed
    }
  }, [score]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setImgUrl(dead);
    //stop moving after click and wait for 300ms to remove the target
    setBaseSpeed(1000);
    onClick(id);
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