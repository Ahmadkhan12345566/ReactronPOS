router.get('/categories', async (req, res) => {
  try {
    const categories = await models.Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/categories', async (req, res) => {
  try {
    const { name, status, image, createdBy } = req.body;
    
    const category = await models.Category.create({
      name,
      status: status || 'Active',
      image,
      createdBy
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;