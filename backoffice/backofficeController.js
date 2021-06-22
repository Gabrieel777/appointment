const express = require ("express");
const router = express.Router();

// - middleware - 
const adminAuth = require("../middlewares/adminAuth");

router.get("/backoffice", adminAuth, (req, res) => {
    res.render("admin/backlog/backlog")
});

router.post("/joinAppo", (req, res) => {
    res.redirect("/admin/list")
});

router.post("/joinUsers", (req, res) => {
    res.redirect("/admin/users")
});


module.exports = router;