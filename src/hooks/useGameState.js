import { useState, useEffect } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState('intro');
  const [playthroughCount, setPlaythroughCount] = useState(0);
  const [currentRoomPos, setCurrentRoomPos] = useState(null);
  const [floorLayout, setFloorLayout] = useState([]);
  
  const [player, setPlayer] = useState({
    hp: 10,
    maxHp: 10,
    energy: 10,
    maxEnergy: 10,
    xp: 0,
    level: 1,
    skillPoints: 0,
    stats: { str: 0, dex: 0, int: 0, cha: 0 },
    moves: ['Punch', 'Take a Breather', 'Dodge', 'Block'],
    inventory: [],
    equipment: { weapon: null, armor: null, accessory: null },
    gold: 0,
    keys: 0,
    relics: [],
    hasMap: false,
    grantedMoves: {},
    defeatedBoss: false
  });

  const [enemy, setEnemy] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [playerDefending, setPlayerDefending] = useState(false);
  const [playerDodging, setPlayerDodging] = useState(false);
  const [enemyDefending, setEnemyDefending] = useState(false);
  const [enemyDodging, setEnemyDodging] = useState(false);
  const [combatLocked, setCombatLocked] = useState(false);

  const [dialogue, setDialogue] = useState('');
  const [choices, setChoices] = useState([]);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [itemChoice, setItemChoice] = useState(null);
  const [goldChoice, setGoldChoice] = useState(null);
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    if (gameState === 'intro') {
      setDialogue("You wake up in a dimly lit chamber. Your head throbs. An old man sits nearby, offering you water.");
    }
  }, [gameState]);
  
  useEffect(() => {
    const handleDeath = () => {
      setGameState('gameOver');
      setPlaythroughCount(c => c + 1);
    };
    
    window.addEventListener('playerDeath', handleDeath);
    return () => window.removeEventListener('playerDeath', handleDeath);
  }, []);

  return {
    // Game state
    gameState,
    setGameState,
    playthroughCount,
    setPlaythroughCount,
    currentRoomPos,
    setCurrentRoomPos,
    floorLayout,
    setFloorLayout,
    
    // Player state
    player,
    setPlayer,
    
    // Combat state
    enemy,
    setEnemy,
    combatLog,
    setCombatLog,
    playerDefending,
    setPlayerDefending,
    playerDodging,
    setPlayerDodging,
    enemyDefending,
    setEnemyDefending,
    enemyDodging,
    setEnemyDodging,
    combatLocked,
    setCombatLocked,
    
    // UI state
    dialogue,
    setDialogue,
    choices,
    setChoices,
    showSkillTree,
    setShowSkillTree,
    showInventory,
    setShowInventory,
    showMap,
    setShowMap,
    itemChoice,
    setItemChoice,
    goldChoice,
    setGoldChoice,
    showShop,
    setShowShop,
  };
};