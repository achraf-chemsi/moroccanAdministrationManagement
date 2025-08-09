const getContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        { model: User, as: 'contractCreator' },
        { model: User, as: 'contractUpdater' }
      ]
    });
    // ... rest of the code ...
  } catch (error) {
    // ... error handling ...
  }
};

const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        { model: User, as: 'contractCreator' },
        { model: User, as: 'contractUpdater' }
      ]
    });
    // ... rest of the code ...
  } catch (error) {
    // ... error handling ...
  }
}; 