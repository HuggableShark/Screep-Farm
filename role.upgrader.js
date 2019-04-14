// This creep's primary focus is to upgrade the room controller.

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is bringing energy to the controller but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to transfer energy to the controller
    if (creep.memory.working == true) {
      // instead of upgraderController we could also use:
      // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

      // try to upgrade the controller
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        // if not in range, move towards the controller
        creep.moveTo(creep.room.controller);
      }
    }
    // if creep is supposed to get energy to User
    else {
      // find closest source
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      // find closest warehouse
      var warehouse = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    || s.structureType == STRUCTURE_STORAGE
                    && (s.store.energy > 0)
      }));
      // first: try to grab from a warehouse
      if (creep.memory.working == false) {
        if (creep.withdraw(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(warehouse);
        }
      }
      // otherwise, harvest from a source
      else if (creep.memory.working == false && warehouse.length == 0){
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          // move towards the source
          creep.moveTo(source);
        }
      }
    }
  }
};
