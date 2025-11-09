import { useState, useEffect } from 'react';
import '../../styles/combat-animations.css';

// Component for displaying combat animations
const CombatAnimation = ({ animation, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after animation duration
    const duration = animation.duration || 800;
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [animation, onComplete]);

  if (!visible || !animation) return null;

  const { type, emoji, value, isCrit } = animation;

  // Render different animation types
  switch (type) {
    case 'damage':
      return (
        <div className={`damage-number ${isCrit ? 'crit' : ''}`}>
          {value}
        </div>
      );

    case 'heal':
      return (
        <div className="heal-number">
          +{value}
        </div>
      );

    case 'sword':
      return (
        <div className="sword-slash">
          ⚔️
        </div>
      );

    case 'arrow':
      return (
        <div className="arrow-fly">
          {emoji || '🏹'}
        </div>
      );

    case 'magic':
      return (
        <div className="magic-bolt">
          {emoji || '✨'}
        </div>
      );

    case 'explosion':
      return (
        <div className="explosion">
          {emoji || '💥'}
        </div>
      );

    case 'poison':
      return (
        <div className="poison-cloud">
          ☠️
        </div>
      );

    case 'crit':
      return (
        <div className="crit-star">
          ⭐
        </div>
      );

    default:
      return null;
  }
};

// Hook for managing combat animations
export const useCombatAnimations = () => {
  const [animations, setAnimations] = useState([]);

  const addAnimation = (animationData) => {
    const id = Date.now() + Math.random();
    const animation = { ...animationData, id };

    setAnimations(prev => [...prev, animation]);

    // Auto-remove after duration
    const duration = animationData.duration || 800;
    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== id));
    }, duration);

    return id;
  };

  const clearAnimations = () => {
    setAnimations([]);
  };

  return {
    animations,
    addAnimation,
    clearAnimations,
  };
};

// Helper to get animation type from weapon
export const getWeaponAnimationType = (weapon) => {
  if (!weapon) return 'sword';

  const category = weapon.category || 'melee';

  if (category === 'ranged') {
    if (weapon.name?.toLowerCase().includes('bow')) return 'arrow';
    if (weapon.name?.toLowerCase().includes('throw')) return 'arrow';
    return 'arrow';
  }

  if (category === 'magic') {
    if (weapon.element === 'fire') return 'explosion';
    if (weapon.element === 'ice') return 'magic';
    if (weapon.element === 'lightning') return 'magic';
    if (weapon.element === 'poison') return 'poison';
    return 'magic';
  }

  // Melee weapons
  return 'sword';
};

// Helper to get emoji for weapon animation
export const getWeaponEmoji = (weapon) => {
  if (!weapon) return '⚔️';

  if (weapon.emoji) return weapon.emoji;

  const category = weapon.category || 'melee';

  if (category === 'ranged') {
    return '🏹';
  }

  if (category === 'magic') {
    if (weapon.element === 'fire') return '🔥';
    if (weapon.element === 'ice') return '❄️';
    if (weapon.element === 'lightning') return '⚡';
    if (weapon.element === 'poison') return '☠️';
    return '✨';
  }

  return '⚔️';
};

export default CombatAnimation;
