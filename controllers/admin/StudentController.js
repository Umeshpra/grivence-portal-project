const StudentModel = require('../../modals/Student')
const CourseModel = require('../../modals/course')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dy0dneuez',
    api_key: '446778784513939',
    api_secret: '13_083cYSSnCJ2rCxXfYRtC2ljA',
});
class StudentController {

    static addstudent = async (req, res) => {
        try {
            const { name, email, role, image } = req.data1
            const data = await StudentModel.find().sort({ _id: -1 })
            const course= await CourseModel.find()
            // console.log(data)
            res.render('admin/student/addstudent', { d:data,n:name,c:course,role:role,img:image, msg:req.flash('success') })
        } catch (error) {
            console.log(error)
        }
    }
    static login = async (req, res) => {
        try {
            res.render('admin/login')
        } catch (error) {
            console.log(error)
        }
    }
    static registration = async (req, res) => {
        try {
            res.render('admin/registration')
        } catch (error) {
            console.log(error)
        }
    }
    static studentinsert = async (req, res) => {
        try {
            // //    console.log(req.files.image) 
            // //    console.log(req.body)
            const file = req.files.image
            // image upload code 
            const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'Profile Image'
            })
            // console.log(image_upload)
            const { name, email, password,course } = req.body
            const student = await StudentModel.findOne({ email: email })
            if (student) {
                req.flash('error', 'email already exists')
                req.redirect('/admin/addstudent')
            } else {
                if (name && email && password) {
                    const hashpassword = await bcrypt.hash(password, 10)
                    const result = new StudentModel({
                        name: name,
                        email: email,
                        password: hashpassword,
                        course:course,
                        image: {
                            public_id: image_upload.public_id,
                            url: image_upload.secure_url,
                        }
                    })
                    await result.save()
                    req.flash('success', 'student insert successfully')
                    res.redirect('/admin/addstudent')
                } else {
                    req.flash('error', 'all field are required')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    static viewstudent = async (req, res) => {
        try {
            // console.log(req.params.id)
            const { name, email, role } = req.data1
            const data = await StudentModel.findById(req.params.id)
            // console.log(data)
            res.render('admin/student/view', { d: data, n: name, role: role })
        } catch (error) {
            console.log(error)
        }
    }
    static editstudent = async (req, res) => {
        try {
            // console.log(req.params.id)
            const { name, email, role, course} = req.data1
            const data = await StudentModel.findById(req.params.id)
            // console.log(data)
            res.render('admin/student/edit', { d: data, n: name, role: role,c:course })
        } catch (error) {
            console.log(error)
        }
    }
    static updatestudent = async (req, res) => {
        try {
            // 
            const { name, email, password,course } = req.body
            const hashpassword = await bcrypt.hash(password, 10)
            if (req.files) {
                // image delete 
                const student = await StudentModel.findById(req.params.id)
                const imageid = student.image.public_id

                await cloudinary.uploader.destroy(imageid)
                //image update
                const file = req.files.image
                //image upload
                const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'Profile Image'
                })
                var data = {
                    name: name,
                    email: email,
                    password: hashpassword,
                    course: course,
                    image: {
                        public_id: image_upload.public_id,
                        url: image_upload.secure_url,
                    }
                }
            } else {
                var data = {
                    name: name,
                    email: email,
                    password: hashpassword,
                    course:course,
                }
            }
            const id = req.params.id
            await StudentModel.findByIdAndUpdate(id, data)
            req.flash('success', 'update successfully')
            res.redirect('/admin/addstudent')
        } catch (error) {
            console.log(error);
        }
    }
    static deletestudent = async (req, res) => {
        try {
            await StudentModel.findByIdAndDelete(req.params.id)
            res.redirect('/admin/addstudent')
        } catch (error) {
            console.log(error)
        }
    }
    static verifylogin = async (req, res) => {
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await StudentModel.findOne({ email: email })
                // console.log(user)
                if (user != null) {
                    const ismatched = await bcrypt.compare(password, user.password)
                    // const ismatched = true
                    if (ismatched) {
                        if (user.role == 'admin') {
                            // Genrate token for login security
                            const token = jwt.sign({ ID: user._id }, 'umesh123456prajapati')
                            // console.log(token)
                            //token store in cookie
                            res.cookie('token', token)
                            res.redirect('/dashboard')
                        }
                        if (user.role == 'student') {
                            // Genrate token for login security
                            const token = jwt.sign({ ID: user._id }, 'umesh123456prajapati')
                            console.log(token)
                            //token store in cookie
                            res.cookie('token', token)
                            res.redirect('/dashboard')
                        }

                    } else {
                        req.flash('error','email and password incorrect')
                        res.redirect('/')
                    }
                } else {
                    req.flash('error','user not register')
                    res.redirect('/')
                }
            } else {
                req.flash('error','email and password required')
                res.redirect('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
    // static verifylogin = async (req, res) => {
    //     try {
    //         // console.log(req.body)
    //         const { email, password } = req.body
    //         if (email && password) {
    //             const user = await StudentModel.findOne({ email: email })
    //             // console.log(user)
    //             if (user != null) {
    //                 const ismatched = await bcrypt.compare(password, user.password)
    //                 console.log(ismatched)
    //                 if (ismatched) {
    //                     if (user.role == 'admin') {
    //                         // Generate token for login 
    //                         const token = jwt.sign({ ID: user._id }, 'umesh123456prajapati')
    //                         console.log(token)
    //                         res.cookie('token', token)
    //                         res.redirect('/admin/dashboard')
    //                     }
    //                     if (user.role == 'student') {
    //                         // Generate token for login 
    //                         const token = jwt.sign({ ID: user._id }, 'umesh123456prajapati')
    //                         // console.log(token)
    //                         res.cookie('token',token)
    //                         res.redirect('/admin/dashboard')
    //                     }
    //                 } else {
    //                     req.flash('error', 'email or password is incorrect')
    //                     res.redirect('/')
    //                 }
    //             } else {
    //                 req.flash('error', 'your are not registered user')
    //                 res.redirect('/')
    //             }
    //         } else {
    //             req.flash('error', 'email and password required')
    //             res.redirect('/')
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // static verifylogin = async (req, res) => {
    //     try {
    //         const { email, password } = req.body
    //         if (email && password) {
    //             const student = await StudentModel.findOne({ email: email })
    //             console.log(this.studentinsert)
    //             // password check 
    //             if (student != null) {
    //                 const ismatched = await bcrypt.compare(password, student.password)
    //                 if (ismatched) {
    //                     res.redirect('/admin/dashboard')
    //                 } else {
    //                     res.redirect('/admin/login')
    //                 }
    //             } else {
    //                 res.redirect('/admin/login')
    //             }

    //         } else {
    //             res.redirect('/admin/login')
    //         }

    //         // console.log(req.body)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    static changepassword = async (req, res) => {
        try {
            // for name on dash
            const { name, email, role } = req.data1
            res.render('admin/student/changepassword', { n: name, role: role, msg: req.flash('error'), msg1: req.flash('success') })
        } catch (error) {
            console.log(error)
        }
    }
    static updatepassword = async (req, res) => {
        try {
            console.log(req.body)
            const { name, email, id, role } = req.data1
            //for pass check
            const { oldpassword, newpassword, cpassword } = req.body
            if (oldpassword && newpassword && cpassword) {
                const user = await StudentModel.findById(id)
                // console.log(user)
                //for password compare
                const ismatched = await bcrypt.compare(oldpassword, user.password)
                if (!ismatched) {
                    req.flash('error', 'old password is incorrect')
                    res.redirect('/changepassword')
                } else {

                    if (newpassword != cpassword) {
                        req.flash('error', "newpassword and confirmpassword doesnot match")
                        res.redirect('/changepassword')

                    } else {
                        const newhashpassword = await bcrypt.hash(newpassword, 10)
                        const r = await StudentModel.findByIdAndUpdate(id, {
                            password: newhashpassword,
                        })
                        req.flash('success', 'password update successfully') //for msg show
                        res.redirect('/changepassword')
                    }
                }
            } else {
                req.flash('error', 'all fields are required')
                res.redirect('/changepassword')
            }
        } catch (error) {
            console.log(error)
        }
    }
    static profile = async (req, res) => {
        try {
            //for name on dash
            const { name, email, phone, city, address, role,image } = req.data1
            res.render('admin/student/profile', { n: name, e: email, p: phone, c: city, a: address, role: role,img:image })
        } catch (error) {
            console.log(error)
        }
    }
    static updateprofile = async (req, res) => {
        try {
            //for name in dash
            const {name,email,id} = req.data1;
            // console.log(req.body)
            if(req.files){
                //first find and destroy old image public_id
                const student = await StudentModel.findById(id)
                const imageid = student.image.public_id 
                await cloudinary.uploader.destroy(imageid)
                const file = req.files.image
                const image_upload = await cloudinary.uploader.upload(file.tempFilePath,({
                    folder:'profile image'
                }))
                var data =  {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    city: req.body.city,
                    address: req.body.address,
                    image:{
                        public_id:image_upload.public_id,
                        url:image_upload.secure_url,
                    }
                }
            } else{
                
                var data =  {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    city: req.body.city,
                    address: req.body.address,
                }
            }
            const update = 
            await StudentModel.findByIdAndUpdate(id, data);

            res.redirect('/profile')
        } catch (error) {
            console.log(error)
        }
    }
    static logoutstudent = async (req, res) => {
        try {
            res.clearCookie("token")
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = StudentController