import express from "express";
import {
  getDashboard,
  getUsers,
  updateUserRole,
  getAdminOrders,
  updateAdminOrderStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// All admin routes require a valid JWT + admin role
router.use(protect, adminOnly);

router.get("/dashboard",                getDashboard);
router.get("/users",                    getUsers);
router.patch("/users/:id/role",         updateUserRole);
router.get("/orders",                   getAdminOrders);
router.patch("/orders/:orderId/status", updateAdminOrderStatus);
router.get("/categories",               getCategories);
router.post("/categories",              createCategory);
router.patch("/categories/:id",         updateCategory);
router.delete("/categories/:id",        deleteCategory);
router.get("/customers",                getCustomers);
router.post("/customers",               createCustomer);
router.patch("/customers/:id",          updateCustomer);
router.delete("/customers/:id",         deleteCustomer);

export default router;
