import { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameActions } from '../hooks/useGameActions';
import { initializeDebugMode } from '../utils/debug';

import IntroScreen from './IntroScreen';
import GameOverScreen from './GameOverScreen';
import CombatScreen from './combat/CombatScreen';
import StatsPanel from './ui/StatsPanel';
import SkillTree from './ui/SkillTree';
import Inventory from './ui/Inventory';
import Map from './ui/Map';
import ItemChoice from './ui/ItemChoice';
import GoldChoice from './ui/GoldChoice';
import ShopScreen from './ui/ShopScreen';
import RoomView from './exploration/RoomView';
import ActionsList from './exploration/ActionsList';
import NavigationButtons from './exploration/NavigationButtons';
import VictoryScreen from './VictoryScreen';

const Game = () => {
  const state = useGameState();
  const actions = useGameActions(state);
  const [animations, setAnimations] = useState([]);
  const stateRef = useRef(state);

  // Update ref on every render to always have current state
  stateRef.current = state;

  const {
    gameState,
    playthroughCount,
    currentRoomPos,
    floorLayout,
    player,
    combatState,
    dialogue,
    choices,
    showSkillTree,
    setShowSkillTree,
    showInventory,
    setShowInventory,
    showMap,
    setShowMap,
    itemChoice,
    goldChoice,
    showShop
  } = state;

  // Handle enemy attack animations
  useEffect(() => {
    if (combatState?.pendingAnimation) {
      const id = Date.now() + Math.random();
      const anim = { ...combatState.pendingAnimation, id };
      setAnimations(prev => [...prev, anim]);

      setTimeout(() => {
        setAnimations(prev => prev.filter(a => a.id !== id));
      }, anim.duration || 800);

      // Clear pending animation
      combatState.pendingAnimation = null;
    }
  }, [combatState?.pendingAnimation]);

  const {
    getCurrentRoom,
    startGame,
    moveToRoom,
    handleAction,
    handleTakeItem,
    handleCombatMove,
    handleCombatAttack,
    handleCombatTeleport,
    toggleTeleportMode,
    handleEndTurn,
    handleCollectGold,
    spendSkillPoint,
    equipItem,
    trashItem,
    handleShopBuy,
    handleShopNegotiate,
    restartGame,
    descendFloor
  } = actions;

  // Handle floor descent event
  useEffect(() => {
    const handleDescend = () => {
      descendFloor();
    };

    window.addEventListener('descendFloor', handleDescend);
    return () => window.removeEventListener('descendFloor', handleDescend);
  }, [descendFloor]);

  // Initialize debug mode (development only)
  useEffect(() => {
    initializeDebugMode(() => stateRef.current, actions);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex">
      {/* Debug Mode Indicator */}
      {import.meta.env.MODE === 'development' && (
        <div className="fixed top-2 right-2 z-50 bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold">
          DEBUG MODE - Press F12 and type: debug.help()
        </div>
      )}

      <div className="w-2/5 p-6 flex flex-col gap-4 overflow-y-auto border-r border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">The Dungeon Below</h1>
          {gameState === 'playing' && (
            <div className="text-xl font-semibold text-purple-400">
              Floor {state.currentFloor}
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg flex-shrink-0">
          {gameState === 'intro' && (
            <IntroScreen 
              dialogue={dialogue} 
              playthroughCount={playthroughCount} 
              onStart={startGame} 
            />
          )}
          
          {gameState === 'playing' && (
            <>
              <p className="text-gray-300 mb-4">{dialogue}</p>
              
              {showShop && !goldChoice && !itemChoice && (
                <ShopScreen
                  shopInventory={getCurrentRoom()?.shopInventory || []}
                  player={player}
                  room={getCurrentRoom()}
                  onBuy={handleShopBuy}
                  onNegotiate={handleShopNegotiate}
                  onClose={() => state.setShowShop(false)}
                />
              )}
              
              {goldChoice && !showShop && (
                <GoldChoice 
                  goldAmount={goldChoice} 
                  onCollect={handleCollectGold}
                  onLeave={() => state.setGoldChoice(null)}
                />
              )}
              
              {itemChoice && !goldChoice && !showShop && (
                <ItemChoice 
                  itemChoice={itemChoice} 
                  onTakeItem={handleTakeItem}
                  onLeave={() => state.setItemChoice(null)}
                />
              )}
              
              {showSkillTree && !itemChoice && !goldChoice && !showShop && (
                <SkillTree 
                  player={player} 
                  onSpendPoint={spendSkillPoint}
                  onClose={() => setShowSkillTree(false)} 
                />
              )}
              
              {showInventory && !itemChoice && !goldChoice && !showShop && (
                <Inventory 
                  player={player} 
                  onEquipItem={equipItem}
                  onTrashItem={trashItem}
                  onClose={() => setShowInventory(false)} 
                />
              )}
              
              {showMap && !itemChoice && !goldChoice && !showShop && (
                <Map 
                  floorLayout={floorLayout} 
                  currentRoomPos={currentRoomPos}
                  hasMap={player.hasMap}
                  onClose={() => setShowMap(false)} 
                />
              )}
              
              {!showSkillTree && !showInventory && !showMap && !itemChoice && !goldChoice && !showShop && (
                <ActionsList
                  choices={choices}
                  onAction={handleAction}
                  onShowSkillTree={() => setShowSkillTree(true)}
                  onShowInventory={() => setShowInventory(true)}
                  onShowMap={() => setShowMap(true)}
                  player={player}
                  onDescend={descendFloor}
                  currentRoom={getCurrentRoom()}
                />
              )}
            </>
          )}
          
          {gameState === 'combat' && combatState && (
            <CombatScreen
              combatState={combatState}
              onMove={handleCombatMove}
              onAttack={handleCombatAttack}
              onTeleport={handleCombatTeleport}
              onToggleTeleportMode={toggleTeleportMode}
              onEndTurn={handleEndTurn}
              animations={animations}
              setAnimations={setAnimations}
            />
          )}
          
          {gameState === 'gameOver' && (
            <GameOverScreen onRestart={restartGame} />
          )}

          {gameState === 'victory' && (
            <VictoryScreen 
              onDescend={actions.descendFloor} 
              onRestart={actions.restartGame} 
            />
          )}
        </div>
      </div>

      <div className="w-3/5 p-6 flex flex-col gap-4">
        {(gameState === 'playing' || gameState === 'combat') && (
          <>
            <StatsPanel player={gameState === 'combat' && combatState ? combatState.player : player} />
            <RoomView
              room={getCurrentRoom()}
              gameState={gameState}
              combatState={combatState}
              animations={animations}
              onTeleport={handleCombatTeleport}
            />
          </>
        )}
      </div>
      
      {gameState === 'playing' && (
        <NavigationButtons 
          room={getCurrentRoom()} 
          floorLayout={floorLayout}
          onMove={moveToRoom}
        />
      )}
    </div>
  );
};

export default Game;