import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik } from 'formik';
import * as yup from 'yup';
import './ContactUs.css'
import React, { useState } from 'react';
import '../assets/stylesheets/submissionStatus.css'
import SubmissionStatus from '../components/SubmissionStatus';


const schema = yup.object().shape({
  fullName: yup.string().required(),
  email: yup.string().email().required(),
  message: yup.string().required(),
});

function ContactUs() {

  // handle the submission status
  const [submissionStatus, setSubmissionStatus] = useState('');

  // handle the submission form
  // moved the OnSubmit values to here
  const handleSubmit = (values, { resetForm }) => {
    emailjs.init('dAqk2Q4K45-wCglGe');
 
    emailjs.send('service_iyj7see', 'client_mail', {
      user_name: values.fullName,
      message: values.message,
      user_email: values.email,
    })
      .then(() => {
        setSubmissionStatus('success');
        resetForm(); // Reset the form fields after successful submission
      })
      .catch(() => {
        setSubmissionStatus('error');
      });
  };


  return (
    <div className="container pt-4 d-flex main" >
          <div className=' headerTitle'>
              <h1>We'd love to hear from you</h1>
          </div>
    <Formik
        
      validationSchema={schema}
      onSubmit={handleSubmit}

      // moved the below into the handleSubmit function above
      // ----------------------------------------------------
      // onSubmit={(values)=>{

        
      //   emailjs.init('dAqk2Q4K45-wCglGe');
       
      //     emailjs.send('service_iyj7see', 'client_mail', 
      //     {"user_name": values.fullName,
      //     "message": values.message,
      //     "user_email": values.email
      //     }); 
      
      // }}
      initialValues={{
        fullName: '',
        email: '',
        message: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
      }) => (
        <Form className='container-fluid' noValidate  onSubmit={handleSubmit}  method="GET">
          
          <Row className="mt-2">
            <Form.Group as={Col} md="12" controlId="validationFormik03">
              <Form.Label className='labelAlign' >Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                className='rounded-pill bg-light p-4'
                value={values.fullName}
                onChange={handleChange}
                isInvalid={touched.fullName && errors.fullName}
                placeholder="Enter your full name"
              />

              <Form.Control.Feedback type="invalid" className='feedbackAlign'>
                Enter your full name
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mt-2">
            <Form.Group as={Col} md="12" controlId="validationFormik03">
              <Form.Label className='labelAlign' >Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                className='rounded-pill bg-light p-4'
                placeholder="Enter your valid email"
                value={values.email}
                onChange={handleChange}
                isInvalid={touched.email && errors.email}
              />

              <Form.Control.Feedback type="invalid" className='feedbackAlign'>
                Invalid email
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mt-2">
            <Form.Group as={Col} md="12" controlId="validationFormik03">
              <Form.Label className='labelAlign'  >Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                className='bg-light pt-3 pl-4'
                style={{borderRadius: "20px"}}
                name="message"
                placeholder="Enter your message"
                value={values.message}
                onChange={handleChange}
                isInvalid={touched.message && errors.message}
              />

              <Form.Control.Feedback type="invalid" className='feedbackAlign'>
                Please type your message
              </Form.Control.Feedback>
            </Form.Group>
            
          </Row>
          
          <div className="container-fluid mt-4 text-center">
          <Button className="fs-5  px-5 rounded-pill" style={{backgroundColor:'#0F4C64'}}type="submit">Submit</Button>
          </div>
          <SubmissionStatus status={submissionStatus} /> {/* Use the SubmissionStatus component */}
        </Form>
      )}
    </Formik>
    </div>
    
  ); 
}

export default ContactUs;
// =======
// function Contact() {
//   return (
//     <div>
//       Contact Page
//     </div>
//   )
// }

// export default Contact
// >>>>>>> 4c9154ef3b7d5d6def6765867814061cd94ab2d8
