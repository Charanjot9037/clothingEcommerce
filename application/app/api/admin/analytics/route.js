// app/api/admin/analytics/route.js
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.isAdmin) return null;
  return decoded;
}

// GET /api/admin/analytics?period=30
export async function GET(req) {
  try {
    await connectDB();

    const admin = verifyAdmin(req);
    if (!admin) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const days  = parseInt(searchParams.get("period") || "30");
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const prevSince = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);

    const [
      revenueCurrent,
      revenuePrev,
      ordersCurrent,
      ordersPrev,
      newUsersCurrent,
      newUsersPrev,
      totalProducts,
      dailyRevenue,
      statusBreakdown,
      topProducts,
    ] = await Promise.all([
      // Revenue this period
      Order.aggregate([
        { $match: { createdAt: { $gte: since }, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      // Revenue prev period
      Order.aggregate([
        { $match: { createdAt: { $gte: prevSince, $lt: since }, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: since } }),
      Order.countDocuments({ createdAt: { $gte: prevSince, $lt: since } }),
      User.countDocuments({ createdAt: { $gte: since } }),
      User.countDocuments({ createdAt: { $gte: prevSince, $lt: since } }),
      Product.countDocuments(),
      // Daily revenue chart
      Order.aggregate([
        { $match: { createdAt: { $gte: since }, status: "paid" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Order status breakdown — uses your deliveryStatus field
      Order.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: "$deliveryStatus", count: { $sum: 1 } } },
      ]),
      // Top products by revenue — from items array
      Order.aggregate([
        { $match: { createdAt: { $gte: since }, status: "paid" } },
        { $unwind: "$items" },
        {
          $group: {
            _id:     "$items.productId",
            title:   { $first: "$items.title" },
            image:   { $first: "$items.image" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            units:   { $sum: "$items.quantity" },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const revenue     = revenueCurrent[0]?.total ?? 0;
    const prevRevenue = revenuePrev[0]?.total    ?? 0;
    const pct = (c, p) => (p === 0 ? null : Math.round(((c - p) / p) * 100));

    return Response.json({
      success: true,
      period: days,
      stats: {
        revenue,
        revenuePct:  pct(revenue, prevRevenue),
        orders:      ordersCurrent,
        ordersPct:   pct(ordersCurrent, ordersPrev),
        newUsers:    newUsersCurrent,
        usersPct:    pct(newUsersCurrent, newUsersPrev),
        avgOrder:    ordersCurrent ? Math.round(revenue / ordersCurrent) : 0,
        totalProducts,
      },
      dailyRevenue,
      statusBreakdown,
      topProducts,
    });
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
