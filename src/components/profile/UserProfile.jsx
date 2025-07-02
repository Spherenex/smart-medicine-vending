// src/components/profile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { 
  getUserProfile, 
  updateUserProfile, 
  updateUserEmail, 
  updateUserPassword,
  logoutUser 
} from '../../services/authService';
import '../../styles/profile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    medicalHistory: []
  });
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [newMedicalItem, setNewMedicalItem] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  
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
          email: currentUser.email,
          phone: userProfile.phone || '',
          age: userProfile.age || '',
          gender: userProfile.gender || '',
          medicalHistory: userProfile.medicalHistory || []
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
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      // Update profile data
      await updateUserProfile(currentUser.uid, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        age: profile.age,
        gender: profile.gender,
        medicalHistory: profile.medicalHistory
      });
      
      setMessage({
        text: 'Profile updated successfully',
        type: 'success'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
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
  
  // Handle email update
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    
    if (!currentPassword) {
      setMessage({
        text: 'Current password is required to update email',
        type: 'error'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      await updateUserEmail(profile.email, currentPassword);
      
      setMessage({
        text: 'Email updated successfully',
        type: 'success'
      });
      
      // Clear password field
      setCurrentPassword('');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Error updating email:', err);
      
      // Handle different error codes
      if (err.code === 'auth/wrong-password') {
        setMessage({
          text: 'Incorrect password',
          type: 'error'
        });
      } else if (err.code === 'auth/email-already-in-use') {
        setMessage({
          text: 'Email is already in use',
          type: 'error'
        });
      } else {
        setMessage({
          text: 'Failed to update email. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({
        text: 'New passwords do not match',
        type: 'error'
      });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({
        text: 'New password must be at least 6 characters',
        type: 'error'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      await updateUserPassword(currentPassword, newPassword);
      
      setMessage({
        text: 'Password updated successfully',
        type: 'success'
      });
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      
      // Handle different error codes
      if (err.code === 'auth/wrong-password') {
        setMessage({
          text: 'Incorrect current password',
          type: 'error'
        });
      } else {
        setMessage({
          text: 'Failed to update password. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding a medical history item
  const handleAddMedicalItem = (e) => {
    e.preventDefault();
    
    if (!newMedicalItem.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      medicalHistory: [...prev.medicalHistory, newMedicalItem]
    }));
    
    setNewMedicalItem('');
  };
  
  // Handle removing a medical history item
  const handleRemoveMedicalItem = (index) => {
    setProfile(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      setMessage({
        text: 'Failed to log out. Please try again.',
        type: 'error'
      });
    }
  };
  
  // Display loading state
  if (loading && !profile.firstName) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
      
      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="profile-navigation">
        <button 
          className={`nav-button ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          Basic Info
        </button>
        <button 
          className={`nav-button ${activeSection === 'security' ? 'active' : ''}`}
          onClick={() => setActiveSection('security')}
        >
          Security
        </button>
        <button 
          className={`nav-button ${activeSection === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveSection('medical')}
        >
          Medical History
        </button>
      </div>
      
      <div className="profile-content">
        {activeSection === 'basic' && (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <h3>Basic Information</h3>
            
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
            
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
        
        {activeSection === 'security' && (
          <div className="security-forms">
            <form onSubmit={handleEmailUpdate} className="profile-form">
              <h3>Update Email</h3>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your new email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currentPasswordEmail">Current Password</label>
                <input
                  type="password"
                  id="currentPasswordEmail"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter your current password"
                />
              </div>
              
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Email'}
              </button>
            </form>
            
            <form onSubmit={handlePasswordUpdate} className="profile-form">
              <h3>Change Password</h3>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter your new password"
                  minLength="6"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your new password"
                />
              </div>
              
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
        
        {activeSection === 'medical' && (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <h3>Medical History</h3>
            <p className="section-description">
              Add any relevant medical history, conditions, or allergies that may help with symptom analysis.
            </p>
            
            <div className="medical-history-list">
              {profile.medicalHistory.length > 0 ? (
                <ul>
                  {profile.medicalHistory.map((item, index) => (
                    <li key={index} className="medical-history-item">
                      <span>{item}</span>
                      <button 
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveMedicalItem(index)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-history">No medical history items added yet.</p>
              )}
            </div>
            
            <div className="add-medical-form">
              <div className="form-row">
                <input
                  type="text"
                  value={newMedicalItem}
                  onChange={(e) => setNewMedicalItem(e.target.value)}
                  placeholder="Add a medical condition, allergy, or medication..."
                />
                <button 
                  type="button" 
                  className="add-button"
                  onClick={handleAddMedicalItem}
                  disabled={!newMedicalItem.trim()}
                >
                  Add
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Medical History'}
            </button>
            
            <div className="privacy-note">
              <p>
                Your medical information is encrypted and stored securely. It is only used to improve 
                the accuracy of your health assistant and is never shared with third parties.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;