router.get("/monthly-stats", async (req, res) => {
    try {
        const monthlyStats = await User.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    signups: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
        ]);

        res.status(200).json(monthlyStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
