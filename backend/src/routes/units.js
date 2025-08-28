router.get('/units', async (req, res) => {
  try {
    const units = await models.Category.findAll();
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;