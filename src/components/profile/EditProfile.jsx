import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { getUserProfile, updateUserProfile } from '../../services/authService';
import '../../styles/profile.css';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    age: '',
    gender: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const navigate = useNavigate();
  
  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile({
          firstName: userProfile.firstName || '',
          lastName: userProfile.lastName || '',
          phone: userProfile.phone || '',
          age: userProfile.age || '',
          gender: userProfile.gender || ''
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        setMessage({
          text: 'Failed to load profile. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [navigate]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      await updateUserProfile(currentUser.uid, profile);
      
      setMessage({
        text: 'Profile updated successfully',
        type: 'success'
      });
      
      // Redirect back to profile page after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({
        text: 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/profile');
  };
  
  if (loading && !profile.firstName) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h2>Edit Profile</h2>
      </div>
      
      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone (optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age (optional)</label>
            <input
              type="number"
              id="age"
              name="age"
              value={profile.age}
              onChange={handleChange}
              min="1"
              max="120"
              placeholder="Enter your age"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Gender (optional)</label>
          <select
            id="gender"
            name="gender"
            value={profile.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;