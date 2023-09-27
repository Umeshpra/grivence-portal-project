class FrontController {
    static home = async (req, res) => {
        try {
            res.render('home', {msg:req.flash('error')})
        } catch (error) {
            console.log(error)
        }
    }
    static about = async (req, res) => {
        try {
            res.render('about')
        } catch (error) {
            console.log(error)
        }
    }
    static grivancesystem = async (req, res) => {
        try {
            res.render('grivancesystem')
        } catch (error) {
            console.log(error)
        }
    }
    static features = async (req, res) => {
        try {
            res.render('features')
        } catch (error) {
            console.log(error)
        }
    }
    static benifits = async (req, res) => {
        try {
            res.render('benifits')
        } catch (error) {
            console.log(error)
        }
    }
    static help = async (req, res) => {
        try {
            res.render('help')
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = FrontController