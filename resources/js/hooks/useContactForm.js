import axios from 'axios';
import { useState } from 'react';

export const MESSAGE_MAX_LENGTH = 1000;

export function useContactForm({ onSuccess } = {}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '',
    });

    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            website: '',
        });
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        setStatus({ loading: true, success: false, error: null });

        try {
            await axios.post('/api/contact', formData);
            setStatus({ loading: false, success: true, error: null });
            resetForm();

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setStatus({
                loading: false,
                success: false,
                error: err.response?.data?.message || 'Failed to send message. Please try again.',
            });
        }
    };

    return {
        formData,
        status,
        setStatus,
        handleChange,
        handleSubmit,
        resetForm,
    };
}
