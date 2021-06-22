const express = require ("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
})

router.post("/makeappo", (req, res) => {
    res.redirect("newappointment")
});


module.exports = router;


