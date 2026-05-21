const prisma = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the store(s) owned by this user
    // Assuming a store owner has one primary store for this dashboard
    const store = await prisma.store.findFirst({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: { id: true, name: true, email: true } // Only include safe fields
            }
          }
        }
      }
    });

    if (!store) {
      return res.status(200).json(null);
    }

    // Calculate average rating
    const totalRatings = store.ratings.length;
    let averageRating = 0;

    if (totalRatings > 0) {
      const sum = store.ratings.reduce((acc, r) => acc + r.score, 0);
      averageRating = parseFloat((sum / totalRatings).toFixed(1));
    }

    // Format the list of users who submitted ratings
    const ratingUsers = store.ratings.map(r => ({
      userId: r.user.id,
      name: r.user.name,
      email: r.user.email,
      scoreSubmitted: r.score,
      dateSubmitted: r.updatedAt
    }));

    res.status(200).json({
      storeId: store.id,
      storeName: store.name,
      averageRating,
      totalRatings,
      raters: ratingUsers
    });

  } catch (error) {
    console.error('Store Owner Dashboard Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
