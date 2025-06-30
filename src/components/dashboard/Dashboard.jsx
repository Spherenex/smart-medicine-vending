// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
// import { db, auth } from '../../firebase';
// import './DashboardStyles.css';

// const Dashboard = () => {
//   const [chatHistory, setChatHistory] = useState([]);
//   const [healthConditions, setHealthConditions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // Add this line to define setError
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       console.log("Starting to fetch user data");

//       if (!auth.currentUser) {
//         console.error("No authenticated user found!");
//         setLoading(false);
//         return;
//       }

//       console.log("Current user ID:", auth.currentUser.uid);

//       try {
//         // Test simple document retrieval first
//         console.log("Trying to fetch user profile document");
//         const userProfileRef = doc(db, "users", auth.currentUser.uid);
//         const userProfileSnap = await getDoc(userProfileRef);

//         if (userProfileSnap.exists()) {
//           console.log("User profile found:", userProfileSnap.data());
//         } else {
//           console.error("No user profile document found!");
//         }

//         // Now try to fetch chat messages
//         console.log("Trying to fetch chat messages");
//         const chatQuery = query(
//           collection(db, 'chatMessages'),
//           where('userId', '==', auth.currentUser.uid)
//           // Temporarily remove ordering to see if that's causing issues
//           // orderBy('timestamp', 'desc')
//         );

//         console.log("Query created, executing...");
//         const chatSnapshot = await getDocs(chatQuery);
//         console.log("Query executed, processing results");

//         const chats = chatSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//           timestamp: doc.data().timestamp?.toDate?.() ? doc.data().timestamp.toDate().toLocaleString() : 'N/A'
//         }));

//         console.log("Chat messages processed:", chats.length);
//         setChatHistory(chats);

//         // Extract detected conditions
//         const conditions = chats
//           .filter(msg => msg.sender === 'bot' && msg.detectedConditions)
//           .flatMap(msg => msg.detectedConditions || [])
//           .filter((condition, index, self) => 
//             condition && self.findIndex(c => c?.name === condition?.name) === index
//           );

//         console.log("Detected conditions:", conditions.length);
//         setHealthConditions(conditions);

//       } catch (error) {
//         console.error("Error in fetchUserData:", error);
//         setError("Failed to load data: " + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return <div className="loading-spinner">Loading...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Your Health Dashboard</h1>
//         <div className="dashboard-tabs">
//           <button
//             className={activeTab === 'overview' ? 'active' : ''}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button
//             className={activeTab === 'chatHistory' ? 'active' : ''}
//             onClick={() => setActiveTab('chatHistory')}
//           >
//             Chat History
//           </button>
//           <button
//             className={activeTab === 'conditions' ? 'active' : ''}
//             onClick={() => setActiveTab('conditions')}
//           >
//             Health Conditions
//           </button>
//         </div>
//       </div>

//       <div className="dashboard-content">
//         {activeTab === 'overview' && (
//           <div className="overview-section">
//             <div className="stat-card">
//               <h3>Total Consultations</h3>
//               <p className="stat-value">{Math.floor(chatHistory.length / 2)}</p>
//             </div>
//             <div className="stat-card">
//               <h3>Detected Conditions</h3>
//               <p className="stat-value">{healthConditions.length}</p>
//             </div>
//             <div className="stat-card">
//               <h3>Last Consultation</h3>
//               <p className="stat-value">
//                 {chatHistory.length > 0 ? chatHistory[0].timestamp : 'N/A'}
//               </p>
//             </div>

