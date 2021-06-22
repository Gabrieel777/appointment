const express = require ("express");
const router = express.Router();

// - middleware -
const adminAuth = require("../middlewares/adminAuth");


// - services - 
const AppointmentService = require("../services/AppointmentService");


router.get("/newappointment", (req, res) => {
    res.render("appointments/new")
});

router.get("/getcalendar", async (req, res) => {

    let appoiments = await AppointmentService.GetAll(false);
    
    res.json(appoiments);

});

router.get("/event/:id", adminAuth, async (req, res) => {
    let appointment = await AppointmentService.GetById(req.params.id);

    if(appointment){
        res.render("admin/event", {appo: appointment});
    }else{
        res.redirect("/");
    }

})

router.get("/admin/searchresult", adminAuth, async (req, res) => {
    let appos = await AppointmentService.Search(req.query.search);
    res.render("admin/list", {appos});
});


router.get("/admin/list", adminAuth, async (req, res) => {
    let appos = await AppointmentService.GetAll(true);
    res.render("admin/list", {appos});

});

router.post("/finish", async (req, res) => {
    const { id } = req.body;
    const result = await AppointmentService.Finished(id);
    res.redirect("/");
});

router.post("/create", async (req, res) => {
    const {
        name,
        email,
        description,
        cpf,
        date,
        time
    } = req.body;

    var isUndefined = false;

    if(!name || !email || !description || !cpf || !date || !time){
        var isUndefined = true;
    };

    if(!isUndefined){
        let user = await AppointmentService.validateCpf(cpf);
        if(user || cpf.length < 14){
            res.redirect("/newappointment")
        } else {
            let status = await AppointmentService.Create(
                req.body.name,
                req.body.email,
                req.body.description,
                req.body.cpf,
                req.body.date,
                req.body.time
            )
    
            if(status){
                res.render("index");
            } else {
                res.redirect("/newappointment");
            }
        }
    }else{
        res.redirect("/newappointment")
    }   
});



module.exports = router;
