import { Injectable } from "@nestjs/common";


@Injectable()
class MailService {
    async sendMail(emailReceiver: string, subject: string, text: string) {
            // Importar la librería Nodemailer
        const nodemailer = require('nodemailer');

        // Crear un objeto de transporte
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });

        // Configurar el objeto mailOptions
        const mailOptions = {
            from: 'hello@email.com',
            to: emailReceiver,
            subject: subject,
            text: text,
        };

        // Enviar el correo
        transport.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });
    }
}