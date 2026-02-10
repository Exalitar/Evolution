import React from 'react';
import './Laboratory.css';

export const Laboratory = () => {
  const handleRoomClick = (roomNumber: number) => {
    console.log(`Переход в комнату ${roomNumber}`);
    // Здесь будет логика перехода в конкретную комнату
  };

  return (
    <div className="laboratory-screen">
      {/* Указатель на левую ближнюю дверь */}
      <div 
        className="room-indicator room-1"
        onClick={() => handleRoomClick(1)}
      >
        <div className="indicator-arrow"></div>
        <div className="indicator-label">Комната 1</div>
      </div>

      {/* Указатель на левую дальнюю дверь */}
      <div 
        className="room-indicator room-2"
        onClick={() => handleRoomClick(2)}
      >
        <div className="indicator-arrow"></div>
        <div className="indicator-label">Комната 2</div>
      </div>

      {/* Указатель на правую дальнюю дверь */}
      <div 
        className="room-indicator room-3"
        onClick={() => handleRoomClick(3)}
      >
        <div className="indicator-arrow"></div>
        <div className="indicator-label">Комната 3</div>
      </div>

      {/* Указатель на правую ближнюю дверь */}
      <div 
        className="room-indicator room-4"
        onClick={() => handleRoomClick(4)}
      >
        <div className="indicator-arrow"></div>
        <div className="indicator-label">Комната 4</div>
      </div>
    </div>
  );
};
