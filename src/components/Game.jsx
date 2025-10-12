import { useGameState } from '../hooks/useGameState';
import { useGameActions } from '../hooks/useGameActions';

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

  const {
    gameState,
    playthroughCount,
    currentRoomPos,
    floorLayout,
    player,
    enemy,
    combatLog,
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

  const {
    getCurrentRoom,
    startGame,
    moveToRoom,
    handleAction,
    handleTakeItem,
    handlePlayerMove,
    handleCollectGold,
    spendSkillPoint,
    equipItem,
    trashItem,
    handleShopBuy,
    handleShopNegotiate,
    restartGame
  } = actions;

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex">
      <div className="w-2/5 p-6 flex flex-col gap-4 overflow-y-auto border-r border-gray-700">
        <h1 className="text-3xl font-bold mb-2">The Dungeon Below</h1>
        
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
                  onDescend={actions.descendFloor}
                />
              )}
            </>
          )}
          
          {gameState === 'combat' && (
            <CombatScreen 
              enemy={enemy}
              player={player}
              combatLog={combatLog}
              onPlayerMove={handlePlayerMove}
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
            <StatsPanel player={player} />
            <RoomView room={getCurrentRoom()} enemy={enemy} gameState={gameState} />
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