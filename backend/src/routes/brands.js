router.get('/brands', async (req, res) => {
  try {
    const brands = await models.Category.findAll();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;