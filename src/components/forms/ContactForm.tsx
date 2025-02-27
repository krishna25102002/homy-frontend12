import { useRef } from 'react';
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

interface FormData {
  user_name: string;
  user_email: string;
  message: string;
}

const schema = yup
  .object({
    user_name: yup.string().required().label("Name"),
    user_email: yup.string().required().email().label("Email"),
    message: yup.string().required().label("Message"),
  })
  .required();

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const form = useRef<HTMLFormElement>(null);

  const sendEmail = async (data: FormData) => {
    try {
      const payload = {
        name: data.user_name,
        email: data.user_email,
        subject: "Contact Form Submission", // Add a default subject or allow user to input
        message: data.message,
      };

      const response = await axios.post('http://localhost:5000/api/contact', payload);
      if (response.data.success) {
        toast.success('Message sent successfully!', { position: 'top-center' });
        reset(); // Clear the form
      } else {
        toast.error('Failed to send message. Please try again.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred. Please try again later.', { position: 'top-center' });
    }
  };

  return (
    <form ref={form} onSubmit={handleSubmit(sendEmail)}>
      <h3>Send Message</h3>
      <div className="messages"></div>
      <div className="row controls">
        <div className="col-12">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">Name*</label>
            <input type="text" {...register("user_name")} name="user_name" placeholder="Your Name*" />
            <p className="form_error">{errors.user_name?.message}</p>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta form-group mb-40">
            <label htmlFor="">Email*</label>
            <input type="email" {...register("user_email")} placeholder="Email Address*" name="user_email" />
            <p className="form_error">{errors.user_email?.message}</p>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta form-group mb-35">
            <textarea {...register("message")} placeholder="Your message*"></textarea>
            <p className="form_error">{errors.message?.message}</p>
          </div>
        </div>
        <div className="col-12">
          <button type='submit' className="btn-nine text-uppercase rounded-3 fw-normal w-100">Send Message</button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;