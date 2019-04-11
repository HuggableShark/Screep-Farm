// Haulers grab energy from nearby sources and transports to spawns/extentions.
// May incorporate more side jobs for them later.

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is bringing energy to a structure but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is fully stocked
    else if (creep.memory.working == false && creep.carry.energy > 0) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to transfer energy to a structure
    if (creep.memory.working == true) {
      // find closest spawn, extension or tower which is not full
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        // the second argument for findClosestByPath is an object which takes
        // a property called filter which can be a function
        // we use the arrow operator to define it
        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                     || s.structureType == STRUCTURE_EXTENSION
                     || s.structureType == STRUCTURE_TOWER)
                     && s.energy < s.energyCapacity
      });

      // if we found one
      if (structure != undefined) {
        // try to transfer energy, if it is not in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          creep.moveTo(structure);
        }
      }
    }
    // Otherwise, stock up
    else {
      var containersInRoom = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER)
          && (structure.store[RESOURCE_ENERGY] > 0);
        }
      });
      var targetContainer = creep.pos.findClosestByPath(containersInRoom);
      if (targetContainer) {
        if (creep.withdraw(targetContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targetContainer);
        }
      }
    }
  }
}
