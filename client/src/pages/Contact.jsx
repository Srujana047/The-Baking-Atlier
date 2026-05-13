import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Contact() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <div className="container">
                <h1>Contact Us</h1>
                <p className="muted">Have questions, feedback, or just want to say hi? We'd love to hear from you!</p>
                <p>You can reach us through the following form:</p>
                <form className="form-container" method="POST" action="/api/auth/contact">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your name" required />
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Your email" required />
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" placeholder="Your message" rows="5" required></textarea>
                    <button type="submit" className="btn btn-solid">Send Message</button>
                </form>
                <p className="muted">Alternatively, you can email us directly at <a href="mailto:dummy@gmail.com"></a> dummy@gmail.com</p>
            </div>
        </div>
    );           
}