const AdminModel = require("../../modals/admin")
const bcrypt = require('bcrypt')
const ComplaintModel = require("../../modals/complaint")

class admincontroller {

    static dashboard = async (req, res) => {
        try {
            // console.log(req.data1)
            const { name, email, role, image } = req.data1
            res.render('admin/dashboard',{n:name, role:role, img:image})
        } catch (error) {
            console.log(error)
        }
    }
    static admininsert = async (req, res) => {
        try {
            const { name, email, password } = req.body
            // console.log(req.body)
            const hashpassword = await bcrypt.hash(password, 10)
            const result = new AdminModel({
                name: name,
                email: email,
                password: hashpassword,
            })
            await result.save();
            res.redirect('/admin/login')
        } catch (error) {
            console.log(error)
        }
    }
    // static verifylogin = async (req, res) => {
    //     try {
    //         const { email, password } = req.body
    //         if (email && password) {
    //             const admin = await AdminModel.findOne({ email: email })
    //             console.log(admin)
    //             // password check 
    //             if (admin != null) {
    //                 const ismatched = await bcrypt.compare(password, admin.password)
    //                 if (ismatched) {
    //                     res.redirect('/admin/dashboard')
    //                 } else {
    //                     res.redirect('/admin/login')
    //                 }
    //             } else {
    //                 req.redirect('/admin/login')``
    //             }

    //         } else {
    //             res.redirect('/admin/login')
    //         }

    //         console.log(req.body)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    static displaycomplaint = async(req,res)=>{
        try {
            const{name,email,role,image}=req.data1
            const cdata = await ComplaintModel.find()
            res.render('admin/displaycomplaint',{c:cdata,n:name,role:role,img:image})
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = admincontroller