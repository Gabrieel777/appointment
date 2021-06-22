const appoiment = require("../models/Appointment");
const mongoose = require("mongoose");

const Appo = mongoose.model("Appointment", appoiment);
const AppoiintmentFactory = require("../factories/AppointmentFactory");

const mailer = require("nodemailer");

class AppoimentService {

    async Create(name, email, description, cpf, date, time){

        const newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();
            return true;
        } catch (err) {
            return false;
        };

    };

    async GetAll(showFinished) {
        if(showFinished){
            return await Appo.find();
        }else{
            let appos = await Appo.find({"finished": false})
            let appoiments = [];

            appos.forEach(appoiment => {
                appoiments.push(AppoiintmentFactory.Build(appoiment));
            });
            
            return appoiments;
        }
    };

    async GetById(id){
        try {
            if(id.length == 24){
                let user = await Appo.findOne({"_id": id})
                if(user != null){
                    return user;
                } else {
                    return false
                }
            } else {
                return false;
            }
        } catch (err) {
            console.log(err)
            return {status: false, err: err};   
        }
    };

    async Finished(id){
        try {
            await Appo.findByIdAndUpdate(id, {finished: true});
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    async Search(query){
        try {
            const appos = await Appo.find().or([{email: query}, {cpf: query}])
            return appos;
        } catch (err) {
            console.log(err)
            return [];
        }
    };

    async validateCpf(cpf){
        try {
            const appos = await Appo.findOne({"cpf": cpf, "finished": false})
            if(appos != null){
                return true;
            } else {
                return false
            }
        } catch (err) {
            console.log(err)
            return false;
        }
    };

    async SendNotification(){
        const appos = await this.GetAll(false);
    
        const transporter = mailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "clinicajuliansctt@gmail.com",
                pass: "clinicajulians77"
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        appos.forEach(async app => {

            const date = app.start.getTime();
            const hour = 1000 * 60 * 60
            const gap = date-Date.now();

            if(gap <= hour) {
                
                if(!app.notified){

                    await transporter.sendMail({
                        from: "Clinica Julian's <clinicajuliansctt@gmail.com>",
                        to: app.email,
                        subject: "Olá, tudo bem ? Falta em torno de 1 hora para sua consulta conosco :)"

                    });

                    await Appo.findByIdAndUpdate(app.id, {notified: true});
                    return;
                }
            } else{
                return; 
            }

    });

    }

}



module.exports = new AppoimentService();