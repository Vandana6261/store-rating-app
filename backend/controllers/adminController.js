const prisma = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    const query = {
      where: {},
      include: {
        stores: {
          include: {
            ratings: true
          }
        }
      }
    };

    // Filtering
    if (name) query.where.name = { contains: name, mode: 'insensitive' };
    if (email) query.where.email = { contains: email, mode: 'insensitive' };
    if (address) query.where.address = { contains: address, mode: 'insensitive' };
    if (role) query.where.role = role.toUpperCase();

    // Fetch users
    let users = await prisma.user.findMany(query);

    // Format output (Calculate Store rating if user is STORE_OWNER)
    users = users.map(user => {
      let storeRating = null;
      let storeName = null;
      
      if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
        // Assuming a store owner has one primary store for simplicity, or we aggregate
        const store = user.stores[0];
        storeName = store.name;
        if (store.ratings.length > 0) {
          const sum = store.ratings.reduce((acc, r) => acc + r.score, 0);
          storeRating = (sum / store.ratings.length).toFixed(1);
        } else {
          storeRating = 0;
        }
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        storeName: storeName,
        storeRating: storeRating !== null ? parseFloat(storeRating) : null
      };
    });

    // Handle JS sorting if requested
    if (sortBy) {
      const sortOrder = order && order.toLowerCase() === 'desc' ? -1 : 1;
      users.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * sortOrder;
        if (a[sortBy] > b[sortBy]) return 1 * sortOrder;
        return 0;
      });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
