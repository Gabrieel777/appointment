const express = require ("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// - middleware -
const adminAuth = require("../middlewares/adminAuth");

// - Service - 
const UserService = require("../services/UserService");

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.get("/create", (req, res) => {
    res.render("users/create");
});

router.get("/admin/users", adminAuth, async (req, res) => {
    const users = await UserService.GetAll();
    res.render("admin/users", {users});
});
router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserService.GetByEmail(email);
    if(user){
        const compare = bcrypt.compareSync(password, user.password);
        if(compare){
            req.session.user = {
                id: user.id,
                email: user.email
            }
            res.redirect("/backoffice");
        } else {
            res.redirect("/login");
        }

    } else {
        res.redirect("/login");
    }
});

router.post("/users/create", async (req, res) => {
    const { name, email, password} = req.body;

    const status = await UserService.Create(name, email, password);
    if(status){
        res.redirect("/login");
    }else{
        res.redirect("/create")
    }
});

module.exports = router;