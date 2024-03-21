import React, { useState } from 'react';

const SwipeToDismiss = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [startY, setStartY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleStart = (e) => {
    const clientY = getClientY(e);
    setStartY(clientY);
    setIsSwiping(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
  };

  const handleMove = (e) => {
    const clientY = getClientY(e);
    const distance = clientY - startY;
    if (distance > 10) {
      setIsSwiping(true);
    }
  };

  const handleEnd = () => {
    if (isSwiping) {
      setIsVisible(false);
    }
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };

  const getClientY = (e) => {
    if (e.touches && e.touches.length > 0) {
      return e.touches[0].clientY;
    } else if (e.clientY) {
      return e.clientY;
    }
    return 0;
  };

  const divStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    background: 'red',
    transition: 'transform 0.3s',
    transform: isVisible ? 'translateY(0)' : 'translateY(100vh)',
  };

  return (
    <div
      className="swipe-to-dismiss"
      style={divStyle}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <h1>Swipe Me</h1>
    </div>
  );
};

export default SwipeToDismiss;