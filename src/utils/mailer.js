import nodemailer from "nodemailer"

export const sendEmail = async (correo) => {
    try {
        let pass = process.env.EMAIL_PASS;
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass
            }
        });

        const mailOptions = {
            from: '"Aistencias" <dfggdfgdf@gmail.com>',
            to: correo,
            subject: "Solicitud de cambio de contraseña",
            text: 'Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:5173/#/recuperar?correo=' + correo
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return error;
            } else {
                return info.response;
            }
        });
    } catch (error) {
        console.error("Error en la función sendEmail:", error);
        return error;
    }
}

