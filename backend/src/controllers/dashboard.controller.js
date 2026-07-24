import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

import {
  getDashboardOverview,
} from "../services/dashboard.service.js";

/**
 * @desc Dashboard Overview
 * @route GET /api/dashboard/overview
 * @access Private
 */
export const dashboardOverview = asyncHandler(async (req, res) => {

  const overview = await getDashboardOverview(
    req.user._id
  );

  return successResponse(
    res,
    200,
    "Dashboard overview fetched successfully.",
    {
      overview,
    }
  );
});