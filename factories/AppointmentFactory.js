class AppoiintmentFactory {

    Build(simpleAppo){

        const day = simpleAppo.date.getDate()+1;
        const month = simpleAppo.date.getMonth();
        const year = simpleAppo.date.getFullYear();
        const hour = Number.parseInt(simpleAppo.time.split(":")[0]);
        const minutes = Number.parseInt(simpleAppo.time.split(":")[1]);


        let startDate = new Date(year,month,day,hour,minutes,0,0);
        let endDate = new Date(year,month,day,hour,minutes,0,0);
        endDate.setHours( startDate.getHours() + 1 );

        let appo = {
            id: simpleAppo._id,
            title: simpleAppo.name + " - " + simpleAppo.description,
            notified: simpleAppo.notified,
            email: simpleAppo.email,
            start: startDate,
            end: endDate,
        
        }

        return appo;

    }


};

module.exports = new AppoiintmentFactory();