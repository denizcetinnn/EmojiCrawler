import { calculateLevel } from '../utils/calculations';
import { getNextPosition } from '../utils/helpers';
import { generateFloor } from '../game/dungeonGenerator';
import { processCombatMove, processEnemyTurn } from '../game/combatSystem';
import { handleRoomAction, applyRelicEffect } from '../game/actionHandlers';

export const useGameActions = (state) => {
  const {
    setGameState,
    setCurrentRoomPos,
    floorLayout,
    setFloorLayout,
    player,
    setPlayer,
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
    setDialogue,
    choices,
    setChoices,
    setShowSkillTree,
    setShowInventory,
    setShowMap,
    setItemChoice,
    itemChoice,
    setGoldChoice,
    setShowShop
  } = state;

  const getCurrentRoom = () => {
    return floorLayout.find(r => r.x === state.currentRoomPos.x && r.y === state.currentRoomPos.y);
  };

  const startGame = () => {
    const layout = generateFloor();
    setFloorLayout(layout);
    setCurrentRoomPos({ x: 0, y: 0 });
    
    const startRoom = layout[0];
    startRoom.visited = true;
    
    setGameState('playing');
    setDialogue("You'll need to get stronger if you want to survive here. Check my dressing room - take whatever you need.");
    setChoices(startRoom.actions.filter(a => !a.completed));
  };

  const moveToRoom = (direction) => {
    const next = getNextPosition(state.currentRoomPos.x, state.currentRoomPos.y, direction);
    const nextRoom = floorLayout.find(r => r.x === next.x && r.y === next.y);
    
    if (nextRoom) {
      nextRoom.visited = true;
      setCurrentRoomPos({ x: next.x, y: next.y });
      setDialogue(`You enter ${nextRoom.name}. ${nextRoom.description}`);
      setChoices(nextRoom.actions.filter(a => !a.completed));
      
      if (itemChoice) {
        setItemChoice(null);
      }
    }
  };

  const updateChoices = (room) => {
    const availableActions = room.actions.filter(a => !a.completed);
    const actionChoices = availableActions.map(a => ({ ...a, type: 'action' }));
    setChoices(actionChoices);
  };

  const handleAction = (action) => {
    const room = getCurrentRoom();
    const actionIndex = room.actions.findIndex(a => a.id === action.id);
    
    if (actionIndex === -1) return;
    
    // Don't mark shop as completed so we can return
    if (action.id !== 'shop') {
      room.actions[actionIndex].completed = true;
    }
  
    handleRoomAction(action.id, room, player, setPlayer, setDialogue, startCombat, setItemChoice, setGoldChoice, setShowShop, updateChoices);
    updateChoices(room);
    
    // Check for level up after XP-granting actions
    setTimeout(() => {
      const newLevel = calculateLevel(player.xp);
      if (newLevel > player.level) {
        setPlayer(p => ({
          ...p,
          level: newLevel,
          skillPoints: p.skillPoints + 2
        }));
        setDialogue(prev => prev + ` Level up! Now level ${newLevel}. Gained 2 skill points!`);
      }
    }, 100);
  };

  const handleTakeItem = (item) => {
    if (item.type === 'weapon' || item.type === 'armor') {
      setPlayer(p => {
        const newInventory = [...p.inventory, item];
        const newEquipment = { ...p.equipment };
        
        // Auto-equip legendary weapons
        if (item.type === 'weapon') {
          newEquipment.weapon = item;
          
          // Add granted move if it's a legendary weapon
          if (item.grantedMove && item.rarity === 'legendary') {
            p.grantedMoves = p.grantedMoves || {};
            p.grantedMoves[item.name] = item.grantedMove;
          }
        } else if (item.type === 'armor' && !p.equipment.armor) {
          newEquipment.armor = item;
        }
        
        return { ...p, inventory: newInventory, equipment: newEquipment };
      });
      
      if (item.grantedMove && item.rarity === 'legendary') {
        setDialogue(`You take the ${item.name} and feel its power! Gained move: ${item.grantedMove.name}!`);
      } else {
        setDialogue(`You take the ${item.name}!`);
      }
    } else {
      setPlayer(p => ({ ...p, relics: [...p.relics, item] }));
      applyRelicEffect(item, player, setPlayer);
      setDialogue(`You take the ${item.name}!`);
    }
    
    setItemChoice(null);
  };

  const startCombat = (enemyData, isBoss = false) => {
    setEnemy({ ...enemyData, energy: 10, maxEnergy: 10, isBoss });
    setGameState('combat');
    setCombatLog([`${isBoss ? '💀 BOSS FIGHT! 💀 ' : ''}A ${enemyData.name} appears!`]);
  };

  const handlePlayerMove = (moveName) => {
    const result = processCombatMove(moveName, player, enemy, playerDefending, playerDodging, enemyDefending, enemyDodging);
    
    const newLog = [...combatLog, ...result.log];
    setCombatLog(newLog);
    
    if (result.playerUpdate) {
      setPlayer(p => ({ ...p, ...result.playerUpdate }));
    }
    
    if (result.enemyUpdate) {
      const newEnemy = { ...enemy, ...result.enemyUpdate };
      setEnemy(newEnemy);
      
      if (newEnemy.hp <= 0) {
        handleCombatVictory(newLog);
        return;
      }
    }
    
    setPlayerDefending(result.newPlayerDefending);
    setPlayerDodging(result.newPlayerDodging);
    setEnemyDefending(result.newEnemyDefending);
    setEnemyDodging(result.newEnemyDodging);
    
    if (result.shouldTriggerEnemyTurn) {
      setTimeout(() => handleEnemyTurn(), 1000);
    }
  };

  const handleEnemyTurn = () => {
    const result = processEnemyTurn(enemy, player, playerDodging, playerDefending);
    
    setCombatLog(log => [...log, ...result.log]);
    
    if (result.playerUpdate) {
      setPlayer(p => {
        const updated = { ...p, ...result.playerUpdate };
        
        if (updated.hp <= 0) {
          setTimeout(() => {
            setGameState('gameOver');
            state.setPlaythroughCount(c => c + 1);
          }, 1000);
        }
        
        return updated;
      });
    }
    
    setPlayerDefending(result.newPlayerDefending);
    setPlayerDodging(result.newPlayerDodging);
    setEnemyDefending(result.newEnemyDefending);
    setEnemyDodging(result.newEnemyDodging);
  };

  const handleCombatVictory = (newLog) => {
    const hasLifesteal = player.relics.some(r => r.type === 'lifesteal');
    const hasGoldBonus = player.relics.some(r => r.type === 'gold');
    const isBoss = enemy.isBoss;
    
    const goldReward = hasGoldBonus ? Math.floor(enemy.goldReward * 1.5) : enemy.goldReward;
    
    // 20% chance to drop a key from regular enemies
    const keyDrop = !isBoss && Math.random() < 0.2;
    
    newLog.push(`${enemy.name} defeated!`);
    newLog.push(`Gained ${enemy.xpReward} XP!`);
    
    if (keyDrop) {
      newLog.push('The enemy dropped a key! 🔑');
    }
    
    if (hasLifesteal) {
      newLog.push('Vampire Fang: Restored 1 HP!');
    }
    
    const newXp = player.xp + enemy.xpReward;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > player.level;
    
    setPlayer(p => ({
      ...p,
      xp: newXp,
      level: newLevel,
      skillPoints: p.skillPoints + (leveledUp ? 2 : 0),
      gold: p.gold + goldReward,
      keys: p.keys + (keyDrop ? 1 : 0),
      hp: hasLifesteal ? Math.min(p.hp + 1, p.maxHp) : p.hp,
      defeatedBoss: isBoss ? true : p.defeatedBoss  // Track boss defeat
    }));
    
    if (leveledUp) {
      newLog.push(`Level up! Now level ${newLevel}. Gained 2 skill points!`);
    }
    
    setCombatLog(newLog);
    
    const room = getCurrentRoom();
    const combatAction = room.actions.find(a => a.id === 'spider' || a.id === 'enemy' || a.id === 'boss');
    if (combatAction) combatAction.completed = true;
    room.cleared = true;
    
    setTimeout(() => {
      if (isBoss) {
        // Boss defeated - show legendary weapon first, THEN victory
        const legendaryWeapon = { ...enemy.legendaryWeapon };
        setItemChoice({
          item: legendaryWeapon,
          message: `The ${enemy.name} drops a legendary weapon!`
        });
        setGameState('playing');  // Stay in playing so user can take the weapon
        setEnemy(null);
        setPlayerDefending(false);
        setPlayerDodging(false);
        setEnemyDefending(false);
        setEnemyDodging(false);
        setDialogue('BOSS DEFEATED! Take the legendary weapon, then you can descend to the next floor.');
        updateChoices(room);
      } else {
        setGameState('playing');
        setEnemy(null);
        setPlayerDefending(false);
        setPlayerDodging(false);
        setEnemyDefending(false);
        setEnemyDodging(false);
        setDialogue('Victory!');
        updateChoices(room);
        
        setGoldChoice(goldReward);
      }
    }, 2000);
  };

  const handleCollectGold = () => {
    setPlayer(p => ({ ...p, gold: p.gold + state.goldChoice }));
    setDialogue(`Collected ${state.goldChoice} gold!`);
    setGoldChoice(null);
  };

  const spendSkillPoint = (stat) => {
    if (player.skillPoints > 0) {
      setPlayer(p => ({
        ...p,
        skillPoints: p.skillPoints - 1,
        stats: { ...p.stats, [stat]: p.stats[stat] + 1 }
      }));
    }
  };

  const equipItem = (item) => {
    setPlayer(p => {
      const updates = { equipment: { ...p.equipment } };
      
      if (item.type === 'weapon') {
        // Remove old weapon's granted move if it had one
        const oldWeapon = p.equipment.weapon;
        if (oldWeapon?.grantedMove && oldWeapon.rarity === 'legendary') {
          const newGrantedMoves = { ...p.grantedMoves };
          delete newGrantedMoves[oldWeapon.name];
          updates.grantedMoves = newGrantedMoves;
        }
        
        updates.equipment.weapon = item;
        
        // Add new weapon's granted move if it has one
        if (item.grantedMove && item.rarity === 'legendary') {
          updates.grantedMoves = { ...p.grantedMoves, [item.name]: item.grantedMove };
        }
        
        setDialogue(`Equipped ${item.name}!${item.grantedMove ? ` Gained move: ${item.grantedMove.name}!` : ''}`);
      } else if (item.type === 'armor') {
        updates.equipment.armor = item;
        setDialogue(`Equipped ${item.name}!`);
      }
      
      return { ...p, ...updates };
    });
  };

  const trashItem = (itemIndex) => {
    setPlayer(p => {
      const newInventory = [...p.inventory];
      const trashedItem = newInventory[itemIndex];
      
      const newEquipment = { ...p.equipment };
      if (trashedItem.type === 'weapon' && p.equipment.weapon?.name === trashedItem.name) {
        newEquipment.weapon = null;
      } else if (trashedItem.type === 'armor' && p.equipment.armor?.name === trashedItem.name) {
        newEquipment.armor = null;
      }
      
      newInventory.splice(itemIndex, 1);
      return { ...p, inventory: newInventory, equipment: newEquipment };
    });
    setDialogue('Item trashed.');
  };

  const handleShopBuy = (item, price) => {
    if (player.gold >= price) {
      setPlayer(p => {
        const newPlayer = { ...p, gold: p.gold - price };
        
        if (item.type === 'potion') {
          if (item.healAmount) {
            newPlayer.hp = Math.min(p.hp + item.healAmount, p.maxHp);
            setDialogue(`Purchased and used ${item.name}! Restored ${item.healAmount} HP.`);
          } else if (item.energyAmount) {
            newPlayer.energy = Math.min(p.energy + item.energyAmount, p.maxEnergy);
            setDialogue(`Purchased and used ${item.name}! Restored ${item.energyAmount} Energy.`);
          }
        } else if (item.effect && !item.damage && !item.defense) {
          newPlayer.relics = [...p.relics, item];
          setDialogue(`Purchased ${item.name}!`);
          setTimeout(() => {
            applyRelicEffect(item, newPlayer, setPlayer);
          }, 0);
        } else {
          newPlayer.inventory = [...p.inventory, item];
          setDialogue(`Purchased ${item.name} for ${price}g!`);
        }
        
        return newPlayer;
      });
      return true;
    }
    return false;
  };
  
  const handleShopNegotiate = (item, bid) => {
    const itemValue = item.value || 10;
    const minPrice = Math.floor(itemValue * Math.max(0.5, 1 - (player.stats.cha * 0.05)));
    
    if (bid >= minPrice && player.gold >= bid) {
      setPlayer(p => {
        const newPlayer = { ...p, gold: p.gold - bid };
        
        if (item.type === 'potion') {
          if (item.healAmount) {
            newPlayer.hp = Math.min(p.hp + item.healAmount, p.maxHp);
            setDialogue(`Negotiated and used ${item.name} for ${bid}g! Restored ${item.healAmount} HP.`);
          } else if (item.energyAmount) {
            newPlayer.energy = Math.min(p.energy + item.energyAmount, p.maxEnergy);
            setDialogue(`Negotiated and used ${item.name} for ${bid}g! Restored ${item.energyAmount} Energy.`);
          }
        } else if (item.effect && !item.damage && !item.defense) {
          newPlayer.relics = [...p.relics, item];
          setDialogue(`Successfully negotiated ${item.name} for ${bid}g!`);
          setTimeout(() => {
            applyRelicEffect(item, newPlayer, setPlayer);
          }, 0);
        } else {
          newPlayer.inventory = [...p.inventory, item];
          setDialogue(`Successfully negotiated ${item.name} for ${bid}g!`);
        }
        
        return newPlayer;
      });
      return true;
    } else {
      const room = getCurrentRoom();
      room.shopActive = false;
      setDialogue('The shopkeeper is offended by your low offer!');
      setShowShop(false);
      return false;
    }
  };

  const descendFloor = () => {
    // For now, just show victory message
    // Later we'll implement floor 2
    setDialogue('Congratulations! You have completed Floor 1. More floors coming soon!');
    setGameState('gameOver');
  };

  const restartGame = () => {
    setPlayer({
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
      grantedMoves:{},
      defeatedBoss: false
    });
    setGameState('intro');
    setCurrentRoomPos(null);
    setFloorLayout([]);
    setEnemy(null);
    setCombatLog([]);
    setShowMap(false);
    setShowSkillTree(false);
    setShowInventory(false);
    setItemChoice(null);
    setGoldChoice(null);
    setShowShop(false);
    setPlayerDefending(false);
    setPlayerDodging(false);
    setEnemyDefending(false);
    setEnemyDodging(false);
  };

  return {
    getCurrentRoom,
    startGame,
    moveToRoom,
    handleAction,
    handleTakeItem,
    startCombat,
    handlePlayerMove,
    handleCollectGold,
    spendSkillPoint,
    equipItem,
    trashItem,
    handleShopBuy,
    handleShopNegotiate,
    restartGame,
    descendFloor
  };
};