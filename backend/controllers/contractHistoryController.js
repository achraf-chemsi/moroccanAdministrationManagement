const getContractHistory = async (req, res) => {
  try {
    const history = await ContractHistory.findAll({
      where: { contractId: req.params.id },
      include: [
        { model: User, as: 'historyChangedBy' },
        { model: Contract }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contract history' });
  }
}; 