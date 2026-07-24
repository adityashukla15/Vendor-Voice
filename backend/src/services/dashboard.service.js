import Customer from "../models/customer.model.js";
import Inventory from "../models/inventory.model.js";
import Transaction from "../models/transaction.model.js";

export const getDashboardOverview = async (owner) => {

    const [
        totalCustomers,
        totalProducts,
        lowStockProducts,
        outstandingResult,
        revenueResult,
        todaySalesResult
    ] = await Promise.all([

        Customer.countDocuments({
            owner,
            isActive: true
        }),

        Inventory.countDocuments({
            owner,
            isActive: true
        }),

        Inventory.countDocuments({
            owner,
            isActive: true,
            $expr: {
                $lte: [
                    "$quantity",
                    "$lowStockThreshold"
                ]
            }
        }),

        Customer.aggregate([
            {
                $match: {
                    owner,
                    isActive: true
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$outstandingBalance"
                    }
                }
            }
        ]),

        Transaction.aggregate([
            {
                $match: {
                    owner,
                    transactionType: "SALE",
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]),

        Transaction.aggregate([
            {
                $match: {
                    owner,
                    transactionType: "SALE",
                    isDeleted: false,
                    createdAt: {
                        $gte: new Date(new Date().setHours(0,0,0,0))
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ])

    ]);

    return {

        totalCustomers,

        totalProducts,

        lowStockProducts,

        outstandingAmount:
            outstandingResult[0]?.total || 0,

        totalRevenue:
            revenueResult[0]?.total || 0,

        todaySales:
            todaySalesResult[0]?.total || 0

    };

};