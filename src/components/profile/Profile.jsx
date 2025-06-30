import React, { useState, useEffect } from 'react';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './ProfileStyles.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    medicalHistory: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!auth.currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          setError("User profile not found.");
        }
      } catch (error) {
        setError("Failed to load profile data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name: profileData.name,
        age: profileData.age,
        gender: profileData.gender,
        phone: profileData.phone,
        medicalHistory: profileData.medicalHistory
      });
      
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile.");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return <div className="loading-profile">Loading profile data...</div>;
  }
  
  return (
    <div className="profile-container">
      <h2>Your Health Profile</h2>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={profileData.email} 
            disabled
            className="disabled-input"
          />
          <small>Email cannot be changed</small>
        </div>
        
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={profileData.name} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Age</label>
          <input 
            type="number" 
            name="age" 
            value={profileData.age} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={profileData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Phone</label>
          <input 
            type="tel" 
            name="phone" 
            value={profileData.phone} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Medical History</label>
          <textarea 
            name="medicalHistory" 
            value={profileData.medicalHistory} 
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <button 
          type="submit" 
          className="update-profile-button" 
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;