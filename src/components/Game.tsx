import { useState, useEffect, useContext, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faRotateRight, faStop } from '@fortawesome/free-solid-svg-icons';
import Menu from './Menu';
import GameBoard from './GameBorad';
import { TargetProps } from './Target';
import DataContext from '../stores/Context';

import soundEffect from '/src/assets/hit.m4a';

function Game() {
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [time, setTime] = useState(30); // 遊戲時間30秒
  const [generateRate, setGenerateRate] = useState(400); // 生成目標的速率[ms]
  const [isMenuVisible, setIsMenuVisible] = useState(true); // 菜單是否可見
  const [gameBoardWidth, setGameBoardWidth] = useState(0); // 游戏区域宽度
  const [gameBoardHeight, setGameBoardHeight] = useState(0); // 游戏区域高度
  const [soundOn, setSoundOn] = useState(true); // 是否開啟音效
  const [menuInfo, setMenuInfo] = useState({
    title: '消滅G白湯', text:'', btnText:'開始遊戲', handleClick: () => {} }); // 菜單信息
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isRunning, setIsRunning, score, setScore }  = useContext(DataContext); // 遊戲是否在運行

  const updateDimensions = (width: number, height: number) => {
    setGameBoardWidth(width);
    setGameBoardHeight(height);
  };

  useEffect(() => {
    // 設置菜單初始狀態
    setMenuInfo({ title: '消滅G白湯', text:'', btnText:'開始遊戲', handleClick: startGame });
    if(audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  },[]);

  useEffect(() => {
    if(isRunning) {
      const interval = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (time === 0) {
      setIsRunning(false);
      setTargets([]);
      setMenuInfo({ title: `遊戲結束`, text:`總得分: ${ score }`, btnText: '重新開始', handleClick: restartGame });
      setIsMenuVisible(true);
    }

    if(isRunning) {
      const generateTarget = () => {
        // 随机选择生成边界
        const border = Math.floor(Math.random() * 4);
        const offset = 80; // 目標大小
        let initialX, initialY, directionX, directionY;

        switch (border) {
          case 0: // 上边界
            initialX = Math.random() * (gameBoardWidth - offset);
            initialY = 0;
            directionX = (Math.random() - 0.5) * 4;
            directionY = 2 + Math.random() * 2;
            break;
          case 1: // 右边界
            initialX = gameBoardWidth - offset;
            initialY = Math.random() * (gameBoardHeight - offset);
            directionX = -(2 + Math.random() * 2);
            directionY = (Math.random() - 0.5) * 4;
            break;
          case 2: // 下边界
            initialX = Math.random() * (gameBoardWidth - offset);
            initialY = gameBoardHeight - offset;
            directionX = (Math.random() - 0.5) * 4;
            directionY = -(2 + Math.random() * 2);
            break;
          case 3: // 左边界
            initialX = 0;
            initialY = Math.random() * (gameBoardHeight - offset);
            directionX = 2 + Math.random() * 2;
            directionY = (Math.random() - 0.5) * 4;
            break;
          default:
            initialX = 0;
            initialY = 0;
            directionX = 0;
            directionY = 0;
        }

        // 根據位移方向旋轉角度;
        const rotation = Math.atan2(directionY, directionX) * (180 / Math.PI) + 90;

        const newTarget = {
          id: Date.now(),
          initialX,
          initialY,
          directionX,
          directionY,
          rotation,
          gameBoardWidth,
          gameBoardHeight,
          offset,
          onClick: handleTargetClick,
          onOutOfBounds: (id: number) => {
            setTargets((prev) => prev.filter((target) => target.id !== id));
          }
        };
        setTargets((prev) => [...prev, {...newTarget}]);
      };

      const interval = setInterval(generateTarget, generateRate); // 每秒生成一個新目標
      return () => clearInterval(interval);
    }

  }, [time, isRunning, gameBoardWidth, gameBoardHeight, generateRate, setIsRunning, score]);

  useEffect(() => {
    
    if (score > 0 && score % 5 === 0) {
      // 每得到5分，生成速率增加，最快生成速率為300ms
      setGenerateRate((prev) => Math.max(250, prev - 50));
    }
  }, [score]);

  const handleTargetClick = (id: number) => {
    setTargets((prev) => prev.filter((target) => target.id !== id));
    setScore((prev: number) => prev + 1);
    if(audioRef.current) {
      audioRef.current.play();
      audioRef.current.currentTime = 0;
    }
  };

  

  const startGame = () => { // 開始遊戲
    setIsRunning(true);
    setGenerateRate(400);
    
    //hide menu
    setIsMenuVisible(false)
  };

  const pauseGame = () => { // 暫停遊戲
    setIsRunning(false);
    setMenuInfo({
      title: '遊戲暫停', text: '', btnText: '繼續遊戲', handleClick: startGame });

    //show menu
    setIsMenuVisible(true)
  };

  const stopGame = () => { // 停止遊戲
    setIsRunning(false);
    setTime(30);
    setScore(0);
    setTargets([]);
    setGenerateRate(400);
  };

  const restartGame = () => { // 重新開始遊戲
    stopGame();
    startGame();
  };

  const toggleSound = () => {
    setSoundOn(!soundOn);
    if(audioRef.current) {
      audioRef.current.play();
      audioRef.current.volume = soundOn ? 0 : 0.5;
    }
  }

  return (
    <div>
      {isMenuVisible && 
      <Menu
      title={menuInfo.title}
      text={menuInfo.text}
      btnText={menuInfo.btnText}
      onClick={menuInfo.handleClick} />}
      <div className='flex items-center flex-col'>
        <div className='pt-4 mb-2'>
          <p className='text-2xl mb-1'>Score: {score}</p>
          <p className='text-2xl'>Time: {time}</p>
        </div>
        <div>
          <button className='pr-5 text-lg hover:opacity-50 transition-all ease-linear' onClick={restartGame}>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          {
            isRunning ? (
              <button className='pr-5 text-lg hover:opacity-50 transition-all ease-linear' onClick={pauseGame}>
                <FontAwesomeIcon icon={faPause} />
              </button>
            ) : (
                <button className='pr-5 text-lg hover:opacity-50 transition-all ease-linear' onClick={startGame}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
            )
          }
          <button className='text-lg hover:opacity-50 transition-all ease-linear pr-5' onClick={stopGame}>
            <FontAwesomeIcon icon={faStop} />
          </button>
          <button className={`rounded-lg px-2 py-1 mb-2 hover:opacity-50 text-white ${soundOn ? "bg-red-500" : "bg-gray-400"}`} onClick={toggleSound}>
            {soundOn ? "白湯閉嘴" : "白湯給我叫"}
          </button>
        </div>
        <GameBoard targets={targets} onDimensionsChange={updateDimensions}/>
      </div>
      <audio ref={audioRef} src={soundEffect} ></audio>
    </div>
  );
}

export default Game;