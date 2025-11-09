import { calculateLevel } from '../utils/calculations';
import { getNextPosition } from '../utils/helpers';
import { generateFloor } from '../game/dungeonGenerator';
import {
  initializeCombat,
  processPlayerMove,
  processPlayerAttack,
  endPlayerTurn,
  processEnemyTurns,
  isCombatOver,
} from '../game/combatSystem';
import { handleRoomAction, applyRelicEffect } from '../game/actionHandlers';

export const useGameActions = (state) => {
  const {
    setGameState,
    setCurrentRoomPos,
    floorLayout,
    setFloorLayout,
    currentFloor,
    setCurrentFloor,
    player,
    setPlayer,
    combatState,
    setCombatState,
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
    const layout = generateFloor(1); // Always start at floor 1
    setFloorLayout(layout);
    setCurrentFloor(1);
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

      // Close shop when leaving
      if (state.showShop) {
        setShowShop(false);
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

    // Check if this is a Floor 2 event action (mutually exclusive choices)
    const floor2EventPrefixes = ['altar_', 'contract_', 'library_', 'torture_', 'summon_', 'fountain_', 'lab_', 'portal_'];
    const isFloor2Event = floor2EventPrefixes.some(prefix => action.id.startsWith(prefix));

    // Don't mark shop or locked_door as completed so we can retry
    if (action.id !== 'shop' && action.id !== 'locked_door') {
      room.actions[actionIndex].completed = true;

      // For Floor 2 events, mark ALL actions as completed (mutually exclusive)
      if (isFloor2Event) {
        room.actions.forEach(a => a.completed = true);
        room.cleared = true;
      }
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

        // Auto-equip weapons and armor
        if (item.type === 'weapon') {
          // Equip to first empty slot, or replace weapon1
          if (!p.equipment.weapon1) {
            newEquipment.weapon1 = item;
          } else if (!p.equipment.weapon2) {
            newEquipment.weapon2 = item;
          } else {
            // Both slots full, replace weapon1
            newEquipment.weapon1 = item;
          }
        } else if (item.type === 'armor') {
          newEquipment.armor = item;
        }

        return { ...p, inventory: newInventory, equipment: newEquipment };
      });

      setDialogue(`You take the ${item.name} and equip it!`);
    } else {
      setPlayer(p => ({ ...p, relics: [...p.relics, item] }));
      applyRelicEffect(item, player, setPlayer);
      setDialogue(`You take the ${item.name}!`);
    }

    setItemChoice(null);
  };

  const startCombat = (enemyData, isBoss = false) => {
    // Convert enemy data to array if single enemy
    const enemies = Array.isArray(enemyData) ? enemyData : [enemyData];

    // Initialize grid-based combat
    const newCombatState = initializeCombat(player, enemies, isBoss);

    setCombatState(newCombatState);
    setGameState('combat');
  };

  // Grid Combat Actions
  const handleCombatMove = (direction) => {
    if (!combatState || combatState.turn !== 'player') return;

    const result = processPlayerMove(combatState, direction);

    if (result.success) {
      setCombatState({ ...result.state });

      // Auto-end turn if AP is depleted
      if (result.state.player.currentAP <= 0) {
        setTimeout(() => handleEndTurn(), 500);
      }
    }
  };

  const handleCombatAttack = (targetEnemy, selectedWeapon = null) => {
    if (!combatState || combatState.turn !== 'player') return;

    const result = processPlayerAttack(combatState, targetEnemy, selectedWeapon);

    if (result.success) {
      // Update combat state
      const updatedState = { ...result.state };
      setCombatState(updatedState);

      // Check if combat is over (all enemies defeated)
      if (isCombatOver(updatedState)) {
        setTimeout(() => {
          handleCombatVictory(updatedState);
        }, 1000);
      } else if (updatedState.player.currentAP <= 0) {
        // Auto-end turn if AP is depleted
        setTimeout(() => handleEndTurn(), 500);
      }
    }
  };

  const handleEndTurn = async () => {
    if (!combatState || combatState.turn !== 'player') return;

    // End player turn
    const stateAfterPlayerTurn = endPlayerTurn(combatState);
    setCombatState({ ...stateAfterPlayerTurn });

    // Small delay before enemy turns
    await new Promise(resolve => setTimeout(resolve, 500));

    // Process enemy turns with UI updates
    const stateAfterEnemyTurns = await processEnemyTurns(
      stateAfterPlayerTurn,
      (updatedState) => {
        // Update UI during enemy turns
        setCombatState({ ...updatedState });
      }
    );

    // Final state update
    setCombatState({ ...stateAfterEnemyTurns });

    // Check if player died
    if (stateAfterEnemyTurns.player.hp <= 0) {
      setTimeout(() => {
        setGameState('gameOver');
        state.setPlaythroughCount(c => c + 1);
      }, 1000);
      return; // Don't check for victory if player is dead
    }

    // Check if combat is over
    if (isCombatOver(stateAfterEnemyTurns)) {
      setTimeout(() => {
        handleCombatVictory(stateAfterEnemyTurns);
      }, 1000);
    }
  };

  const handleCombatVictory = (finalCombatState) => {
    // Calculate rewards from all defeated enemies
    let totalXP = 0;
    let totalGold = 0;
    let keyDrops = 0;
    let isBoss = false;
    let bossWeapon = null;

    // Get enemy data from combat log or initial state
    // For now, we'll use a simpler approach - track this during combat init
    const enemiesDefeated = finalCombatState.enemiesDefeated || [];

    enemiesDefeated.forEach(enemy => {
      totalXP += enemy.xpReward || 0;

      // Apply gold bonus relic
      const hasGoldBonus = player.relics.some(r => r.type === 'gold');
      const goldMultiplier = hasGoldBonus ? 1.5 : 1;
      totalGold += Math.floor((enemy.goldReward || 0) * goldMultiplier);

      // Check for key drop (20% chance from non-boss enemies)
      if (!enemy.isBoss && Math.random() < 0.2) {
        keyDrops++;
      }

      if (enemy.isBoss) {
        isBoss = true;
        bossWeapon = enemy.legendaryWeapon;
      }
    });

    // Apply XP bonus relic (Scholar's Journal)
    const hasXPBonus = player.relics.some(r => r.type === 'xp');
    if (hasXPBonus) {
      const xpRelic = player.relics.find(r => r.type === 'xp');
      totalXP = Math.floor(totalXP * (xpRelic.xpMultiplier || 1.5));
    }

    // Update player with combat rewards
    const newXp = player.xp + totalXP;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > player.level;

    setPlayer(p => {
      const updated = {
        ...p,
        hp: finalCombatState.player.hp, // Use HP from combat
        xp: newXp,
        level: newLevel,
        skillPoints: p.skillPoints + (leveledUp ? 2 : 0),
        gold: p.gold + totalGold,
        keys: p.keys + keyDrops,
        defeatedBoss: isBoss ? true : p.defeatedBoss
      };

      // Clean up combat-specific properties
      delete updated.currentAP;
      delete updated.maxAP;
      delete updated.position;
      delete updated.facing;
      delete updated.statusEffects;
      delete updated.weapon1;
      delete updated.weapon2;
      delete updated.weapon;

      return updated;
    });

    // Mark room as cleared
    const room = getCurrentRoom();
    const combatAction = room.actions.find(a => a.id === 'spider' || a.id === 'enemy' || a.id === 'boss');
    if (combatAction) combatAction.completed = true;
    room.cleared = true;

    setTimeout(() => {
      if (isBoss && bossWeapon) {
        // Boss defeated - show legendary weapon first
        setItemChoice({
          item: bossWeapon,
          message: `Boss defeated! A legendary weapon is dropped!`
        });
        setGameState('playing');
        setCombatState(null);
        setDialogue('BOSS DEFEATED! Take the legendary weapon, then you can descend to the next floor.');
        updateChoices(room);
      } else {
        // Normal victory
        setGameState('playing');
        setCombatState(null);
        setDialogue(leveledUp ? `Victory! Level up to ${newLevel}!` : 'Victory!');
        updateChoices(room);

        if (totalGold > 0) {
          setGoldChoice(totalGold);
        }
      }
    }, 2000);
  };

  const handleCollectGold = () => {
    const amount = state.goldChoice;
    setPlayer(p => ({ ...p, gold: p.gold + amount }));
    setDialogue(`Collected ${amount} gold!`);
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

  const equipItem = (item, slot = null) => {
    setPlayer(p => {
      const updates = { equipment: { ...p.equipment } };

      if (item.type === 'weapon') {
        // Check if already equipped in the other slot
        const alreadyInSlot1 = p.equipment.weapon1?.name === item.name;
        const alreadyInSlot2 = p.equipment.weapon2?.name === item.name;

        if (slot === 'weapon1') {
          if (alreadyInSlot2) {
            // Can't equip same weapon twice
            setDialogue(`${item.name} is already equipped!`);
            return p;
          }
          updates.equipment.weapon1 = item;
        } else if (slot === 'weapon2') {
          if (alreadyInSlot1) {
            // Can't equip same weapon twice
            setDialogue(`${item.name} is already equipped!`);
            return p;
          }
          updates.equipment.weapon2 = item;
        } else {
          // Auto-assign to weapon1 if empty, otherwise weapon2
          if (!p.equipment.weapon1) {
            updates.equipment.weapon1 = item;
          } else if (!p.equipment.weapon2) {
            updates.equipment.weapon2 = item;
          } else {
            // Both slots full, replace weapon1
            updates.equipment.weapon1 = item;
          }
        }
        setDialogue(`Equipped ${item.name}!`);
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
      if (trashedItem.type === 'weapon') {
        if (p.equipment.weapon1?.name === trashedItem.name) {
          newEquipment.weapon1 = null;
        }
        if (p.equipment.weapon2?.name === trashedItem.name) {
          newEquipment.weapon2 = null;
        }
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
            // Energy potions not used in new system, but keep for compatibility
            setDialogue(`Purchased ${item.name}!`);
          }
        } else if (item.type === 'key') {
          newPlayer.keys = p.keys + 1;
          setDialogue(`Purchased ${item.name} for ${price}g!`);
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
          }
        } else if (item.type === 'key') {
          newPlayer.keys = p.keys + 1;
          setDialogue(`Successfully negotiated ${item.name} for ${bid}g!`);
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
    const nextFloor = currentFloor + 1;

    if (nextFloor > 2) {
      // No more floors yet
      setDialogue('Congratulations! You have completed all available floors!');
      setGameState('gameOver');
      return;
    }

    // Generate new floor
    const layout = generateFloor(nextFloor);
    setFloorLayout(layout);
    setCurrentFloor(nextFloor);
    setCurrentRoomPos({ x: 0, y: 0 });

    const startRoom = layout[0];
    startRoom.visited = true;

    // Floor 2 welcome message
    setDialogue(`You descend deeper into the abyss. The air grows cold, and shadows twist unnaturally. Floor ${nextFloor} awaits...`);
    setChoices(startRoom.actions.filter(a => !a.completed));
  };

  const restartGame = () => {
    setPlayer({
      hp: 10,
      maxHp: 10,
      xp: 0,
      level: 1,
      skillPoints: 0,
      stats: { str: 0, dex: 0, int: 0, cha: 0 },
      inventory: [],
      equipment: { weapon: null, armor: null, accessory: null },
      gold: 0,
      keys: 0,
      relics: [],
      hasMap: false,
      defeatedBoss: false
    });
    setGameState('intro');
    setCurrentRoomPos(null);
    setFloorLayout([]);
    setCurrentFloor(1); // Reset to floor 1
    setCombatState(null);
    setShowMap(false);
    setShowSkillTree(false);
    setShowInventory(false);
    setItemChoice(null);
    setGoldChoice(null);
    setShowShop(false);
  };

  return {
    getCurrentRoom,
    startGame,
    moveToRoom,
    handleAction,
    handleTakeItem,
    startCombat,
    handleCombatMove,
    handleCombatAttack,
    handleEndTurn,
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
