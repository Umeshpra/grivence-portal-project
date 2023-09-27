const ComplaintModel = require("../../modals/complaint")
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer')

cloudinary.config({
    cloud_name: 'dy0dneuez',
    api_key: '446778784513939',
    api_secret: '13_083cYSSnCJ2rCxXfYRtC2ljA',
});

class ComplaintController {

    static addcomplaint = async (req, res) => {
        const { name, email, role, image, id } = req.data1
        const cdata = await ComplaintModel.find({ user_id: id })
        res.render('complaint/addcomplaint', { c: cdata, n: name, role: role, img: image })
    }

    static complaintinsert = async (req, res) => {
        try {
            // console.log(req.files.image)
            const { name, email, role, image, id } = req.data1
            const { ctype, semester, subject, cdetail, user_id } = req.body
            const complaint = await ComplaintModel.findById(id)
            const file = req.files.image
            const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'profile image'
            })
            const result = new ComplaintModel({
                name: name,
                email: email,
                ctype: ctype,
                cdetail: cdetail,
                semester: semester,
                subject: subject,
                user_id: id,
                image: {
                    public_id: image_upload.public_id,
                    url: image_upload.secure_url,
                }
            })
            await result.save()
            this.sendEmail1(name,email,ctype)
            res.redirect('/addcomplaint')
            console.log(image_upload)
        } catch (error) {
            console.log(error)
        }
    }
    static complaintview = async (req, res) => {
        try {
            const { name, email, role, image } = req.data1
            const cdata = await ComplaintModel.findById(req.params.id)
            res.render('complaint/view', { c: cdata, n: name, role: role, img: image })
        } catch (error) {
            console.log(error)
        }
    }

    static complaintedit = async (req, res) => {
        try {
            const { name, email, role, image } = req.data1
            const cdata = await ComplaintModel.findById(req.params.id)
            res.render('complaint/edit', { c: cdata, n: name, role: role, img: image })
        } catch (error) {
            console.log(error)
        }
    }

    static complaintupdate = async (req, res) => {
        try {
            const { name, email, ctype, semester, subject, cdetail } = req.body
            if (req.files) {
                const compalint = await ComplaintModel.findById(req.params.id)
                const image_id = compalint.image.public_id
                // console.log(image_id) 
                await cloudinary.uploader.destroy(image_id)
                const file = req.files.image
                const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'profile image'
                })
                var data = {
                    name: name,
                    email: email,
                    ctype: ctype,
                    cdetail: cdetail,
                    semester: semester,
                    subject: subject,
                    image: {
                        public_id: image_upload.public_id,
                        url: image_upload.secure_url,
                    }
                }
            } else {
                var data = {
                    name: name,
                    email: email,
                    ctype: ctype,
                    cdetail: cdetail,
                    semester: semester,
                    subject: subject,
                }

            }
            const id = req.params.id
            await ComplaintModel.findByIdAndUpdate(id, data)
            res.redirect('/addcomplaint')
        } catch (error) {
            console.log(error)
        }
    }
    static complaintdelete = async (req, res) => {
        try {
            await ComplaintModel.findByIdAndDelete(req.params.id)
            res.redirect('/addcomplaint')
        } catch (error) {
            console.log(error)
        }
    }

    static updatestatus = async (req, res) => {
        try {
            // console.log(req.body)
            const { name, email, comment, status } = req.body
            await ComplaintModel.findByIdAndUpdate(req.params.id, {
                comment: comment,
                status: status
            })
            this.sendEmail(name, email, comment, status)
            res.redirect('/displaycomplaint')
        } catch (error) {
            console.log(error)
        }
    }
        static sendEmail = async (name, email, comment, status) => {

        //         //console.log("email sending")
        //         //console.log("propertyName")
        // console.log(name, email, comment, status)

        //         //connect with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "umeshprajapati1996@gmail.com",
                pass: "dhrutvwpjnzkwflq",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", //sender address
            to: email, //list of receivers
            subject: `complaint resolved Succesfully`, //Subject line
            text: "hello", //plain text body
            html: `<b>${name}</b> complaint <b>${status}</b> successfully !complaint ${comment}`, // html body
        });
        console.log("Message sent: %s", info.messageId);

    }



    static sendEmail1 = async (name, email, ctype) => {

        //         //console.log("email sending")
        //         //console.log("propertyName")
        console.log(name, email, ctype)

        //         //connect with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "umeshprajapati1996@gmail.com",
                pass: "dhrutvwpjnzkwflq",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", //sender address
            to: email, //list of receivers
            subject: `complaint send Succesfully`, //Subject line
            text: "hello", //plain text body
            html: `<b>${name}</b> complaint <b>${ctype}</b> successfully !please wait`, // html body
        });
        console.log("Message sent: %s", info.messageId);

    }
}
module.exports = ComplaintController