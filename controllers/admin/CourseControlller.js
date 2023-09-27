const CourseModel = require('../../modals/course')
class CourseController {

    static addcourse = async (req, res) => {
        try {
            const { name, email, image, role } = req.data1
            const odata = await CourseModel.find()
            res.render('admin/course/addcourse', { n: name, o: odata, role: role,img:image })
        } catch (error) {
            console.log(error)
        }
    }
    static courseinsert = async (req, res) => {
        try {
            // console.log(req.body)
            const { cname } = req.body
            const result = new CourseModel({
                cname: cname,
            })
            await result.save()
            res.redirect('/addcourse')
        } catch (error) {
            console.log(error)
        }
    }

    static courseview = async (req, res)=>{
        try {
            const {name,email,role, image}=req.data1
            const odata = await CourseModel.findById(req.params.id)
            res.render('admin/course/view',{n:name,role:role,o:odata,img:image})
        } catch (error) {
            console.log(error)
        }
    }

    static courseedit = async (req, res) => {
        try {
            const { name, email, role,image } = req.data1
            const odata = await CourseModel.findById(req.params.id)
            res.render('admin/course/edit', { n: name, o: odata, role: role,img:image })
        } catch (error) {
            console.log(error)
        }
    }

    static courseupdate = async (req, res)=>{
        try {
            const {cname} = req.body
            var data = {
                cname:cname,
            }
            const id = req.params.id
            await CourseModel.findByIdAndUpdate(id, data)
            res.redirect('/addcourse')
        } catch (error) {
            console.log(error)
        }
    }

    static coursedelete = async (req, res)=>{
        try {
            await CourseModel.findByIdAndDelete(req.params.id)
            res.redirect('/addcourse')
        } catch (error) {
            console.log(error)
        }
    }


}

module.exports = CourseController