//             <div className="recent-activity">
//               <h3>Recent Activity</h3>
//               <ul>
//                 {chatHistory.slice(0, 5).map((chat) => (
//                   <li key={chat.id}>
//                     <span className={`sender-badge ${chat.sender}`}>
//                       {chat.sender === 'user' ? 'You' : 'Bot'}
//                     </span>
//                     <span className="chat-text">{chat.text.substring(0, 50)}...</span>
//                     <span className="chat-time">{chat.timestamp}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {activeTab === 'chatHistory' && (
//           <div className="chat-history-section">
//             <h3>Your Conversation History</h3>
//             {chatHistory.length === 0 ? (
//               <p className="no-data-message">You haven't had any conversations yet. Start chatting with the Health Assistant to see your history here.</p>
//             ) : (
//               <div className="chat-history-list">
//                 {chatHistory.map((chat) => (
//                   <div key={chat.id} className={`chat-history-item ${chat.sender}`}>
//                     <div className="chat-header">
//                       <span className="chat-sender">
//                         {chat.sender === 'user' ? 'You' : 'Health Assistant'}
//                       </span>
//                       <span className="chat-time">{chat.timestamp}</span>
//                     </div>
//                     <div className="chat-body">{chat.text}</div>
//                     {chat.suggestions && chat.suggestions.length > 0 && (
//                       <div className="chat-suggestions">
//                         <h4>Suggestions:</h4>
//                         <ul>
//                           {chat.suggestions.map((suggestion, index) => (
//                             <li key={index}>{suggestion}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'conditions' && (
//           <div className="conditions-section">
//             <h3>Detected Health Conditions</h3>
//             {healthConditions.length === 0 ? (
//               <p className="no-data-message">No health conditions have been detected yet.</p>
//             ) : (
//               <div className="conditions-grid">
//                 {healthConditions.map((condition, index) => (
//                   <div key={index} className="condition-card">
//                     <h4>{condition.name}</h4>
//                     <div className="condition-details">
//                       <p>{condition.description}</p>
//                       <div className="condition-advice">
//                         <h5>Recommendations:</h5>
//                         <ul>
//                           {condition.advice.map((advice, idx) => (
//                             <li key={idx}>{advice}</li>
//                           ))}
//                         </ul>
//                       </div>
//                       <div className="condition-severity">
//                         <span className={`severity-badge ${condition.severity.toLowerCase()}`}>
//                           {condition.severity}
//                         </span>
//                         {condition.severity === 'High' && (
//                           <p className="severity-warning">
//                             Consider seeking medical attention promptly.
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import './DashboardStyles.css';

