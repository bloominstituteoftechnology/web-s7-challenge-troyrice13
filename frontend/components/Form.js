import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

const toppingsList = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

const validationSchema = yup.object().shape({
  fullName: yup.string().trim().required('Full name is required').min(3, 'Full name must be at least 3 characters').max(20, 'Full name must be at most 20 characters'),
  size: yup.string().required('Size is required').oneOf(['S', 'M', 'L'], 'Size must be S or M or L.'),
  toppings: yup.array().of(yup.string().oneOf(['1', '2', '3', '4', '5'])),
});

export default function Form() {
  const [formValues, setFormValues] = useState({ fullName: '', size: '', toppings: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true); // 

  useEffect(() => {
    validationSchema.isValid(formValues).then(valid => {
      setIsFormValid(valid);
      setSubmitDisabled(!valid); 
    });
  }, [formValues]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    const updatedValues = { ...formValues, [name]: newValue };

    if (type === "checkbox") {
      handleToppingChange(value);
    } else {
      setFormValues(updatedValues);
    }

  
    validationSchema.validateAt(name, updatedValues).then(() => {
      setFormErrors(currentErrors => ({ ...currentErrors, [name]: '' }));
    }).catch((err) => {
      setFormErrors(currentErrors => ({ ...currentErrors, [name]: err.message }));
    });
  };

  const handleToppingChange = (toppingId) => {
    setFormValues(prevValues => ({
      ...prevValues,
      toppings: prevValues.toppings.includes(toppingId) 
        ? prevValues.toppings.filter(id => id !== toppingId)
        : [...prevValues.toppings, toppingId]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:9009/api/order', formValues);
      setSubmissionMessage(response.data.message);
      setFormValues({ fullName: '', size: '', toppings: [] });
      setIsFormValid(false);
      setSubmitDisabled(true); 
      setFormErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionMessage('Error submitting order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submissionMessage && <div className='success'>{submissionMessage}</div>}

      <div className="input-group">
        <label htmlFor="fullName">Full Name</label><br />
        <input
          name="fullName"
          placeholder="Type full name"
          id="fullName"
          type="text"
          value={formValues.fullName}
          onChange={handleInputChange}
        />
        {formErrors.fullName && <div className='error'>{formErrors.fullName}</div>}
      </div>

      <div className="input-group">
        <label htmlFor="size">Size</label><br />
        <select
          name="size"
          id="size"
          value={formValues.size}
          onChange={handleInputChange}>
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {formErrors.size && <div className='error'>{formErrors.size}</div>}
      </div>

      <div className="input-group">
        {toppingsList.map(topping => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name="toppings"
              value={topping.topping_id}
              checked={formValues.toppings.includes(topping.topping_id)}
              onChange={handleInputChange}
            /> {topping.text}<br />
          </label>
        ))}
      </div>

      <input type="submit" value="Submit Order" disabled={submitDisabled}/>
    </form>
  );
}
