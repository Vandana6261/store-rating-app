const prisma = require('../config/db');

exports.addStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const ownerId = req.user.id; // Auto-assign to the logged-in Store Owner

    // Check if the owner already has a store
    const existingStore = await prisma.store.findFirst({ where: { ownerId } });
    if (existingStore) {
      return res.status(400).json({ message: 'You already have a store assigned to your account.' });
    }

    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Name, email, and address are required to add a store.' });
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId
      },
    });

    res.status(201).json({ message: 'Store created successfully', store: newStore });
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ message: 'Internal server error while adding store.' });
  }
};

exports.getStores = async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;

    // Build the query object
    const query = {
      include: {
        ratings: true, // We include ratings so we can calculate the average
      }
    };

    // Searching
    if (search) {
      query.where = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    // Sorting (fallback to ascending if not provided)
    if (sortBy) {
      const sortOrder = order && order.toLowerCase() === 'desc' ? 'desc' : 'asc';
      // Allowed sort fields for stores: name, email, address, createdAt
      const allowedSortFields = ['name', 'email', 'address', 'createdAt'];
      if (allowedSortFields.includes(sortBy)) {
        query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    }

    // Fetch stores from DB
    let stores = await prisma.store.findMany(query);

    // Calculate Average Rating and format response
    stores = stores.map(store => {
      const totalRatings = store.ratings.length;
      const sumRatings = store.ratings.reduce((acc, curr) => acc + curr.score, 0);
      const overallRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;
      
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        createdAt: store.createdAt,
        totalRatings,
        overallRating: parseFloat(overallRating),
        // We can optionally hide the raw ratings array if it's too large, 
        // but it's useful for finding if the specific user has rated it.
        // We will include it for now.
        ratings: store.ratings
      };
    });

    // Special case: if user wants to sort by rating (since it's a computed field, we sort it in JS)
    if (sortBy === 'rating') {
      const sortOrder = order && order.toLowerCase() === 'desc' ? -1 : 1;
      stores.sort((a, b) => (a.overallRating - b.overallRating) * sortOrder);
    }

    res.status(200).json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Internal server error while fetching stores.' });
  }
};