const Dashboard = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [healthConditions, setHealthConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        console.error("No authenticated user found!");
        setLoading(false);
        return;
      }

      try {
        console.log("Current user ID:", auth.currentUser.uid);

        // Simple query with ONLY where clause - NO orderBy
        // This type of query does NOT require a composite index
        const chatQuery = query(
          collection(db, 'chatMessages1'),
          where('userid', '==', auth.currentUser.uid)
          // NO orderBy here - that's what causes the index requirement
        );

        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
          // Get the data and convert timestamps
          const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() ?
              doc.data().timestamp.toDate().toLocaleString() : 'N/A'
          }));
          
          // Sort manually in JavaScript after retrieving the data
          // This avoids needing an index on the server
          const sortedChats = [...chats].sort((a, b) => {
            // Handle cases where timestamp might be missing
            if (a.timestamp === 'N/A') return 1;
            if (b.timestamp === 'N/A') return -1;
            
            // Parse the dates and sort newest first
            return new Date(b.timestamp) - new Date(a.timestamp);
          });

          console.log("Real-time chat messages update:", chats.length);
          setChatHistory(sortedChats);

          // Extract health conditions and medications
          extractHealthInfo(sortedChats);
          setLoading(false);
        }, (error) => {
          console.error("Error in real-time updates:", error);
          setError("Failed to load real-time data: " + error.message);
          setLoading(false);
        });

        // Clean up listener when component unmounts
        return () => unsubscribe();

      } catch (error) {
        console.error("Error in fetchUserData:", error);
        setError("Failed to load data: " + error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Extract health information from chat messages
  const extractHealthInfo = (chats) => {
    const conditions = [];
    const medications = new Map();

    // Look for condition information in bot messages
    for (const chat of chats) {
      if (chat.sender !== 'bot') continue;

      const text = chat.text || '';

      // Check for detected conditions from the chatbot
      // This will match both the standard format and our new structured format
      if ((text.includes('Detected Conditions:') || text.includes('Based on your symptoms'))
        && (text.includes('possible conditions') || text.includes('could consider') || text.includes('Condition:'))) {

        // Extract condition names
        let conditionName = 'General Health';
        let confidence = 'low';
        let description = '';
        let alertLevel = 'Routine';
        let severity = 'Low';

        // Look for condition information
        const lines = text.split('\n');

        // First try to find structured condition format
        let isStructuredFormat = false;
        let currentCondition = {};

        for (const line of lines) {
          // Check for our structured format markers
          if (line.startsWith('Condition:')) {
            isStructuredFormat = true;

            // Save previous condition if it exists
            if (currentCondition.name) {
              conditions.push(currentCondition);
            }

            // Start new condition
            currentCondition = {
              name: line.replace('Condition:', '').trim(),
              confidence: 'low',
              description: '',
              medications: [],
              homeCareTips: [],
              immediateActions: [],
              preventiveTips: [],
              advice: [],
              alertLevel: 'Routine',
              severity: 'Low',
              whenToSeeDoctor: ''
            };
          }

          if (isStructuredFormat) {
            // Parse structured format
            if (line.startsWith('Confidence:')) {
              currentCondition.confidence = line.replace('Confidence:', '').trim().toLowerCase();
            }
            else if (line.startsWith('Description:')) {
              currentCondition.description = line.replace('Description:', '').trim();
            }
            else if (line.startsWith('Medications:')) {
              const medsText = line.replace('Medications:', '').trim();
              currentCondition.medications = medsText.split(',').map(med => med.trim());
            }
            else if (line.startsWith('Home Care Tips:')) {
              const tipsText = line.replace('Home Care Tips:', '').trim();
              currentCondition.homeCareTips = tipsText.split(',').map(tip => tip.trim());
            }
            else if (line.startsWith('When to see a doctor:')) {
              currentCondition.whenToSeeDoctor = line.replace('When to see a doctor:', '').trim();

              // Set alertLevel and severity based on urgency
              if (line.includes('IMMEDIATE') || line.includes('emergency')) {
                currentCondition.alertLevel = 'Urgent';
                currentCondition.severity = 'High';
              } else if (line.includes('persist') || line.includes('worsen')) {
                currentCondition.alertLevel = 'Monitor';
                currentCondition.severity = 'Medium';
              }
            }
          }
        }

        // Add the last condition if using structured format
        if (isStructuredFormat && currentCondition.name) {
          conditions.push(currentCondition);
          continue; // Skip the unstructured parsing for this message
        }

        // If not in structured format, use the original extraction logic
        for (const line of lines) {
          // Extract condition name and confidence
          if (line.includes('Migraine') || line.includes('migraine')) {
            conditionName = 'Migraine';
            description = 'A neurological condition characterized by severe headaches, often with visual disturbances';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Tension Headache')) {
            conditionName = 'Tension Headache';
            description = 'A common type of headache characterized by dull pain and tightness around the head and neck';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Allergies')) {
            conditionName = 'Allergies';
            description = 'An immune response to substances that are typically harmless';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Asthma') || line.includes('COPD')) {
            conditionName = 'Asthma or COPD';
            description = 'Chronic conditions affecting the airways, causing breathing difficulty';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Gastroenteritis')) {
            conditionName = 'Gastroenteritis';
            description = 'Inflammation of the stomach and intestines, often due to infection';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Acid Reflux') || line.includes('GERD')) {
            conditionName = 'Acid Reflux / GERD';
            description = 'A condition where stomach acid flows back into the esophagus';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Dermatitis') || line.includes('Eczema')) {
            conditionName = 'Dermatitis or Eczema';
            description = 'Inflammation of the skin causing itchy, red rash';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Urticaria') || line.includes('Hives')) {
            conditionName = 'Urticaria (Hives)';
            description = 'An outbreak of swollen, red bumps that appear suddenly on the skin';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Arthritis')) {
            conditionName = 'Arthritis';
            description = 'Inflammation of one or more joints causing pain and stiffness';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Strain') || line.includes('Sprain')) {
            conditionName = 'Muscle/Joint Strain or Sprain';
            description = 'Injury to muscles, ligaments or tendons from overuse or sudden movements';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }
          else if (line.includes('Viral Infection') || line.includes('Cold') || line.includes('Flu')) {
            conditionName = 'Viral Infection (Cold/Flu)';
            description = 'Common viral illnesses affecting the respiratory system';
            if (line.includes('high confidence')) confidence = 'high';
            else if (line.includes('moderate confidence')) confidence = 'moderate';
          }

          // Handle general categories from original code as fallbacks
          else if (text.includes('headache') || text.includes('pain/headache')) {
            conditionName = 'Headache';
          }
          else if (text.includes('pain') && !conditionName.includes('Pain')) {
            conditionName = 'Pain';
          }
          else if (text.includes('fever') && conditionName === 'General Health') {
            conditionName = 'Fever';
          }
          else if (text.includes('allergies') || text.includes('allergy symptoms')) {
            conditionName = 'Allergies';
          }
          else if (text.includes('cough') || text.includes('sore throat')) {
            conditionName = 'Cough/Sore Throat';
          }
          else if (text.includes('digestive') || text.includes('stomach')) {
            conditionName = 'Digestive Issues';
          }
          else if (text.includes('sleep')) {
            conditionName = 'Sleep Problems';
          }
          else if (text.includes('cold') || text.includes('flu')) {
            conditionName = 'Cold/Flu';
          }
          else if (text.includes('skin')) {
            conditionName = 'Skin Condition';
          }
        }

        // Extract medications (same as original code)
        const medicationList = [];
        if (text.includes('Acetaminophen') || text.includes('Tylenol')) {
          medicationList.push('Acetaminophen (Tylenol)');
        }
        if (text.includes('Ibuprofen') || text.includes('Advil') || text.includes('Motrin')) {
          medicationList.push('Ibuprofen (Advil/Motrin)');
        }
        if (text.includes('Naproxen') || text.includes('Aleve')) {
          medicationList.push('Naproxen (Aleve)');
        }
        if (text.includes('Cetirizine') || text.includes('Zyrtec')) {
          medicationList.push('Cetirizine (Zyrtec)');
        }
        if (text.includes('Loratadine') || text.includes('Claritin')) {
          medicationList.push('Loratadine (Claritin)');
        }
        if (text.includes('Diphenhydramine') || text.includes('Benadryl')) {
          medicationList.push('Diphenhydramine (Benadryl)');
        }
        if (text.includes('Melatonin')) {
          medicationList.push('Melatonin');
        }
        if (text.includes('Dextromethorphan') || text.includes('Robitussin')) {
          medicationList.push('Dextromethorphan (Robitussin)');
        }
        if (text.includes('Guaifenesin') || text.includes('Mucinex')) {
          medicationList.push('Guaifenesin (Mucinex)');
        }
        if (text.includes('Antacids')) {
          medicationList.push('Antacids');
        }
        if (text.includes('H2 blockers') || text.includes('famotidine') || text.includes('Pepcid')) {
          medicationList.push('H2 Blockers (Famotidine/Pepcid)');
        }
        if (text.includes('Proton pump inhibitors') || text.includes('omeprazole') || text.includes('Prilosec')) {
          medicationList.push('Proton Pump Inhibitors (Omeprazole/Prilosec)');
        }

        // Extract home care tips (same as original code)
        const homeCareTips = [];
        if (text.includes('Stay hydrated') || text.includes('Drink plenty')) {
          homeCareTips.push('Stay hydrated by drinking plenty of fluids');
        }
        if (text.includes('Rest') || text.includes('Get plenty of rest')) {
          homeCareTips.push('Get adequate rest');
        }
        if (text.includes('humidifier')) {
          homeCareTips.push('Use a humidifier to ease congestion');
        }
        if (text.includes('compress')) {
          if (text.includes('cold compress') || text.includes('ice pack')) {
            homeCareTips.push('Apply cold compress to affected area');
          }
          if (text.includes('warm compress') || text.includes('heat')) {
            homeCareTips.push('Apply warm compress to affected area');
          }
        }
        if (text.includes('Avoid') && (text.includes('alcohol') || text.includes('caffeine'))) {
          homeCareTips.push('Avoid alcohol and caffeine');
        }
        if (text.includes('Elevate')) {
          homeCareTips.push('Elevate affected area if possible');
        }
        if (text.includes('Gargle')) {
          homeCareTips.push('Gargle with salt water for sore throat');
        }
        if (text.includes('Avoid lying down after meals')) {
          homeCareTips.push('Avoid lying down after meals');
        }
        if (text.includes('Elevate head during sleep')) {
          homeCareTips.push('Elevate head of bed while sleeping');
        }
        if (text.includes('Avoid trigger foods')) {
          homeCareTips.push('Avoid trigger foods (spicy, fatty, acidic)');
        }

        // Add default home care tips if none found (same as original code)
        if (homeCareTips.length === 0) {
          switch (conditionName) {
            case 'Headache':
            case 'Migraine':
            case 'Tension Headache':
              homeCareTips.push('Rest in a quiet, dark room');
              homeCareTips.push('Apply cold or warm compress to forehead or neck');
              break;
            case 'Fever':
              homeCareTips.push('Rest and stay hydrated');
              homeCareTips.push('Use lightweight clothing and blankets');
              break;
            case 'Cold/Flu':
            case 'Viral Infection (Cold/Flu)':
              homeCareTips.push('Rest and stay hydrated');
              homeCareTips.push('Use a humidifier to ease congestion');
              break;
            case 'Digestive Issues':
            case 'Gastroenteritis':
              homeCareTips.push('Stay hydrated with clear fluids');
              homeCareTips.push('Eat small, bland meals');
              break;
            case 'Acid Reflux / GERD':
              homeCareTips.push('Avoid lying down after meals');
              homeCareTips.push('Elevate head of bed while sleeping');
              homeCareTips.push('Avoid trigger foods (spicy, fatty, acidic)');
              break;
            default:
              homeCareTips.push('Rest and monitor your symptoms');
              break;
          }
        }

        // Extract immediate action plans (same as original code)
        const immediateActions = [];
        for (const line of lines) {
          if (line.includes('immediately') || line.includes('right away') ||
            line.includes('urgent') || line.includes('emergency')) {
            immediateActions.push(line.trim());
          }
        }

        // Add default immediate actions if none found (same as original code)
        if (immediateActions.length === 0) {
          if (text.includes('severe') || text.includes('high fever') ||
            text.includes('difficulty breathing') || text.includes('chest pain')) {
            if (conditionName === 'Fever' && text.includes('above 103')) {
              immediateActions.push('Seek medical attention if fever exceeds 103°F (39.4°C)');
            } else if (conditionName === 'Digestive Issues' && text.includes('blood')) {
              immediateActions.push('Seek immediate medical attention if you notice blood in stool or vomit');
            } else if ((conditionName === 'Cough/Sore Throat' || conditionName === 'Asthma or COPD') && text.includes('breathing')) {
              immediateActions.push('Seek immediate medical attention if you experience difficulty breathing');
            }
          }
        }

        // Determine alert level (same as original code)
        alertLevel = 'Routine';
        if (text.includes('immediately') || text.includes('emergency') ||
          text.includes('urgent') || text.includes('severe pain') ||
          text.includes('right away') || text.includes('difficulty breathing')) {
          alertLevel = 'Urgent';
        } else if (text.includes('consult a doctor') || text.includes('see a doctor if') ||
          text.includes('persist') || text.includes('worsen')) {
          alertLevel = 'Monitor';
        }

        // Extract preventive health tips (same as original code)
        const preventiveTips = [];
        for (const line of lines) {
          if ((line.includes('prevent') || line.includes('avoid') ||
            line.includes('reduce') || line.includes('lifestyle')) &&
            !line.includes('medication')) {
            preventiveTips.push(line.trim());
          }
        }

        // Add default preventive tips if none found (same as original code)
        if (preventiveTips.length === 0) {
          switch (conditionName) {
            case 'Headache':
            case 'Migraine':
            case 'Tension Headache':
              preventiveTips.push('Maintain regular sleep schedule');
              preventiveTips.push('Stay hydrated and manage stress');
              preventiveTips.push('Consider tracking triggers in a journal');
              break;
            case 'Allergies':
              preventiveTips.push('Identify and avoid allergen triggers');
              preventiveTips.push('Keep windows closed during high pollen seasons');
              preventiveTips.push('Use air purifiers with HEPA filters');
              break;
            case 'Cold/Flu':
            case 'Viral Infection (Cold/Flu)':
              preventiveTips.push('Wash hands frequently');
              preventiveTips.push('Avoid close contact with sick individuals');
              preventiveTips.push('Consider annual flu vaccination');
              break;
            case 'Digestive Issues':
            case 'Gastroenteritis':
              preventiveTips.push('Eat smaller, more frequent meals');
              preventiveTips.push('Avoid trigger foods (spicy, fatty, acidic)');
              preventiveTips.push('Stay hydrated and include fiber in diet');
              break;
            case 'Acid Reflux / GERD':
              preventiveTips.push('Eat smaller meals more frequently');
              preventiveTips.push('Avoid eating 2-3 hours before bedtime');
              preventiveTips.push('Maintain a healthy weight');
              preventiveTips.push('Avoid trigger foods and beverages');
              break;
            case 'Sleep Problems':
              preventiveTips.push('Maintain consistent sleep schedule');
              preventiveTips.push('Create a relaxing bedtime routine');
              preventiveTips.push('Limit screen time before bed');
              break;
            default:
              preventiveTips.push('Maintain a balanced diet and regular exercise');
              preventiveTips.push('Stay hydrated and get adequate sleep');
              break;
          }
        }

        // Extract advice (same as original code)
        const adviceLines = [];
        let capturingAdvice = false;

        for (const line of lines) {
          if (line.includes('See a doctor if') || line.includes('Seek medical attention')) {
            adviceLines.push(line.trim());
          }

          if (line.includes('Good for:')) {
            capturingAdvice = true;
          } else if (capturingAdvice && line.trim() && !line.includes('Dosage:')) {
            adviceLines.push(line.trim());
          }

          if (capturingAdvice && line.includes('Dosage:')) {
            capturingAdvice = false;
          }
        }

        // Extract when to see doctor information
        let whenToSeeDoctor = '';
        if (text.includes('SEEK IMMEDIATE MEDICAL ATTENTION') ||
          text.includes('CONSULT A HEALTHCARE PROVIDER WITHIN')) {
          // Find the paragraph with doctor advice
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('SEEK IMMEDIATE') ||
              lines[i].includes('CONSULT A HEALTHCARE') ||
              lines[i].includes('seek immediate') ||
              lines[i].includes('consult a healthcare')) {
              whenToSeeDoctor = lines[i].trim();
              // Get the next few lines as well
              for (let j = 1; j < 3 && i + j < lines.length; j++) {
                if (lines[i + j].trim()) {
                  whenToSeeDoctor += ' ' + lines[i + j].trim();
                }
              }
              break;
            }
          }
        }

        // Determine severity (same as original code)
        severity = 'Low';
        if (text.includes('emergency') || text.includes('immediately') ||
          text.includes('severe pain') || text.includes('high fever')) {
          severity = 'High';
        } else if (text.includes('consult a doctor') || text.includes('See a doctor if')) {
          severity = 'Medium';
        }

        // Store the condition info with all guidance
        if (!isStructuredFormat) {
          conditions.push({
            name: conditionName,
            confidence: confidence,
            description: description,
            medications: medicationList,
            advice: adviceLines,
            severity: severity,
            homeCareTips: homeCareTips,
            immediateActions: immediateActions,
            alertLevel: alertLevel,
            preventiveTips: preventiveTips,
            whenToSeeDoctor: whenToSeeDoctor
          });

          // Store medications by condition
          for (const med of medicationList) {
            if (!medications.has(med)) {
              medications.set(med, [conditionName]);
            } else {
              medications.get(med).push(conditionName);
            }
          }
        }
      }
    }

    // Filter to unique conditions (by name)
    const uniqueConditions = [];
    const conditionNames = new Set();

    for (const condition of conditions) {
      if (!conditionNames.has(condition.name)) {
        conditionNames.add(condition.name);
        uniqueConditions.push(condition);
      } else {
        // Merge data for duplicate conditions
        const existingCondition = uniqueConditions.find(c => c.name === condition.name);
        if (existingCondition) {
          // Update confidence if higher
          if (condition.confidence === 'high' ||
            (condition.confidence === 'moderate' && existingCondition.confidence === 'low')) {
            existingCondition.confidence = condition.confidence;
          }

          // Update description if empty
          if (!existingCondition.description && condition.description) {
            existingCondition.description = condition.description;
          }

          // Add unique medications
          for (const med of condition.medications) {
            if (!existingCondition.medications.includes(med)) {
              existingCondition.medications.push(med);
            }
          }

          // Add unique advice
          for (const advice of condition.advice) {
            if (!existingCondition.advice.includes(advice)) {
              existingCondition.advice.push(advice);
            }
          }

          // Add unique home care tips
          for (const tip of condition.homeCareTips) {
            if (!existingCondition.homeCareTips.includes(tip)) {
              existingCondition.homeCareTips.push(tip);
            }
          }

          // Add unique immediate actions
          for (const action of condition.immediateActions) {
            if (!existingCondition.immediateActions.includes(action)) {
              existingCondition.immediateActions.push(action);
            }
          }

          // Add unique preventive tips
          for (const tip of condition.preventiveTips) {
            if (!existingCondition.preventiveTips.includes(tip)) {
              existingCondition.preventiveTips.push(tip);
            }
          }

          // Update whenToSeeDoctor if more urgent
          if (!existingCondition.whenToSeeDoctor ||
            (condition.whenToSeeDoctor && condition.whenToSeeDoctor.includes('IMMEDIATE') &&
              !existingCondition.whenToSeeDoctor.includes('IMMEDIATE'))) {
            existingCondition.whenToSeeDoctor = condition.whenToSeeDoctor;
          }

          // Update alert level to highest level
          if (condition.alertLevel === 'Urgent' ||
            (condition.alertLevel === 'Monitor' && existingCondition.alertLevel === 'Routine')) {
            existingCondition.alertLevel = condition.alertLevel;
          }

          // Update severity to highest level
          if (condition.severity === 'High' ||
            (condition.severity === 'Medium' && existingCondition.severity === 'Low')) {
            existingCondition.severity = condition.severity;
          }
        }
      }
    }

    setHealthConditions(uniqueConditions);
    console.log("Extracted health conditions with guidance:", uniqueConditions);
  };

  // Count consultations
  const getConsultationCount = () => {
    // Count sequences where bot asks about age
    let count = 0;
    for (let i = 0; i < chatHistory.length; i++) {
      const chat = chatHistory[i];
      if (chat.sender === 'bot' &&
        (chat.text.includes("How old are you?") ||
          chat.text.includes("Let's start a new consultation"))) {
        count++;
      }
    }
    return count || 0;
  };

  // Get last consultation date
  const getLastConsultation = () => {
    if (chatHistory.length === 0) return 'N/A';

    // Sort by timestamp
    const sortedChats = [...chatHistory].sort((a, b) => {
      if (a.timestamp === 'N/A') return 1;
      if (b.timestamp === 'N/A') return -1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return sortedChats[0].timestamp;
  };

  if (loading) {
    return <div className="loading-spinner">Loading your health data...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Health Dashboard</h1>
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'chatHistory' ? 'active' : ''}
            onClick={() => setActiveTab('chatHistory')}
          >
            Chat History
          </button>
          <button
            className={activeTab === 'conditions' ? 'active' : ''}
            onClick={() => setActiveTab('conditions')}
          >
            Health Conditions
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-row">
              <div className="stat-card">
                <h3>Total Consultations</h3>
                <p className="stat-value">{getConsultationCount()}</p>
              </div>
              <div className="stat-card">
                <h3>Detected Conditions</h3>
                <p className="stat-value">{healthConditions.length}</p>
              </div>
              <div className="stat-card">
                <h3>Last Consultation</h3>
                <p className="stat-value">{getLastConsultation()}</p>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              {chatHistory.length === 0 ? (
                <p className="no-data">No recent activity</p>
              ) : (
                <ul>
                  {chatHistory.slice(0, 5).map((chat) => (
                    <li key={chat.id}>
                      <span className={`sender-badge ${chat.sender}`}>
                        {chat.sender === 'user' ? 'You' : 'Bot'}
                      </span>
                      <span className="chat-text">{chat.text.substring(0, 50)}...</span>
                      <span className="chat-time">{chat.timestamp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chatHistory' && (
          <div className="chat-history-section">
            <h3>Your Conversation History</h3>
            <div className="chat-history-list">
              {chatHistory.length === 0 ? (
                <p className="no-data">No chat history available</p>
              ) : (
                chatHistory.map((chat) => (
                  <div key={chat.id} className={`chat-history-item ${chat.sender}`}>
                    <div className="chat-header">
                      <span className="chat-sender">
                        {chat.sender === 'user' ? 'You' : 'Health Assistant'}
                      </span>
                      <span className="chat-time">{chat.timestamp}</span>
                    </div>
                    <div className="chat-body">
                      {chat.text.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < chat.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'conditions' && (
          <div className="conditions-section">
            <h3>Detected Health Conditions</h3>
            {healthConditions.length === 0 ? (
              <p className="no-data">No health conditions have been detected yet.</p>
            ) : (
              <div className="conditions-grid">
                {healthConditions.map((condition, index) => (
                  <div key={index} className="condition-card">
                    <div className="condition-header">
                      <h4>{condition.name}</h4>
                      <div className="condition-alerts">
                        <span className={`alert-badge ${condition.alertLevel.toLowerCase()}`}>
                          {condition.alertLevel}
                        </span>
                        <span className={`severity-badge ${condition.severity.toLowerCase()}`}>
                          {condition.severity} Severity
                        </span>
                      </div>
                    </div>

                    <div className="condition-details">
                      {condition.immediateActions && condition.immediateActions.length > 0 && (
                        <div className="action-section immediate">
                          <h5>Immediate Action Plan:</h5>
                          <ul>
                            {condition.immediateActions.map((action, idx) => (
                              <li key={idx}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="medications">
                        <h5>Recommended Medications:</h5>
                        <ul>
                          {condition.medications.length > 0 ? (
                            condition.medications.map((med, idx) => (
                              <li key={idx}>{med}</li>
                            ))
                          ) : (
                            <li>Consult with a healthcare provider for appropriate medications</li>
                          )}
                        </ul>
                      </div>

                      {condition.homeCareTips && condition.homeCareTips.length > 0 && (
                        <div className="home-care">
                          <h5>Home Care Tips:</h5>
                          <ul>
                            {condition.homeCareTips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {condition.preventiveTips && condition.preventiveTips.length > 0 && (
                        <div className="preventive-tips">
                          <h5>Preventive Health Tips:</h5>
                          <ul>
                            {condition.preventiveTips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {condition.advice && condition.advice.length > 0 && (
                        <div className="advice">
                          <h5>Medical Advice:</h5>
                          <ul>
                            {condition.advice.map((advice, idx) => (
                              <li key={idx}>{advice}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {condition.whenToSeeDoctor && (
                        <div className="when-to-see-doctor">
                          <h5>When to See a Doctor:</h5>
                          <p>{condition.whenToSeeDoctor}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;