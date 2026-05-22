const prisma = require('../config/db');

exports.submitRating = async (req, res) => {
  try {
    const { storeId, score } = req.body;
    const userId = req.user.id;


    if (!storeId || score === undefined) {
      return res.status(400).json({ message: 'Store ID and score are required.' });
    }

    if (score < 1 || score > 5 || !Number.isInteger(score)) {
      return res.status(400).json({ message: 'Score must be an integer between 1 and 5.' });
    }


    const store = await prisma.store.findUnique({ where: { id: parseInt(storeId) } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }


    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: { // This uses the @@unique constraint defined in schema
          userId: parseInt(userId),
          storeId: parseInt(storeId),
        },
      },
      update: {
        score: parseInt(score),
      },
      create: {
        score: parseInt(score),
        userId: parseInt(userId),
        storeId: parseInt(storeId),
      },
    });

    res.status(200).json({ message: 'Rating submitted successfully', rating });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Internal server error while submitting rating.' });
  }
};
