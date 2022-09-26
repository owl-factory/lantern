import { NextApiRequest, NextApiResponse } from "next";
import { fetch } from "cross-fetch";

// Confirm email d-4269666a403743a3a9be167ca04013c6
// Reset password d-11f082f625f84127858fd276069fbaf3

/**
 * Test email sender.
 * @param req The request to the server
 * @param res The response from teh server
 */
export default function email(req: NextApiRequest, res: NextApiResponse) {
    const to = req.body.to;
    const name = req.body.name;
    const url = req.body.url;
    const body = {
        "personalizations": [{
            "to": [{ "email": to }],
            "dynamic_template_data": { name, url },
        }],
        "from": { "email": "noreply@reroll.app", "name": "Reroll Support" },
        "reply_to": { "email": "support@reroll.app", "name": "Reroll Support" },
        "template_id": "d-11f082f625f84127858fd276069fbaf3",
    };

    fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: new Headers({
            "Authorization": "Bearer " + process.env.SENDGRID_KEY,
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(body),
    }).then(() =>{
        res.status(200).json({ sent: true });
    }).catch((err) => {
        res.status(200).json({ sent: false, error: err.message });
    });
}
