
// import React, { useState, useEffect, useRef } from 'react';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db, auth } from '../../firebase';
// import './ChatStyles.css';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [options, setOptions] = useState([]);
//   const [patientInfo, setPatientInfo] = useState({
//     age: null,
//     allergies: [],
//     currentMedications: [],
//     symptoms: [],
//     stage: 'initial' // Tracks conversation stage: initial, age, allergies, medications, symptoms, recommendation
//   });
//   const messagesEndRef = useRef(null);

//   // Initialize chat with welcome message
//   useEffect(() => {
//     setMessages([
//       {
//         text: "👋 Hello! I'm your health assistant. I'll need to ask a few questions about you before suggesting medications. Let's start with your age.",
//         sender: 'bot'
//       }
//     ]);

//     // Set initial age options
//     setOptions([
//       { id: 'child', text: 'Under 12 years' },
//       { id: 'teen', text: '12-17 years' },
//       { id: 'adult', text: '18-64 years' },
//       { id: 'senior', text: '65+ years' }
//     ]);

//     setPatientInfo({ ...patientInfo, stage: 'age' });
//   }, []);

//   // Auto-scroll to bottom of chat
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, options]);

//   // Process selection based on current stage
//   const handleOptionSelect = (option) => {
//     if (loading) return;

//     setLoading(true);

//     // Add user's selection to chat
//     setMessages(prevMessages => [...prevMessages, {
//       text: option.text,
//       sender: 'user'
//     }]);

//     // Process based on current stage
//     setTimeout(() => {
//       processSelection(option);
//       setLoading(false);
//     }, 700);
//   };

//   const processSelection = (selectedOption) => {
//     const { stage } = patientInfo;
//     let newStage = stage;
//     let botResponse = '';
//     let newOptions = [];
//     let updatedInfo = { ...patientInfo };

//     // Process based on current stage
//     switch (stage) {
//       case 'age':
//         // Save selected age
//         switch (selectedOption.id) {
//           case 'child':
//             updatedInfo.age = 'under 12';
//             break;
//           case 'teen':
//             updatedInfo.age = '12-17';
//             break;
//           case 'adult':
//             updatedInfo.age = '18-64';
//             break;
//           case 'senior':
//             updatedInfo.age = '65+';
//             break;
//           default:
//             updatedInfo.age = selectedOption.text;
//         }

//         // Move to allergies stage
//         newStage = 'allergies';
//         botResponse = "Do you have any allergies to medications?";
//         newOptions = [
//           { id: 'no_allergies', text: 'No known allergies' },
//           { id: 'nsaid', text: 'NSAIDs (Aspirin, Ibuprofen, etc.)' },
//           { id: 'acetaminophen', text: 'Acetaminophen (Tylenol)' },
//           { id: 'antihistamines', text: 'Antihistamines' },
//           { id: 'antibiotics', text: 'Antibiotics' },
//           { id: 'other_allergies', text: 'Other allergies' }
//         ];
//         break;

//       case 'allergies':
//         // Save selected allergy
//         if (selectedOption.id !== 'no_allergies' && 
//             selectedOption.id !== 'continue_to_medications') {
//           updatedInfo.allergies.push(selectedOption.text);

//           // Offer to add more allergies or continue
//           botResponse = `Added ${selectedOption.text} to your allergies. Do you have any other medication allergies?`;
//           newOptions = [
//             { id: 'continue_to_medications', text: 'No more allergies - continue' },
//             { id: 'nsaid', text: 'NSAIDs (Aspirin, Ibuprofen, etc.)' },
//             { id: 'acetaminophen', text: 'Acetaminophen (Tylenol)' },
//             { id: 'antihistamines', text: 'Antihistamines' },
//             { id: 'antibiotics', text: 'Antibiotics' },
//             { id: 'other_allergies', text: 'Other allergies' }
//           ];
//           // Remove already selected options
//           newOptions = newOptions.filter(opt => 
//             !updatedInfo.allergies.includes(opt.text));
//         } else {
//           // Move to medications stage
//           newStage = 'medications';
//           if (selectedOption.id === 'no_allergies') {
//             updatedInfo.allergies = ['None'];
//           }

//           botResponse = "Are you currently taking any medications?";
//           newOptions = [
//             { id: 'no_medications', text: 'No current medications' },
//             { id: 'pain_meds', text: 'Pain medications' },
//             { id: 'blood_pressure', text: 'Blood pressure medications' },
//             { id: 'diabetes', text: 'Diabetes medications' },
//             { id: 'heart', text: 'Heart medications' },
//             { id: 'psychiatric', text: 'Psychiatric medications' },
//             { id: 'other_meds', text: 'Other medications' }
//           ];
//         }
//         break;

//       case 'medications':
//         // Save selected medication
//         if (selectedOption.id !== 'no_medications' && 
//             selectedOption.id !== 'continue_to_symptoms') {
//           updatedInfo.currentMedications.push(selectedOption.text);

//           // Offer to add more medications or continue
//           botResponse = `Added ${selectedOption.text} to your current medications. Are you taking any other medications?`;
//           newOptions = [
//             { id: 'continue_to_symptoms', text: 'No more medications - continue' },
//             { id: 'pain_meds', text: 'Pain medications' },
//             { id: 'blood_pressure', text: 'Blood pressure medications' },
//             { id: 'diabetes', text: 'Diabetes medications' },
//             { id: 'heart', text: 'Heart medications' },
//             { id: 'psychiatric', text: 'Psychiatric medications' },
//             { id: 'other_meds', text: 'Other medications' }
//           ];
//           // Remove already selected options
//           newOptions = newOptions.filter(opt => 
//             !updatedInfo.currentMedications.includes(opt.text));
//         } else {
//           // Move to symptoms stage
//           newStage = 'symptoms';
//           if (selectedOption.id === 'no_medications') {
//             updatedInfo.currentMedications = ['None'];
//           }

//           botResponse = "What symptoms are you experiencing?";
//           newOptions = [
//             { id: 'headache', text: 'Headache' },
//             { id: 'fever', text: 'Fever' },
//             { id: 'pain', text: 'Pain (muscles, joints, etc.)' },
//             { id: 'allergies', text: 'Allergies (sneezing, itchy eyes)' },
//             { id: 'cough', text: 'Cough/Sore Throat' },
//             { id: 'stomach', text: 'Stomach Issues (nausea, diarrhea)' },
//             { id: 'sleep', text: 'Sleep Problems' },
//             { id: 'skin', text: 'Skin Issues (rash, itching)' },
//             { id: 'cold', text: 'Cold/Flu Symptoms' }
//           ];
//         }
//         break;

//       case 'symptoms':
//         // Save selected symptom
//         if (selectedOption.id !== 'continue_to_recommendation') {
//           updatedInfo.symptoms.push(selectedOption.text);

//           // Offer to add more symptoms or continue
//           botResponse = `Added ${selectedOption.text} to your symptoms. Are you experiencing any other symptoms?`;
//           newOptions = [
//             { id: 'continue_to_recommendation', text: 'No more symptoms - get recommendation' },
//             { id: 'headache', text: 'Headache' },
//             { id: 'fever', text: 'Fever' },
//             { id: 'pain', text: 'Pain (muscles, joints, etc.)' },
//             { id: 'allergies', text: 'Allergies (sneezing, itchy eyes)' },
//             { id: 'cough', text: 'Cough/Sore Throat' },
//             { id: 'stomach', text: 'Stomach Issues (nausea, diarrhea)' },
//             { id: 'sleep', text: 'Sleep Problems' },
//             { id: 'skin', text: 'Skin Issues (rash, itching)' },
//             { id: 'cold', text: 'Cold/Flu Symptoms' }
//           ];
//           // Remove already selected options
//           newOptions = newOptions.filter(opt => 
//             !updatedInfo.symptoms.includes(opt.text));
//         } else {
//           // Move to recommendation stage
//           newStage = 'recommendation';

//           // Generate recommendation
//           botResponse = generateMedicationRecommendation(updatedInfo);

//           // Options after recommendation
//           newOptions = [
//             { id: 'side_effects', text: 'What are the side effects?' },
//             { id: 'duration', text: 'How long should I take this?' },
//             { id: 'alternatives', text: 'Are there alternative treatments?' },
//             { id: 'new_consultation', text: 'Start a new consultation' }
//           ];
//         }
//         break;

//       case 'recommendation':
//         // Handle post-recommendation options
//         if (selectedOption.id === 'side_effects') {
//           botResponse = provideSideEffectsInfo(updatedInfo.symptoms);
//         } else if (selectedOption.id === 'duration') {
//           botResponse = provideDurationInfo(updatedInfo.symptoms);
//         } else if (selectedOption.id === 'alternatives') {
//           botResponse = provideAlternativeTreatments(updatedInfo.symptoms);
//         } else if (selectedOption.id === 'new_consultation') {
//           // Start a new consultation
//           newStage = 'age';
//           botResponse = "Let's start a new consultation. How old are you?";
//           newOptions = [
//             { id: 'child', text: 'Under 12 years' },
//             { id: 'teen', text: '12-17 years' },
//             { id: 'adult', text: '18-64 years' },
//             { id: 'senior', text: '65+ years' }
//           ];
//           // Reset patient info
//           updatedInfo = { 
//             age: null, 
//             allergies: [], 
//             currentMedications: [], 
//             symptoms: [], 
//             stage: 'age' 
//           };
//           break;
//         }

//         // Keep the same options after providing additional info
//         if (selectedOption.id !== 'new_consultation') {
//           newOptions = [
//             { id: 'side_effects', text: 'What are the side effects?' },
//             { id: 'duration', text: 'How long should I take this?' },
//             { id: 'alternatives', text: 'Are there alternative treatments?' },
//             { id: 'new_consultation', text: 'Start a new consultation' }
//           ];
//         }
//         break;

//       default:
//         // Default to age stage if something goes wrong
//         newStage = 'age';
//         botResponse = "Let's start with your age. How old are you?";
//         newOptions = [
//           { id: 'child', text: 'Under 12 years' },
//           { id: 'teen', text: '12-17 years' },
//           { id: 'adult', text: '18-64 years' },
//           { id: 'senior', text: '65+ years' }
//         ];
//         break;
//     }

//     // Update state
//     updatedInfo.stage = newStage;
//     setPatientInfo(updatedInfo);

//     // Add bot response to chat
//     setMessages(prevMessages => [...prevMessages, {
//       text: botResponse,
//       sender: 'bot'
//     }]);

//     // Update options
//     setOptions(newOptions);

//     // Save to Firebase if available
//     try {
//       if (auth.currentUser) {
//         // Save user selection
//         addDoc(collection(db, 'chatMessages'), {
//           text: selectedOption.text,
//           sender: 'user',
//           userId: auth.currentUser.uid,
//           timestamp: serverTimestamp()
//         });

//         // Save bot response
//         addDoc(collection(db, 'chatMessages'), {
//           text: botResponse,
//           sender: 'bot',
//           userId: auth.currentUser.uid,
//           timestamp: serverTimestamp()
//         });
//       }
//     } catch (error) {
//       console.error("Error saving messages:", error);
//       // Continue regardless of Firebase errors
//     }
//   };

//   // Provide information about side effects
//   const provideSideEffectsInfo = (symptoms) => {
//     // Check main symptom category
//     const symptomCategories = [
//       {check: ['Headache', 'Pain'], category: 'pain'},
//       {check: ['Allergies'], category: 'allergies'},
//       {check: ['Cough', 'Throat'], category: 'cough'},
//       {check: ['Stomach', 'nausea', 'diarrhea'], category: 'digestive'},
//       {check: ['Sleep'], category: 'sleep'},
//       {check: ['Cold', 'Flu', 'Fever'], category: 'cold'},
//       {check: ['Skin', 'rash', 'itching'], category: 'skin'}
//     ];

//     let category = 'general';
//     for (const symptomCategory of symptomCategories) {
//       for (const symptom of symptoms) {
//         if (symptomCategory.check.some(term => symptom.includes(term))) {
//           category = symptomCategory.category;
//           break;
//         }
//       }
//       if (category !== 'general') break;
//     }

//     // Return side effects based on category
//     switch (category) {
//       case 'pain':
//         return `Common side effects of pain medications:

// 1. Acetaminophen (Tylenol):
//    - Rare side effects when taken as directed
//    - Liver damage possible with high doses or when combined with alcohol

// 2. Ibuprofen (Advil, Motrin):
//    - Stomach upset, heartburn, nausea
//    - Increased risk of ulcers with long-term use
//    - Possible increased risk of heart attack and stroke
//    - May cause kidney problems in some people

// 3. Naproxen (Aleve):
//    - Similar side effects to ibuprofen, but may last longer
//    - May cause fluid retention

// If you experience severe side effects like difficulty breathing, facial swelling, or severe stomach pain, seek medical attention immediately.`;

//       case 'allergies':
//         return `Common side effects of allergy medications:

// 1. Antihistamines (Zyrtec, Claritin, Allegra):
//    - Drowsiness (more common with older antihistamines like Benadryl)
//    - Dry mouth
//    - Dizziness
//    - Blurred vision
//    - Urinary retention (especially in older adults)

// 2. Nasal Steroids (Flonase, Nasacort):
//    - Nasal irritation or dryness
//    - Nosebleeds
//    - Headache
//    - Unpleasant taste/smell

// If you experience unusual symptoms like severe drowsiness, rapid heartbeat, or confusion, discontinue use and consult a healthcare provider.`;

//       case 'cough':
//         return `Common side effects of cough and cold medications:

// 1. Dextromethorphan (cough suppressants):
//    - Dizziness
//    - Drowsiness
//    - Nausea
//    - At high doses: confusion or excitability

// 2. Guaifenesin (expectorants):
//    - Nausea
//    - Stomach discomfort
//    - Drowsiness (rare)

// 3. Throat lozenges/sprays:
//    - Temporary numbness
//    - Altered taste

// If you experience severe side effects like difficulty breathing or irregular heartbeat, seek medical attention immediately.`;

//       case 'digestive':
//         return `Common side effects of digestive medications:

// 1. Antacids (Tums, Rolaids):
//    - Calcium-based: possible constipation
//    - Magnesium-based: possible diarrhea
//    - Aluminum-based: possible constipation

// 2. H2 Blockers (Pepcid, Tagamet):
//    - Headache
//    - Dizziness
//    - Diarrhea or constipation

// 3. Proton Pump Inhibitors (Prilosec, Nexium):
//    - Headache
//    - Nausea
//    - Diarrhea
//    - Long-term use: possible increased risk of bone fractures, vitamin deficiencies

// 4. Anti-diarrheal medications (Imodium):
//    - Constipation
//    - Drowsiness
//    - Dry mouth

// If you experience severe abdominal pain, bloody stools, or persistent vomiting, seek medical attention immediately.`;

//       case 'sleep':
//         return `Common side effects of sleep medications:

// 1. Diphenhydramine (Benadryl, ZzzQuil):
//    - Daytime drowsiness/grogginess
//    - Dry mouth
//    - Blurred vision
//    - Constipation
//    - Urinary retention (especially in older adults)

// 2. Melatonin:
//    - Headache
//    - Dizziness
//    - Nausea
//    - Vivid dreams or nightmares
//    - Next-day grogginess (with higher doses)

// 3. Doxylamine (Unisom):
//    - Similar side effects to diphenhydramine

// Avoid alcohol when taking sleep aids as it can intensify side effects. If you experience confusion, severe dizziness, or difficulty breathing, seek medical attention immediately.`;

//       case 'cold':
//         return `Common side effects of cold, flu, and fever medications:

// 1. Acetaminophen (Tylenol):
//    - Rare side effects when taken as directed
//    - Liver damage possible with high doses or when combined with alcohol

// 2. NSAIDs (Advil, Motrin, Aleve):
//    - Stomach upset, heartburn
//    - Increased risk of ulcers with long-term use
//    - May increase blood pressure slightly

// 3. Decongestants (Sudafed):
//    - Increased heart rate
//    - Nervousness
//    - Insomnia
//    - Elevated blood pressure

// 4. Combination cold/flu products:
//    - May include multiple ingredients with various side effects
//    - Always check labels for active ingredients

// If you experience severe side effects like difficulty breathing, chest pain, or severe dizziness, seek medical attention immediately.`;

//       case 'skin':
//         return `Common side effects of skin treatments:

// 1. Hydrocortisone cream:
//    - Burning, itching, irritation
//    - Skin thinning (with prolonged use)
//    - Acne or skin discoloration (rare)

// 2. Antihistamine creams:
//    - Local irritation
//    - Burning sensation
//    - Dryness

// 3. Moisturizers and emollients:
//    - Generally very safe
//    - Possible skin irritation or allergic reactions in sensitive individuals

// If you experience worsening of symptoms, spreading rash, or signs of infection (increased pain, swelling, warmth, or discharge), seek medical attention.`;

//       default:
//         return `When taking any medication, it's important to be aware of potential side effects. Common side effects across many medications include:

// 1. Digestive issues (nausea, stomach upset, diarrhea, constipation)
// 2. Drowsiness or dizziness
// 3. Headache
// 4. Dry mouth

// Serious side effects that warrant immediate medical attention include:
// - Difficulty breathing or shortness of breath
// - Severe allergic reactions (rash, itching, swelling)
// - Unusual bleeding or bruising
// - Severe dizziness or fainting
// - Persistent vomiting

// Always read medication labels carefully for specific side effect information and follow dosing instructions precisely.`;
//     }
//   };

//   // Provide information about medication duration
//   const provideDurationInfo = (symptoms) => {
//     // Check main symptom category
//     const symptomCategories = [
//       {check: ['Headache', 'Pain'], category: 'pain'},
//       {check: ['Allergies'], category: 'allergies'},
//       {check: ['Cough', 'Throat'], category: 'cough'},
//       {check: ['Stomach', 'nausea', 'diarrhea'], category: 'digestive'},
//       {check: ['Sleep'], category: 'sleep'},
//       {check: ['Cold', 'Flu', 'Fever'], category: 'cold'},
//       {check: ['Skin', 'rash', 'itching'], category: 'skin'}
//     ];

//     let category = 'general';
//     for (const symptomCategory of symptomCategories) {
//       for (const symptom of symptoms) {
//         if (symptomCategory.check.some(term => symptom.includes(term))) {
//           category = symptomCategory.category;
//           break;
//         }
//       }
//       if (category !== 'general') break;
//     }

//     // Return duration info based on category
//     switch (category) {
//       case 'pain':
//         return `For pain and headache medications:

// 1. Over-the-counter pain relievers (Tylenol, Advil, Aleve):
//    - Take for the shortest time needed to control symptoms
//    - For occasional headaches: 1-2 days is typically sufficient
//    - For minor injuries: 3-5 days is often appropriate
//    - Do not take NSAIDs (Advil, Motrin, Aleve) for more than 10 consecutive days without consulting a doctor
//    - Do not take acetaminophen (Tylenol) for more than 10 consecutive days without consulting a doctor

// If pain persists beyond 10 days, becomes severe, or is accompanied by fever, consult a healthcare provider.`;

//       case 'allergies':
//         return `For allergy medications:

// 1. Antihistamines (Zyrtec, Claritin, Allegra):
//    - Can be taken daily during allergy season or year-round for perennial allergies
//    - Safe for long-term use as directed
//    - May need to try different antihistamines to find the most effective one

// 2. Nasal Steroids (Flonase, Nasacort):
//    - Most effective with regular daily use
//    - May take 1-2 weeks to reach full effectiveness
//    - Safe for long-term use as directed
//    - For seasonal allergies, can begin 1-2 weeks before season starts

// For persistent allergies, consider consulting an allergist for comprehensive treatment.`;

//       case 'cough':
//         return `For cough and sore throat medications:

// 1. Cough suppressants (Dextromethorphan):
//    - Use for 5-7 days maximum
//    - If cough persists beyond 7 days, consult a doctor

// 2. Expectorants (Guaifenesin):
//    - Use for 5-7 days maximum
//    - If symptoms persist beyond 7 days, consult a doctor

// 3. Throat lozenges/sprays:
//    - Use as needed for temporary relief
//    - If sore throat persists beyond 7 days or is severe, consult a doctor

// Most coughs resolve within 1-2 weeks. If accompanied by high fever, difficulty breathing, or coughing up blood, seek medical attention.`;

//       case 'digestive':
//         return `For digestive medications:

// 1. Antacids (Tums, Rolaids):
//    - Use as needed for temporary relief
//    - If using for more than 2 weeks continuously, consult a doctor

// 2. H2 Blockers (Pepcid, Tagamet):
//    - For occasional use: take as needed
//    - For frequent heartburn: up to 14 days
//    - If symptoms persist after 14 days, consult a doctor

// 3. Proton Pump Inhibitors (Prilosec, Nexium):
//    - Usually prescribed for 2-8 weeks depending on condition
//    - Long-term use should be supervised by a doctor

// 4. Anti-diarrheal medications (Imodium):
//    - Use for no more than 2 days
//    - If diarrhea persists beyond 2 days, consult a doctor

// For any digestive symptoms that are severe or persist beyond 2 weeks, consult a healthcare provider.`;

//       case 'sleep':
//         return `For sleep medications:

// 1. Diphenhydramine (Benadryl, ZzzQuil):
//    - Not recommended for more than 2 weeks of consecutive use
//    - Can lead to tolerance and decreased effectiveness
//    - Primarily for occasional sleep difficulties

// 2. Melatonin:
//    - Safe for short-term use (up to 1-2 months)
//    - For longer use, consult with a healthcare provider
//    - Typically taken 1-2 hours before bedtime

// 3. Prescription sleep aids:
//    - Usually prescribed for short periods (7-10 days)
//    - Long-term use should be supervised by a doctor

// For chronic insomnia (lasting more than a month), consult a healthcare provider for proper evaluation and treatment.`;

//       case 'cold':
//         return `For cold, flu, and fever medications:

// 1. Fever reducers (Tylenol, Advil):
//    - Use as needed while fever persists
//    - If fever lasts more than 3 days or exceeds 103°F (39.4°C), consult a doctor

// 2. Decongestants (Sudafed):
//    - Use for no more than 3-5 days
//    - Extended use can lead to rebound congestion

// 3. Combination cold/flu products:
//    - Use for 5-7 days maximum
//    - If symptoms worsen or persist beyond 7-10 days, consult a doctor

// Most colds resolve within 7-10 days, and flu symptoms typically improve within 1-2 weeks. Persistent high fever, difficulty breathing, or worsening symptoms warrant medical attention.`;

//       case 'skin':
//         return `For skin treatments:

// 1. Hydrocortisone cream:
//    - Use for up to 7 days
//    - For face, genital, or rectal areas: limit to 1-2 days
//    - If no improvement after 7 days, consult a doctor

// 2. Antihistamine creams:
//    - Use for up to 7 days
//    - If symptoms worsen or persist, consult a doctor

// 3. Moisturizers and emollients:
//    - Can be used daily as needed
//    - Safe for long-term use

// For persistent or worsening skin conditions, especially those covering large areas or affecting the face, consult a healthcare provider.`;

//       default:
//         return `General medication duration guidelines:

// 1. For acute symptoms (like pain, fever, cough):
//    - Take medication for the shortest time needed to control symptoms
//    - Most over-the-counter medications should not be taken for more than 10 consecutive days without consulting a doctor

// 2. For chronic conditions (like allergies, acid reflux):
//    - Follow your doctor's recommendations
//    - Regular follow-up is important for medication adjustments

// 3. Important timeframes to remember:
//    - Fever: If it lasts more than 3 days, consult a doctor
//    - Pain: If it lasts more than 10 days, consult a doctor
//    - Cough/cold: If symptoms persist beyond 7-10 days, consult a doctor
//    - Digestive issues: If they last more than 2 weeks, consult a doctor

// Always read medication labels carefully for specific duration information and follow instructions precisely.`;
//     }
//   };

//   // Provide information about alternative treatments
//   const provideAlternativeTreatments = (symptoms) => {
//     // Check main symptom category
//     const symptomCategories = [
//       {check: ['Headache', 'Pain'], category: 'pain'},
//       {check: ['Allergies'], category: 'allergies'},
//       {check: ['Cough', 'Throat'], category: 'cough'},
//       {check: ['Stomach', 'nausea', 'diarrhea'], category: 'digestive'},
//       {check: ['Sleep'], category: 'sleep'},
//       {check: ['Cold', 'Flu', 'Fever'], category: 'cold'},
//       {check: ['Skin', 'rash', 'itching'], category: 'skin'}
//     ];

//     let category = 'general';
//     for (const symptomCategory of symptomCategories) {
//       for (const symptom of symptoms) {
//         if (symptomCategory.check.some(term => symptom.includes(term))) {
//           category = symptomCategory.category;
//           break;
//         }
//       }
//       if (category !== 'general') break;
//     }

//     // Return alternative treatments based on category
//     switch (category) {
//       case 'pain':
//         return `Alternative treatments for headaches and pain:

// 1. Non-medication approaches:
//    - Rest in a quiet, dark room (especially for migraines)
//    - Cold or hot compress applied to the painful area
//    - Gentle massage of temples, neck, or shoulders
//    - Adequate hydration
//    - Maintaining regular sleep patterns

// 2. Lifestyle modifications:
//    - Stress management techniques (meditation, deep breathing)
//    - Regular exercise
//    - Identifying and avoiding trigger foods
//    - Maintaining good posture
//    - Proper ergonomics at work

// 3. Complementary therapies (consult qualified practitioners):
//    - Acupuncture
//    - Biofeedback
//    - Cognitive behavioral therapy
//    - Herbal supplements like feverfew or butterbur (for migraines)

// Consult a healthcare provider before starting any new treatment approach, especially herbal supplements which may interact with medications.`;

//       case 'allergies':
//         return `Alternative treatments for allergies:

// 1. Environmental controls:
//    - Use air purifiers with HEPA filters
//    - Keep windows closed during high pollen seasons
//    - Wash bedding weekly in hot water
//    - Vacuum regularly with a HEPA filter vacuum
//    - Shower before bed to remove allergens from hair and skin

// 2. Nasal irrigation:
//    - Saline nasal rinses or neti pots can help flush out allergens
//    - Use distilled or boiled (then cooled) water only

// 3. Natural supplements (limited evidence, consult doctor):
//    - Local honey (for seasonal allergies)
//    - Quercetin
//    - Butterbur
//    - Stinging nettle

// 4. Lifestyle approaches:
//    - Track pollen counts and limit outdoor exposure when counts are high
//    - Wear sunglasses outdoors to protect eyes from allergens
//    - Remove shoes at the door to avoid tracking allergens inside

// These approaches work best as complements to, not replacements for, conventional treatments for moderate to severe allergies.`;

//       case 'cough':
//         return `Alternative treatments for cough and sore throat:

// 1. Hydration and humidity:
//    - Drink plenty of warm fluids (tea, broth)
//    - Use a humidifier or take steamy showers
//    - Gargle with warm salt water (1/4 tsp salt in 8oz warm water)

// 2. Natural remedies:
//    - Honey (not for children under 1 year) - 1-2 teaspoons as needed
//    - Lemon and honey tea
//    - Throat-soothing teas like licorice root, marshmallow root, or slippery elm
//    - Ginger tea with honey

// 3. Comfort measures:
//    - Rest your voice
//    - Avoid irritants like smoking or pollution
//    - Suck on throat lozenges or hard candies
//    - Stay hydrated

// 4. Prevention:
//    - Regular handwashing
//    - Adequate rest
//    - Proper nutrition

// These remedies can provide relief for mild symptoms but seek medical attention for severe or persistent symptoms.`;

//       case 'digestive':
//         return `Alternative treatments for digestive issues:

// 1. For acid reflux/heartburn:
//    - Elevate the head of your bed 6-8 inches
//    - Avoid eating within 3 hours of bedtime
//    - Identify and avoid trigger foods (spicy, acidic, fatty)
//    - Eat smaller, more frequent meals
//    - Ginger tea or small amounts of apple cider vinegar in water

// 2. For nausea:
//    - Ginger (tea, candies, or capsules)
//    - Peppermint tea (avoid with reflux)
//    - Acupressure wristbands
//    - Small, bland meals

// 3. For diarrhea:
//    - BRAT diet (bananas, rice, applesauce, toast)
//    - Probiotics (yogurt or supplements)
//    - Stay hydrated with clear fluids
//    - Avoid dairy, caffeine, and high-fiber foods temporarily

// 4. For constipation:
//    - Increase fiber intake gradually
//    - Stay well-hydrated
//    - Regular physical activity
//    - Establish a regular bathroom routine

// Consult a healthcare provider for persistent or severe digestive issues, especially if accompanied by weight loss, bleeding, or severe pain.`;

//       case 'sleep':
//         return `Alternative treatments for sleep problems:

// 1. Sleep hygiene practices:
//    - Maintain a consistent sleep schedule (even on weekends)
//    - Create a relaxing bedtime routine
//    - Keep your bedroom cool, dark, and quiet
//    - Avoid screens 1-2 hours before bed (blue light blocking glasses if necessary)
//    - Reserve your bed for sleep and intimacy only

// 2. Relaxation techniques:
//    - Deep breathing exercises
//    - Progressive muscle relaxation
//    - Meditation or mindfulness
//    - Gentle yoga before bed

// 3. Natural supplements (consult doctor before use):
//    - Melatonin (0.5-5mg, 1-2 hours before bedtime)
//    - Valerian root
//    - Magnesium
//    - L-theanine

// 4. Environmental changes:
//    - Use blackout curtains
//    - White noise machine
//    - Comfortable mattress and pillows
//    - Keep pets out of the bedroom if they disrupt sleep

// 5. Daytime habits:
//    - Regular exercise (but not within 2-3 hours of bedtime)
//    - Limit caffeine after noon
//    - Avoid alcohol close to bedtime
//    - Get natural sunlight exposure during the day

// For chronic insomnia, cognitive behavioral therapy for insomnia (CBT-I) is the most effective long-term treatment.`;

//       case 'cold':
//         return `Alternative treatments for cold, flu, and fever:

// 1. Rest and hydration:
//    - Get plenty of rest
//    - Drink clear fluids (water, broth, herbal tea)
//    - Avoid alcohol and caffeine

// 2. Symptom relief:
//    - For congestion: Steam inhalation or hot shower
//    - For sore throat: Warm salt water gargle, honey-lemon tea
//    - For fever: Lukewarm (not cold) sponge bath
//    - For cough: Honey (not for children under 1)

// 3. Supplements (limited evidence, consult doctor):
//    - Vitamin C
//    - Zinc lozenges (started within 24 hours of symptoms)
//    - Elderberry
//    - Echinacea

// 4. Comfort measures:
//    - Use a humidifier
//    - Apply vapor rub to chest
//    - Saline nasal spray for congestion

// While these approaches may provide symptom relief, they won't cure a cold or flu. Seek medical attention for high fever, difficulty breathing, or symptoms that worsen after initial improvement.`;

//       case 'skin':
//         return `Alternative treatments for skin conditions:

// 1. For general skin irritation:
//    - Colloidal oatmeal baths
//    - Aloe vera gel (pure)
//    - Coconut oil for dry skin
//    - Cold compresses for itching

// 2. For specific conditions:
//    - Eczema: Moisturize frequently, avoid harsh soaps
//    - Mild psoriasis: Sunlight exposure (limited, careful amounts)
//    - Contact dermatitis: Identify and avoid triggers
//    - Hives: Cool compresses, loose clothing

// 3. Dietary considerations:
//    - Stay well-hydrated
//    - Consider an anti-inflammatory diet
//    - Omega-3 fatty acids may help some skin conditions

// 4. Lifestyle approaches:
//    - Wear loose, cotton clothing
//    - Avoid extreme temperatures
//    - Use fragrance-free laundry detergent
//    - Manage stress (which can trigger flares of many skin conditions)

// For any skin condition that is widespread, painful, or accompanied by fever or other symptoms, consult a healthcare provider.`;

//       default:
//         return `General alternative approaches to wellness:

// 1. Lifestyle foundations:
//    - Adequate sleep (7-9 hours for most adults)
//    - Regular physical activity (150 minutes moderate exercise weekly)
//    - Balanced nutrition with plenty of fruits and vegetables
//    - Stress management techniques

// 2. Mind-body practices:
//    - Meditation and mindfulness
//    - Yoga or tai chi
//    - Deep breathing exercises
//    - Progressive muscle relaxation

// 3. General wellness supplements (consult doctor before use):
//    - Multivitamin (if diet is lacking)
//    - Vitamin D (especially in winter or with limited sun exposure)
//    - Probiotics for gut health
//    - Omega-3 fatty acids

// 4. Preventive measures:
//    - Regular handwashing
//    - Staying up-to-date on vaccinations
//    - Regular health check-ups
//    - Maintaining social connections

// Remember that alternative approaches work best as complements to, not replacements for, conventional medical care. Always inform your healthcare providers about any complementary approaches you're using.`;
//     }
//   };

//   // Generate medication recommendations based on patient info
//   const generateMedicationRecommendation = (patientInfo) => {
//     const { age, allergies, currentMedications, symptoms } = patientInfo;

//     // Check if allergies contain common medication allergies
//     const hasNsaidAllergy = allergies.some(allergy => 
//       allergy.toLowerCase().includes('nsaid') || 
//       allergy.toLowerCase().includes('ibuprofen') || 
//       allergy.toLowerCase().includes('aspirin'));

//     const hasTylenolAllergy = allergies.some(allergy => 
//       allergy.toLowerCase().includes('tylenol') || 
//       allergy.toLowerCase().includes('acetaminophen'));

//     // Age-specific warnings
//     let ageWarning = '';
//     if (age === 'under 12') {
//       ageWarning = 'Note: For children under 12, please consult with a pediatrician before giving any medication. Dosages for children are different than for adults.\n\n';
//     } else if (age === '65+') {
//       ageWarning = 'Note: Adults over 65 may be more sensitive to medications and may require lower doses. Monitor for side effects carefully.\n\n';
//     }

//     // Determine main symptom category
//     let mainSymptom = '';

//     // Order matters - check most specific conditions first
//     if (symptoms.some(s => s.includes('Headache'))) {
//       mainSymptom = 'headache';
//     } else if (symptoms.some(s => s.includes('Pain'))) {
//       mainSymptom = 'pain';
//     } else if (symptoms.some(s => s.includes('Fever'))) {
//       mainSymptom = 'fever';
//     } else if (symptoms.some(s => s.includes('Allergies'))) {
//       mainSymptom = 'allergies';
//     } else if (symptoms.some(s => s.includes('Cough') || s.includes('Throat'))) {
//       mainSymptom = 'cough';
//     } else if (symptoms.some(s => s.includes('Stomach'))) {
//       mainSymptom = 'stomach';
//     } else if (symptoms.some(s => s.includes('Sleep'))) {
//       mainSymptom = 'sleep';
//     } else if (symptoms.some(s => s.includes('Cold') || s.includes('Flu'))) {
//       mainSymptom = 'cold';
//     } else if (symptoms.some(s => s.includes('Skin'))) {
//       mainSymptom = 'skin';
//     } else {
//       mainSymptom = 'general';
//     }

//     // Generate recommendations based on main symptom
//     let recommendation = '';

//     switch (mainSymptom) {
//       case 'headache':
//       case 'pain':
//         if (!hasNsaidAllergy && !hasTylenolAllergy) {
//           recommendation = `${ageWarning}Based on your symptoms of pain/headache, you could consider:

// 1. Acetaminophen (Tylenol):
//    - Dosage: 325-650mg every 4-6 hours as needed, not exceeding 3,000mg per day
//    - Good for: Pain relief with fewer GI side effects

// 2. Ibuprofen (Advil, Motrin):
//    - Dosage: 200-400mg every 4-6 hours with food
//    - Good for: Pain with inflammation

// Always take the lowest effective dose for the shortest duration needed. See a doctor if your pain is severe or doesn't improve within a few days.`;
//         } else if (!hasTylenolAllergy) {
//           recommendation = `${ageWarning}Based on your symptoms and allergies, you could consider:

// 1. Acetaminophen (Tylenol):
//    - Dosage: 325-650mg every 4-6 hours as needed, not exceeding 3,000mg per day
//    - Good for: Pain relief

// Since you have NSAID allergies, avoid ibuprofen, aspirin, and naproxen. See a doctor if your pain is severe or doesn't improve within a few days.`;
//         } else if (!hasNsaidAllergy) {
//           recommendation = `${ageWarning}Based on your symptoms and allergies, you could consider:

// 1. Ibuprofen (Advil, Motrin):
//    - Dosage: 200-400mg every 4-6 hours with food
//    - Good for: Pain with inflammation

// Since you have Tylenol allergies, avoid acetaminophen products. See a doctor if your pain is severe or doesn't improve within a few days.`;
//         } else {
//           recommendation = `${ageWarning}Based on your allergies to both NSAIDs and acetaminophen, I cannot recommend over-the-counter pain medications. Please consult with your doctor for safe pain management options.`;
//         }
//         break;

//       case 'fever':
//         if (!hasNsaidAllergy && !hasTylenolAllergy) {
//           recommendation = `${ageWarning}Based on your symptoms of fever, you could consider:

// 1. Acetaminophen (Tylenol):
//    - Dosage: 325-650mg every 4-6 hours as needed, not exceeding 3,000mg per day
//    - Good for: Reducing fever with fewer GI side effects

// 2. Ibuprofen (Advil, Motrin):
//    - Dosage: 200-400mg every 4-6 hours with food
//    - Good for: Fever reduction with anti-inflammatory properties

// Stay hydrated and rest. See a doctor if your fever is above 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms.`;
//         } else if (!hasTylenolAllergy) {
//           recommendation = `${ageWarning}Based on your symptoms and allergies, you could consider:

// 1. Acetaminophen (Tylenol):
//    - Dosage: 325-650mg every 4-6 hours as needed, not exceeding 3,000mg per day
//    - Good for: Reducing fever

// Since you have NSAID allergies, avoid ibuprofen products. See a doctor if your fever is above 103°F (39.4°C) or lasts more than 3 days.`;
//         } else if (!hasNsaidAllergy) {
//           recommendation = `${ageWarning}Based on your symptoms and allergies, you could consider:

// 1. Ibuprofen (Advil, Motrin):
//    - Dosage: 200-400mg every 4-6 hours with food
//    - Good for: Fever reduction

// Since you have Tylenol allergies, avoid acetaminophen products. See a doctor if your fever is above 103°F (39.4°C) or lasts more than 3 days.`;
//         } else {
//           recommendation = `${ageWarning}Based on your allergies to both NSAIDs and acetaminophen, I cannot recommend over-the-counter fever reducers. Please consult with your doctor immediately for fever management.`;
//         }
//         break;

//       case 'allergies':
//         recommendation = `${ageWarning}Based on your allergy symptoms, you could consider:

// 1. Cetirizine (Zyrtec):
//    - Dosage: 10mg once daily
//    - Good for: 24-hour relief of allergy symptoms with less drowsiness

// 2. Loratadine (Claritin):
//    - Dosage: 10mg once daily
//    - Good for: Non-drowsy 24-hour relief

// 3. Fexofenadine (Allegra):
//    - Dosage: 180mg once daily
//    - Good for: Fastest relief with minimal drowsiness

// 4. Fluticasone (Flonase) nasal spray:
//    - Dosage: 1-2 sprays per nostril daily
//    - Good for: Nasal symptoms, may take a few days to reach full effect

// If your allergies don't improve with over-the-counter medications, consider seeing an allergist.`;
//         break;

//       case 'cough':
//         recommendation = `${ageWarning}Based on your symptoms of cough/sore throat, you could consider:

// 1. For sore throat:
//    - Throat lozenges with benzocaine or menthol
//    - Warm salt water gargle (1/4 tsp salt in 8oz warm water)
//    - Honey mixed with warm tea (not for children under 1 year)

// 2. For dry cough:
//    - Dextromethorphan (Robitussin DM, Delsym)
//    - Dosage: Follow package directions based on formulation

// 3. For productive cough with mucus:
//    - Guaifenesin (Mucinex)
//    - Dosage: 200-400mg every 4 hours, not exceeding 2,400mg daily

// Stay hydrated to help thin mucus. See a doctor if your cough lasts more than 3 weeks, you're coughing up blood, or you have difficulty breathing.`;
//         break;

//       case 'stomach':
//         recommendation = `${ageWarning}Based on your digestive symptoms, you could consider:

// 1. For heartburn/acid reflux:
//    - Antacids (Tums, Rolaids) for quick relief
//    - H2 blockers (Pepcid, Tagamet) taken 30-60 min before meals
//    - Proton pump inhibitors (Prilosec OTC) once daily before breakfast

// 2. For diarrhea:
//    - Loperamide (Imodium) - follow package directions
//    - Bismuth subsalicylate (Pepto-Bismol) - follow package directions

// 3. For nausea:
//    - Ginger supplements (250mg 3-4 times daily)
//    - Dimenhydrinate (Dramamine) for motion sickness

// Stay hydrated with clear fluids. See a doctor if symptoms are severe, last more than a few days, or you notice blood in your stool.`;
//         break;

//       case 'sleep':
//         recommendation = `${ageWarning}Based on your sleep-related symptoms, you could consider:

// 1. Melatonin:
//    - Dosage: Start with 1-3mg taken 1-2 hours before bedtime
//    - Good for: Helping regulate sleep cycles with minimal side effects
//    - Note: Higher doses don't necessarily work better

// 2. Diphenhydramine (Benadryl, ZzzQuil):
//    - Dosage: 25-50mg taken 30 minutes before bedtime
//    - Good for: Occasional sleeplessness
//    - Note: Not recommended for regular or long-term use

// 3. Doxylamine succinate (Unisom SleepTabs):
//    - Dosage: 25mg taken 30 minutes before bedtime
//    - Good for: Occasional sleeplessness
//    - Note: May cause more morning drowsiness than diphenhydramine

// Improve sleep hygiene by maintaining a regular sleep schedule, avoiding screens before bed, and creating a comfortable sleep environment. For chronic insomnia, consult a healthcare provider.`;
//         break;

//       case 'cold':
//         recommendation = `${ageWarning}Based on your cold/flu symptoms, you could consider:

// 1. For fever and body aches:
//    - Acetaminophen (Tylenol) or Ibuprofen (Advil) - follow previous dosing recommendations

// 2. For nasal congestion:
//    - Pseudoephedrine (Sudafed) - behind pharmacy counter
//    - Phenylephrine (Sudafed PE) - less effective but available over-the-counter
//    - Dosage: Follow package directions, typically every 4-6 hours
//    - Note: Avoid with high blood pressure or heart conditions

// 3. For runny nose/sneezing:
//    - Antihistamines like diphenhydramine (Benadryl) or loratadine (Claritin)
//    - Dosage: Follow package directions

// 4. Combination products (for multiple symptoms):
//    - DayQuil/NyQuil or similar products
//    - Choose based on your specific symptoms
//    - Avoid duplicating ingredients if taking other medications

// Stay hydrated, get plenty of rest, and consider using a humidifier. See a doctor if symptoms are severe, include difficulty breathing, or last longer than 10 days.`;
//         break;

//       case 'skin':
//         recommendation = `${ageWarning}Based on your skin-related symptoms, you could consider:

// 1. For itching/mild rashes:
//    - Hydrocortisone cream (0.5-1%)
//    - Dosage: Apply a thin layer to affected area up to 4 times daily
//    - Good for: Eczema, insect bites, contact dermatitis
//    - Note: Don't use on face, groin, or for more than 7 days without consulting a doctor

// 2. For allergic skin reactions:
//    - Oral antihistamines like diphenhydramine (Benadryl) or cetirizine (Zyrtec)
//    - Dosage: Follow package directions

// 3. For dry, irritated skin:
//    - Moisturizing creams or ointments (Cetaphil, CeraVe, Eucerin)
//    - Apply after bathing while skin is still slightly damp

// See a doctor if the rash is widespread, painful, blistering, accompanied by fever, or doesn't improve within a few days of treatment.`;
//         break;

//       default:
//         recommendation = `${ageWarning}Based on your symptoms, I don't have a specific over-the-counter medication recommendation. Your symptoms may require professional evaluation.

// Some general recommendations:
// - Rest and stay hydrated
// - Monitor your symptoms closely
// - Consider basic over-the-counter pain relievers if you're experiencing discomfort

// Please consult with a healthcare provider for a proper diagnosis and treatment plan tailored to your specific condition.`;
//     }

//     return `${recommendation}\n\nDisclaimer: This information is not a substitute for professional medical advice. Always read medication labels carefully and follow package instructions.`;
//   };

//   // ChatMessage component for displaying messages
//   const ChatMessage = ({ message }) => {
//     const { text, sender } = message;

//     return (
//       <div className={`chat-message ${sender}`}>
//         <div className="message-content">
//           {text.split('\n').map((line, i) => (
//             <React.Fragment key={i}>
//               {line}
//               {i < text.split('\n').length - 1 && <br />}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Start a new consultation
//   const handleNewChat = () => {
//     setPatientInfo({
//       age: null,
//       allergies: [],
//       currentMedications: [],
//       symptoms: [],
//       stage: 'age'
//     });

//     setMessages([{
//       text: "Let's start a new consultation. How old are you?",
//       sender: 'bot'
//     }]);

//     setOptions([
//       { id: 'child', text: 'Under 12 years' },
//       { id: 'teen', text: '12-17 years' },
//       { id: 'adult', text: '18-64 years' },
//       { id: 'senior', text: '65+ years' }
//     ]);
//   };

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-header">
//         <h2>Health Assistant</h2>
//         <p>Select options to get medication recommendations</p>
//         {messages.length > 2 && (
//           <button onClick={handleNewChat} className="new-chat-button">
//             New Consultation
//           </button>
//         )}
//       </div>

//       <div className="messages-container">
//         {messages.map((msg, index) => (
//           <ChatMessage key={index} message={msg} />
//         ))}
//         {loading && <div className="typing-indicator">Assistant is thinking...</div>}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="options-container">
//         {options.map((option) => (
//           <button
//             key={option.id}
//             className="option-button"
//             onClick={() => handleOptionSelect(option)}
//             disabled={loading}
//           >
//             {option.text}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import './ChatStyles.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [detectedConditions, setDetectedConditions] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    age: null,
    gender: null,
    symptoms: [],
    symptomCategory: null,
    stage: 'initial' // Tracks conversation stage
  });
  const messagesEndRef = useRef(null);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      {
        text: "👋 Hello! I'm your health condition detection assistant. I'll analyze your symptoms in real-time. Let's start with your age group.",
        sender: 'bot'
      }
    ]);

    // Set initial age options
    setOptions([
      { id: 'child', text: 'Under 12 years' },
      { id: 'teen', text: '12-17 years' },
      { id: 'adult', text: '18-64 years' },
      { id: 'senior', text: '65+ years' }
    ]);

    setPatientInfo({ ...patientInfo, stage: 'age' });
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, options, detectedConditions]);

  // Improved function to save detected conditions to Firebase
  const saveConditionsToFirebase = async (conditions) => {
    if (!auth.currentUser || conditions.length === 0) return;

    try {
      // Format conditions in a structured way that will be easier to extract
      let conditionsText = "Detected Conditions:\n\n";

      conditions.forEach((condition) => {
        conditionsText += `Condition: ${condition.name}\n`;
        conditionsText += `Confidence: ${condition.confidence}\n`;
        conditionsText += `Description: ${condition.description}\n`;

        // Add medications if applicable
        if (condition.name === "Migraine") {
          conditionsText += `Medications: Acetaminophen (Tylenol), Ibuprofen (Advil/Motrin), Triptans for severe cases\n`;
        } else if (condition.name === "Acid Reflux / GERD") {
          conditionsText += `Medications: Antacids, H2 blockers, Proton pump inhibitors\n`;
        } else if (condition.name === "Allergies") {
          conditionsText += `Medications: Cetirizine (Zyrtec), Loratadine (Claritin), Diphenhydramine (Benadryl)\n`;
        } else if (condition.name === "Possible Heart Disease") {
          conditionsText += `Medications: Aspirin, Statins, Beta-blockers, Nitroglycerin for chest pain\n`;
        } else if (condition.name === "Possible Heart Failure") {
          conditionsText += `Medications: ACE inhibitors, Beta-blockers, Diuretics, Aldosterone antagonists\n`;
        } else if (condition.name === "Possible Arrhythmia") {
          conditionsText += `Medications: Antiarrhythmic drugs, Blood thinners (if prescribed)\n`;
        }

        // Add home care tips
        conditionsText += "Home Care Tips: ";
        if (condition.name === "Migraine") {
          conditionsText += "Rest in a dark room, Apply cold compress, Stay hydrated\n";
        } else if (condition.name === "Acid Reflux / GERD") {
          conditionsText += "Avoid lying down after meals, Elevate head during sleep, Avoid trigger foods\n";
        } else if (condition.name === "Allergies") {
          conditionsText += "Avoid allergens, Use air purifiers, Keep windows closed during high pollen seasons\n";
        } else if (condition.name === "Possible Heart Disease") {
          conditionsText += "Eat heart-healthy diet, Limit sodium intake, Monitor blood pressure if equipment available\n";
        } else if (condition.name === "Possible Heart Failure") {
          conditionsText += "Follow low-sodium diet, Daily weight monitoring, Elevate legs when sitting, Rest between activities\n";
        } else if (condition.name === "Possible Arrhythmia") {
          conditionsText += "Avoid caffeine and stimulants, Practice stress reduction techniques, Log episodes to share with doctor\n";
        } else {
          conditionsText += "Rest, Stay hydrated, Monitor symptoms\n";
        }

        // Add when to see doctor info
        conditionsText += "When to see a doctor: ";
        if (condition.urgent) {
          conditionsText += "SEEK IMMEDIATE MEDICAL ATTENTION if symptoms are severe or worsening rapidly.\n";
        } else {
          conditionsText += "Consult a healthcare provider if symptoms persist beyond 7 days or worsen.\n";
        }

        conditionsText += "\n";
      });

      // Save as a bot message - Updated collection name and field name
      await addDoc(collection(db, 'chatMessages1'), {  // Updated collection name
        text: conditionsText,
        sender: 'bot',
        userid: auth.currentUser.uid,  // Changed to lowercase 'userid'
        timestamp: serverTimestamp(),
        isConditionSummary: true  // Add this flag to make it easier to identify
      });

      console.log("Saved conditions summary to Firebase");
    } catch (error) {
      console.error("Error saving conditions to Firebase:", error);
    }
  };


  // Process selection based on current stage
  const handleOptionSelect = (option) => {
    if (loading) return;

    setLoading(true);

    // Add user's selection to chat
    setMessages(prevMessages => [...prevMessages, {
      text: option.text,
      sender: 'user'
    }]);

    // Process based on current stage
    setTimeout(() => {
      processSelection(option);
      setLoading(false);
    }, 500);
  };

  // Process user selection and determine next step
  const processSelection = (selectedOption) => {
    const { stage } = patientInfo;
    let newStage = stage;
    let botResponse = '';
    let newOptions = [];
    let updatedInfo = { ...patientInfo };

    // Process based on current stage
    switch (stage) {
      case 'age':
        // Save selected age
        updatedInfo.age = selectedOption.text;

        // Move to gender stage
        newStage = 'gender';
        botResponse = "Please select your biological gender:";
        newOptions = [
          { id: 'male', text: 'Male' },
          { id: 'female', text: 'Female' },
          { id: 'other', text: 'Other/Prefer not to say' }
        ];
        break;

      case 'gender':
        // Save gender
        updatedInfo.gender = selectedOption.text;

        // Move to symptom category stage
        newStage = 'symptomCategory';
        botResponse = "What is your main symptom category?";
        newOptions = [
          { id: 'head', text: 'Head and Neurological (Headache, Dizziness, etc.)' },
          { id: 'respiratory', text: 'Respiratory (Cough, Shortness of Breath, etc.)' },
          { id: 'digestive', text: 'Digestive (Nausea, Stomach Pain, etc.)' },
          { id: 'skin', text: 'Skin (Rash, Itching, etc.)' },
          { id: 'musculoskeletal', text: 'Muscles and Joints (Pain, Stiffness, etc.)' },
          { id: 'cardiac', text: 'Heart-Related (Chest Pain, Palpitations, etc.)' },
          { id: 'general', text: 'General (Fever, Fatigue, etc.)' }
        ];
        break;

      case 'symptomCategory':
        // Save symptom category
        updatedInfo.symptomCategory = selectedOption.id;

        // Move to specific symptoms stage based on category
        newStage = 'specificSymptoms';
        botResponse = "Please select all symptoms you are experiencing:";

        // Set specific symptom options based on category
        switch (selectedOption.id) {
          case 'head':
            newOptions = [
              { id: 'headache', text: 'Headache' },
              { id: 'dizziness', text: 'Dizziness or Lightheadedness' },
              { id: 'vision', text: 'Vision Changes' },
              { id: 'confusion', text: 'Confusion or Disorientation' },
              { id: 'tingling', text: 'Numbness or Tingling' },
              { id: 'memory', text: 'Memory Problems' },
              { id: 'neck_pain', text: 'Neck Pain or Stiffness' },
              { id: 'add_symptom', text: 'Add More Symptoms' }
            ];
            break;
          case 'respiratory':
            newOptions = [
              { id: 'cough', text: 'Cough' },
              { id: 'shortness_breath', text: 'Shortness of Breath' },
              { id: 'wheezing', text: 'Wheezing' },
              { id: 'chest_pain', text: 'Chest Pain' },
              { id: 'sore_throat', text: 'Sore Throat' },
              { id: 'runny_nose', text: 'Runny or Stuffy Nose' },
              { id: 'sneezing', text: 'Sneezing' },
              { id: 'add_symptom', text: 'Add More Symptoms' }
            ];
            break;
          case 'digestive':
            newOptions = [
              { id: 'nausea', text: 'Nausea or Vomiting' },
              { id: 'diarrhea', text: 'Diarrhea' },
              { id: 'constipation', text: 'Constipation' },
              { id: 'abdominal_pain', text: 'Abdominal Pain' },
              { id: 'bloating', text: 'Bloating or Gas' },
              { id: 'heartburn', text: 'Heartburn' },
              { id: 'appetite', text: 'Changes in Appetite' },
              { id: 'add_symptom', text: 'Add More Symptoms' }
            ];
            break;
          case 'skin':
            newOptions = [
              { id: 'rash', text: 'Rash' },
              { id: 'itching', text: 'Itching' },
              { id: 'hives', text: 'Hives or Welts' },
              { id: 'redness', text: 'Redness or Inflammation' },
              { id: 'blisters', text: 'Blisters' },
              { id: 'dry_skin', text: 'Dry or Flaky Skin' },
              { id: 'skin_pain', text: 'Pain or Tenderness' },
              { id: 'add_symptom', text: 'Add More Symptoms' }
            ];
            break;
          case 'musculoskeletal':
            newOptions = [
              { id: 'joint_pain', text: 'Joint Pain' },
              { id: 'muscle_pain', text: 'Muscle Pain' },
              { id: 'swelling', text: 'Swelling' },
              { id: 'stiffness', text: 'Stiffness' },
              { id: 'weakness', text: 'Muscle Weakness' },
              { id: 'back_pain', text: 'Back Pain' },
              { id: 'difficulty_moving', text: 'Difficulty Moving' },
              { id: 'add_symptom', text: 'Add More Symptoms' }
            ];
            break;
          case 'cardiac':
            newOptions = [
              { id: 'chest_pain', text: 'Chest Pain or Discomfort' },
              { id: 'irregular_heartbeat', text: 'Palpitations or Irregular Heartbeat' },
              { id: 'shortness_breath', text: 'Shortness of Breath' },
              { id: 'fatigue', text: 'Unusual Fatigue' },
              { id: 'swelling', text: 'Swelling in Legs, Ankles or Feet' },
              { id: 'dizziness', text: 'Dizziness or Lightheadedness' },
              { id: 'fainting', text: 'Fainting Episodes' },
              { id: 'add_symptom', text: 'Add More Symptoms' }
            ];
            break;
          case 'general':
            newOptions = [
              { id: 'fever', text: 'Fever' },
              { id: 'fatigue', text: 'Fatigue or Weakness' },
              { id: 'chills', text: 'Chills or Sweats' },
              { id: 'weight_change', text: 'Weight Loss or Gain' },
              { id: 'sleep', text: 'Sleep Problems' },
              { id: 'anxiety', text: 'Anxiety or Stress' },
              { id: 'appetite_change', text: 'Changes in Appetite' },
              { id: 'add_symptom', text: 'Add More Symptoms' }
            ];
            break;
          default:
            newOptions = [
              { id: 'headache', text: 'Headache' },
              { id: 'fever', text: 'Fever' },
              { id: 'fatigue', text: 'Fatigue' },
              { id: 'add_symptom', text: 'Add More Symptoms' }
            ];
        }
        break;

      case 'specificSymptoms':
        // Handle symptom selection
        if (selectedOption.id !== 'add_symptom' && selectedOption.id !== 'add_more_symptoms' && selectedOption.id !== 'new_consultation') {
          // Add symptom to list if not already selected
          if (!updatedInfo.symptoms.includes(selectedOption.text)) {
            updatedInfo.symptoms.push(selectedOption.text);

            // Update detected conditions in real-time after adding a symptom
            const newConditions = detectConditionsRealTime(updatedInfo);
            setDetectedConditions(newConditions);

            // Save conditions to Firebase if we have detected any
            if (newConditions.length > 0) {
              saveConditionsToFirebase(newConditions);
            }

            // Confirm symptom addition and offer more
            botResponse = `Added "${selectedOption.text}" to your symptoms. I've updated the possible conditions based on your symptoms. You can continue adding symptoms or ask for more information about the detected conditions.`;

            // Keep the same options but filter out the one just selected
            newOptions = options.filter(opt => opt.id !== selectedOption.id);

            // Add options for more info about conditions - ensure no duplicates
            if (newConditions.length > 0) {
              const optionIds = newOptions.map(opt => opt.id);

              if (!optionIds.includes('more_info')) {
                newOptions.push({ id: 'more_info', text: 'Tell me more about these conditions' });
              }

              if (!optionIds.includes('treatment')) {
                newOptions.push({ id: 'treatment', text: 'What treatments are available?' });
              }

              if (!optionIds.includes('when_doctor')) {
                newOptions.push({ id: 'when_doctor', text: 'When should I see a doctor?' });
              }
            }

            // Always add option to restart - but check if it exists first
            if (!newOptions.map(opt => opt.id).includes('new_consultation')) {
              newOptions.push({ id: 'new_consultation', text: 'Start a new consultation' });
            }
          } else {
            // Symptom already selected
            botResponse = `You've already selected "${selectedOption.text}". Please select any other symptoms or options.`;
            newOptions = options;
          }
        } else if (selectedOption.id === 'more_info') {
          // Provide more info about conditions
          botResponse = provideMoreInformation(updatedInfo);

          // Keep same options
          newOptions = options;
        } else if (selectedOption.id === 'treatment') {
          // Provide treatment options
          botResponse = provideTreatmentOptions(updatedInfo);

          // Keep same options
          newOptions = options;
        } else if (selectedOption.id === 'when_doctor') {
          // Provide when to see doctor info
          const urgency = assessUrgency(updatedInfo);
          botResponse = provideWhenToSeeDoctor(updatedInfo, urgency);

          // Keep same options
          newOptions = options;
        } else if (selectedOption.id === 'new_consultation') {
          // Start a new consultation
          newStage = 'age';
          botResponse = "Let's start a new consultation. What is your age group?";
          newOptions = [
            { id: 'child', text: 'Under 12 years' },
            { id: 'teen', text: '12-17 years' },
            { id: 'adult', text: '18-64 years' },
            { id: 'senior', text: '65+ years' }
          ];
          // Reset patient info and detected conditions
          updatedInfo = {
            age: null,
            gender: null,
            symptoms: [],
            symptomCategory: null,
            stage: 'age'
          };
          setDetectedConditions([]);
          break;
        } else {
          // Add more symptom categories option selected
          newStage = 'additionalSymptoms';
          botResponse = "Select another symptom category to add more symptoms:";
          newOptions = [
            { id: 'head', text: 'Head and Neurological' },
            { id: 'respiratory', text: 'Respiratory' },
            { id: 'digestive', text: 'Digestive' },
            { id: 'skin', text: 'Skin' },
            { id: 'musculoskeletal', text: 'Muscles and Joints' },
            { id: 'cardiac', text: 'Heart-Related' },
            { id: 'general', text: 'General' },
            { id: 'done', text: 'Done adding symptoms' }
          ];
        }
        break;

      case 'additionalSymptoms':
        if (selectedOption.id === 'done') {
          // Done adding symptoms, show results
          newStage = 'specificSymptoms';
          botResponse = "Based on the symptoms you've provided, I've identified possible conditions. You can continue adding symptoms or ask for more information.";

          // Options for more info - create new array to avoid duplicates
          const baseOptions = [
            { id: 'add_more_symptoms', text: 'Add More Symptoms' },
            { id: 'more_info', text: 'Tell me more about these conditions' },
            { id: 'treatment', text: 'What treatments are available?' },
            { id: 'when_doctor', text: 'When should I see a doctor?' },
            { id: 'new_consultation', text: 'Start a new consultation' }
          ];

          // Filter out any options that might be duplicates from previous interactions
          const existingOptionIds = options.map(opt => opt.id);
          newOptions = baseOptions.filter(opt => !existingOptionIds.includes(opt.id));

          // If all options were filtered out, use the base options
          if (newOptions.length === 0) {
            newOptions = baseOptions;
          }
        } else {
          // Selected a new symptom category
          updatedInfo.symptomCategory = selectedOption.id;
          newStage = 'specificSymptoms';
          botResponse = "Please select symptoms from this category:";

          // Set specific symptom options based on selected category
          switch (selectedOption.id) {
            case 'head':
              newOptions = [
                { id: 'headache', text: 'Headache' },
                { id: 'dizziness', text: 'Dizziness or Lightheadedness' },
                { id: 'vision', text: 'Vision Changes' },
                { id: 'confusion', text: 'Confusion or Disorientation' },
                { id: 'tingling', text: 'Numbness or Tingling' },
                { id: 'add_symptom', text: 'Add More Symptoms' }
              ];
              break;
            case 'respiratory':
              newOptions = [
                { id: 'cough', text: 'Cough' },
                { id: 'shortness_breath', text: 'Shortness of Breath' },
                { id: 'wheezing', text: 'Wheezing' },
                { id: 'chest_pain', text: 'Chest Pain' },
                { id: 'sore_throat', text: 'Sore Throat' },
                { id: 'add_symptom', text: 'Add More Symptoms' }
              ];
              break;
            case 'cardiac':
              newOptions = [
                { id: 'chest_pain', text: 'Chest Pain or Discomfort' },
                { id: 'irregular_heartbeat', text: 'Palpitations or Irregular Heartbeat' },
                { id: 'shortness_breath', text: 'Shortness of Breath' },
                { id: 'fatigue', text: 'Unusual Fatigue' },
                { id: 'swelling', text: 'Swelling in Legs, Ankles or Feet' },
                { id: 'dizziness', text: 'Dizziness or Lightheadedness' },
                { id: 'fainting', text: 'Fainting Episodes' },
                { id: 'add_symptom', text: 'Add More Symptoms' }
              ];
              break;
            // Similar cases for other categories
            default:
              newOptions = [
                { id: 'headache', text: 'Headache' },
                { id: 'fever', text: 'Fever' },
                { id: 'fatigue', text: 'Fatigue' },
                { id: 'add_symptom', text: 'Add More Symptoms' }
              ];
          }

          // Filter out symptoms already selected
          newOptions = newOptions.filter(opt =>
            !updatedInfo.symptoms.includes(opt.text) || opt.id === 'add_symptom'
          );
        }
        break;

      default:
        // Default to age stage if something goes wrong
        newStage = 'age';
        botResponse = "Let's start with your age group. How old are you?";
        newOptions = [
          { id: 'child', text: 'Under 12 years' },
          { id: 'teen', text: '12-17 years' },
          { id: 'adult', text: '18-64 years' },
          { id: 'senior', text: '65+ years' }
        ];
        break;
    }

    // Update state
    updatedInfo.stage = newStage;
    setPatientInfo(updatedInfo);

    // Add bot response to chat
    setMessages(prevMessages => [...prevMessages, {
      text: botResponse,
      sender: 'bot'
    }]);

    // Remove duplicate buttons (by ID)
    const uniqueOptions = [];
    const optionIds = new Set();

    for (const option of newOptions) {
      if (!optionIds.has(option.id)) {
        uniqueOptions.push(option);
        optionIds.add(option.id);
      }
    }

    // Update options
    setOptions(uniqueOptions);

    // Save to Firebase if available
    try {
      if (auth.currentUser) {
        // Save user selection
        addDoc(collection(db, 'chatMessages1'), {  // Updated collection name
          text: selectedOption.text,
          sender: 'user',
          userid: auth.currentUser.uid,  // Changed to lowercase 'userid'
          timestamp: serverTimestamp()
        });

        // Save bot response
        addDoc(collection(db, 'chatMessages1'), {  // Updated collection name
          text: botResponse,
          sender: 'bot',
          userid: auth.currentUser.uid,  // Changed to lowercase 'userid'
          timestamp: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error saving messages:", error);
      // Continue regardless of Firebase errors
    }
  };

  // Detect conditions in real-time based on symptoms
  const detectConditionsRealTime = (patientInfo) => {
    const { symptoms, symptomCategory, age, gender } = patientInfo;
    let possibleConditions = [];

    // Skip detection if not enough symptoms yet
    if (symptoms.length === 0) {
      return [];
    }

    // Check for symptom combinations and detect conditions

    // Headache and neurological conditions
    if (symptoms.includes('Headache')) {
      if (symptoms.includes('Vision Changes') || symptoms.includes('Dizziness or Lightheadedness')) {
        possibleConditions.push({
          name: "Migraine",
          confidence: "moderate",
          description: "A neurological condition characterized by severe headaches, often with visual disturbances"
        });
      }

      if (symptoms.includes('Neck Pain or Stiffness')) {
        possibleConditions.push({
          name: "Tension Headache",
          confidence: "moderate",
          description: "A common type of headache characterized by dull pain and tightness around the head and neck"
        });
      }

      if (symptoms.includes('Fever') && symptoms.includes('Neck Pain or Stiffness')) {
        possibleConditions.push({
          name: "Possible Meningitis",
          confidence: "low",
          description: "Inflammation of the membranes surrounding the brain and spinal cord - requires immediate medical attention",
          urgent: true
        });
      }
    }

    // Respiratory conditions
    if (symptoms.includes('Cough')) {
      if (symptoms.includes('Fever')) {
        possibleConditions.push({
          name: "Upper Respiratory Infection",
          confidence: "moderate",
          description: "An infection affecting the nose, throat, and airways, commonly known as a cold"
        });

        if (symptoms.includes('Shortness of Breath')) {
          possibleConditions.push({
            name: "Bronchitis or Pneumonia",
            confidence: "moderate",
            description: "Infections affecting the lungs and airways, causing inflammation and breathing difficulty"
          });
        }
      }

      if (symptoms.includes('Wheezing') || symptoms.includes('Shortness of Breath')) {
        possibleConditions.push({
          name: "Asthma or COPD",
          confidence: "moderate",
          description: "Chronic conditions affecting the airways, causing breathing difficulty"
        });
      }
    }

    // Allergy-like symptoms
    if ((symptoms.includes('Runny or Stuffy Nose') || symptoms.includes('Sneezing')) &&
      (symptoms.includes('Itching') || symptoms.includes('Redness or Inflammation'))) {
      possibleConditions.push({
        name: "Allergies",
        confidence: "high",
        description: "An immune response to substances that are typically harmless"
      });
    }

    // Digestive conditions
    if (symptoms.includes('Abdominal Pain')) {
      if (symptoms.includes('Diarrhea') || symptoms.includes('Nausea or Vomiting')) {
        possibleConditions.push({
          name: "Gastroenteritis",
          confidence: "moderate",
          description: "Inflammation of the stomach and intestines, often due to infection"
        });
      }

      if (symptoms.includes('Heartburn')) {
        possibleConditions.push({
          name: "Acid Reflux / GERD",
          confidence: "moderate",
          description: "A condition where stomach acid flows back into the esophagus"
        });
      }
    }

    // Acid Reflux detection without abdominal pain
    if (symptoms.includes('Heartburn')) {
      possibleConditions.push({
        name: "Acid Reflux / GERD",
        confidence: symptoms.includes('Abdominal Pain') ? "high" : "moderate",
        description: "A condition where stomach acid flows back into the esophagus"
      });
    }

    // Skin conditions
    if (symptoms.includes('Rash')) {
      if (symptoms.includes('Itching')) {
        possibleConditions.push({
          name: "Dermatitis or Eczema",
          confidence: "moderate",
          description: "Inflammation of the skin causing itchy, red rash"
        });
      }

      if (symptoms.includes('Hives or Welts')) {
        possibleConditions.push({
          name: "Urticaria (Hives)",
          confidence: "high",
          description: "An outbreak of swollen, red bumps that appear suddenly on the skin"
        });
      }
    }

    // Musculoskeletal conditions
    if (symptoms.includes('Joint Pain')) {
      if (symptoms.includes('Swelling')) {
        possibleConditions.push({
          name: "Arthritis",
          confidence: "moderate",
          description: "Inflammation of one or more joints causing pain and stiffness"
        });
      } else {
        possibleConditions.push({
          name: "Joint Strain or Sprain",
          confidence: "moderate",
          description: "Injury to ligaments or tendons around a joint"
        });
      }
    }

    if (symptoms.includes('Back Pain')) {
      possibleConditions.push({
        name: "Muscle Strain or Tension",
        confidence: "moderate",
        description: "Injury to muscles from overuse or sudden movements"
      });

      if (symptoms.includes('Numbness or Tingling')) {
        possibleConditions.push({
          name: "Possible Nerve Compression",
          confidence: "moderate",
          description: "Pressure on nerves causing pain, numbness, or weakness"
        });
      }
    }

    // General conditions
    if (symptoms.includes('Fever')) {
      if (symptoms.includes('Fatigue or Weakness')) {
        if (symptoms.includes('Cough') || symptoms.includes('Sore Throat')) {
          possibleConditions.push({
            name: "Viral Infection (Cold/Flu)",
            confidence: "high",
            description: "Common viral illnesses affecting the respiratory system"
          });
        } else {
          possibleConditions.push({
            name: "Possible Systemic Infection",
            confidence: "low",
            description: "Infection affecting multiple body systems"
          });
        }
      }
    }

    // Age and gender-specific conditions
    if (age === 'Under 12 years' && symptoms.includes('Fever') && symptoms.includes('Rash')) {
      possibleConditions.push({
        name: "Possible Childhood Viral Exanthem",
        confidence: "moderate",
        description: "Viral infections common in children that cause fever and rash"
      });
    }

    if (gender === 'Female' && symptoms.includes('Abdominal Pain') &&
      (age === '12-17 years' || age === '18-64 years')) {
      possibleConditions.push({
        name: "Possible Gynecological Issue",
        confidence: "low",
        description: "Conditions affecting the female reproductive system"
      });
    }

    // Heart disease detection
    if (symptoms.includes('Chest Pain or Discomfort') || symptoms.includes('Chest Pain')) {
      // High priority condition with chest pain
      possibleConditions.push({
        name: "Possible Heart Disease",
        confidence: symptoms.includes('Shortness of Breath') ? "high" : "moderate",
        description: "Conditions affecting the heart that may cause chest pain and other symptoms",
        urgent: true
      });
      
      // Check for more specific heart condition indicators
      if (symptoms.includes('Shortness of Breath')) {
        if (symptoms.includes('Fatigue or Weakness') || symptoms.includes('Unusual Fatigue')) {
          possibleConditions.push({
            name: "Possible Heart Failure",
            confidence: "moderate",
            description: "A condition where the heart doesn't pump blood as well as it should",
            urgent: true
          });
        }
      }
      
      if (symptoms.includes('Dizziness or Lightheadedness') || 
          symptoms.includes('Palpitations or Irregular Heartbeat')) {
        possibleConditions.push({
          name: "Possible Arrhythmia",
          confidence: "moderate",
          description: "Abnormal heart rhythm that may be felt as palpitations or irregular heartbeat",
          urgent: true
        });
      }
    }

    // Check for heart disease without chest pain
    if (symptoms.includes('Palpitations or Irregular Heartbeat')) {
      possibleConditions.push({
        name: "Possible Arrhythmia",
        confidence: "moderate",
        description: "Abnormal heart rhythm that may be felt as palpitations or irregular heartbeat",
        urgent: symptoms.includes('Chest Pain or Discomfort') || symptoms.includes('Fainting Episodes')
      });
    }

    // Check for heart failure symptoms
    if ((symptoms.includes('Shortness of Breath') && 
        (symptoms.includes('Fatigue or Weakness') || symptoms.includes('Unusual Fatigue'))) &&
        (symptoms.includes('Swelling') || symptoms.includes('Swelling in Legs, Ankles or Feet'))) {
      possibleConditions.push({
        name: "Possible Heart Failure",
        confidence: "high",
        description: "A condition where the heart doesn't pump blood as well as it should",
        urgent: symptoms.includes('Chest Pain or Discomfort') || symptoms.includes('Chest Pain')
      });
    }

    // Age-based heart disease risk
    if (age === '65+ years' && 
        (symptoms.includes('Shortness of Breath') || 
         symptoms.includes('Fatigue or Weakness') ||
         symptoms.includes('Unusual Fatigue'))) {
      possibleConditions.push({
        name: "Cardiovascular Disease Risk",
        confidence: "moderate",
        description: "Older adults with these symptoms may have increased risk of cardiovascular disease",
        urgent: symptoms.includes('Chest Pain or Discomfort') || symptoms.includes('Chest Pain')
      });
    }

    // If no specific conditions detected but symptoms exist
    if (possibleConditions.length === 0 && symptoms.length > 0) {
      possibleConditions.push({
        name: "Undetermined Condition",
        confidence: "low",
        description: "Your symptoms don't clearly indicate a specific condition based on current information"
      });
    }

    return possibleConditions;
  };

  // Assess urgency level based on symptoms
  const assessUrgency = (patientInfo) => {
    const { symptoms } = patientInfo;

    // Emergency symptoms - require immediate medical attention
    const emergencySymptoms = [
      'Chest Pain',
      'Chest Pain or Discomfort',
      'Confusion or Disorientation',
      'Shortness of Breath',
      'Severe Abdominal Pain',
      'Fainting Episodes'
    ];

    // Urgent symptoms - should see doctor soon
    const urgentSymptoms = [
      'Fever',
      'Persistent Vomiting',
      'Severe Pain',
      'Rash with Fever',
      'Palpitations or Irregular Heartbeat',
      'Swelling in Legs, Ankles or Feet'
    ];

    // Check for emergency symptoms
    for (const symptom of emergencySymptoms) {
      if (symptoms.includes(symptom)) {
        return "emergency";
      }
    }

    // Check for urgent symptoms
    for (const symptom of urgentSymptoms) {
      if (symptoms.includes(symptom)) {
        return "urgent";
      }
    }

    // Default to non-urgent
    return "non-urgent";
  };

  // Provide more information about detected conditions
  const provideMoreInformation = (patientInfo) => {
    const conditions = detectConditionsRealTime(patientInfo);

    if (conditions.length === 0) {
      return "I haven't detected any specific conditions based on the information provided so far. Please add more symptoms to help me provide more accurate information.";
    }

    let information = "Here is more information about the detected conditions:\n\n";

    conditions.forEach((condition, index) => {
      information += `${index + 1}. ${condition.name} (${condition.confidence} confidence)\n`;
      information += `   ${condition.description}\n\n`;

      // Additional information based on condition
      switch (condition.name) {
        case "Migraine":
          information += `   Migraines affect about 12% of the population and typically cause moderate to severe throbbing pain. They may include visual disturbances, nausea, and sensitivity to light and sound. Triggers can include stress, certain foods, hormonal changes, and environmental factors.\n\n`;
          break;
        case "Tension Headache":
          information += `   Tension headaches are the most common type of headache, affecting up to 80% of adults occasionally. They typically cause mild to moderate pain that feels like a tight band around the head. Common triggers include stress, poor posture, eye strain, and dehydration.\n\n`;
          break;
        case "Allergies":
          information += `   Allergies occur when your immune system reacts to a foreign substance that doesn't cause a reaction in most people. Common allergens include pollen, pet dander, certain foods, and medications. Symptoms range from mild (sneezing, itching) to severe (anaphylaxis).\n\n`;
          break;
        case "Asthma or COPD":
          information += `   Asthma is a chronic condition where airways narrow and produce extra mucus, making breathing difficult. COPD (Chronic Obstructive Pulmonary Disease) is a progressive lung disease that causes breathing difficulty. Both conditions can be managed with proper treatment but cannot be cured.\n\n`;
          break;
        case "Gastroenteritis":
          information += `   Gastroenteritis, often called stomach flu, is usually caused by viruses and results in diarrhea, vomiting, abdominal cramps, and sometimes fever. Most cases resolve within a few days and require mainly supportive care like hydration and rest.\n\n`;
          break;
        case "Acid Reflux / GERD":
          information += `   Acid reflux occurs when stomach acid flows back into the esophagus, causing irritation and inflammation. When this happens frequently, it's called Gastroesophageal Reflux Disease (GERD). Common triggers include spicy or fatty foods, alcohol, caffeine, and eating large meals, especially before lying down.\n\n`;
          break;
        case "Arthritis":
          information += `   Arthritis is inflammation of one or more joints causing pain and stiffness. Osteoarthritis results from wear and tear on joints, while rheumatoid arthritis is an autoimmune condition. It affects people of all ages but is more common in older adults.\n\n`;
          break;
        case "Possible Heart Disease":
          information += `   Heart disease refers to several conditions affecting the heart, including coronary artery disease, arrhythmias, heart valve disease, and heart failure. Chest pain (angina) is a common symptom that occurs when the heart muscle doesn't get enough oxygen-rich blood. Risk factors include high blood pressure, high cholesterol, smoking, diabetes, obesity, and family history.\n\n`;
          information += `   Coronary artery disease, the most common type of heart disease, occurs when the arteries that supply blood to the heart become narrowed or blocked due to plaque buildup. This can lead to chest pain, shortness of breath, or heart attack if a coronary artery becomes completely blocked.\n\n`;
          break;
        case "Possible Heart Failure":
          information += `   Heart failure occurs when the heart cannot pump efficiently enough to meet the body's needs. It doesn't mean the heart has stopped working, but that it's not working as efficiently as it should. Common causes include coronary artery disease, high blood pressure, and previous heart attacks.\n\n`;
          information += `   Symptoms often include shortness of breath (especially when lying down), fatigue, and swelling in the legs, ankles, and feet due to fluid buildup. The condition can be managed with medications, lifestyle changes, and in some cases, devices or surgery.\n\n`;
          break;
        case "Possible Arrhythmia":
          information += `   Arrhythmias are abnormal heart rhythms that can cause the heart to beat too fast, too slow, or irregularly. Many arrhythmias are harmless, but some can be serious or life-threatening. Types include atrial fibrillation, atrial flutter, supraventricular tachycardia, ventricular tachycardia, and bradycardia.\n\n`;
          information += `   Symptoms may include palpitations (feeling of skipped beats or fluttering), dizziness, shortness of breath, chest discomfort, and in some cases fainting. Some arrhythmias increase the risk of stroke or heart failure if left untreated.\n\n`;
          break;
        case "Cardiovascular Disease Risk":
          information += `   Cardiovascular disease encompasses a range of conditions affecting the heart and blood vessels. Risk increases with age and is influenced by factors such as high blood pressure, high cholesterol, smoking, diabetes, obesity, physical inactivity, and family history.\n\n`;
          information += `   Regular screenings are important, especially for older adults. This includes blood pressure checks, cholesterol testing, and discussions with healthcare providers about appropriate screenings based on individual risk factors. Early detection and management of risk factors can significantly reduce the likelihood of developing serious cardiovascular disease.\n\n`;
          break;
        default:
        // No additional information for other conditions
      }
    });

    information += "Note: This information is educational and not a substitute for professional medical diagnosis. Many conditions share similar symptoms, and proper diagnosis requires evaluation by a healthcare provider.";

    return information;
  };

  // Provide treatment options for detected conditions
  const provideTreatmentOptions = (patientInfo) => {
    const conditions = detectConditionsRealTime(patientInfo);

    if (conditions.length === 0) {
      return "I haven't detected any specific conditions yet. Please add more symptoms so I can suggest appropriate treatment options.";
    }

    let treatment = "Here are potential treatment approaches for the detected conditions:\n\n";
    treatment += "IMPORTANT: These are general treatment options and not specific recommendations for your situation. Always consult with a healthcare provider before starting any treatment.\n\n";

    conditions.forEach((condition, index) => {
      treatment += `${index + 1}. For ${condition.name}:\n`;

      // Treatment options based on condition
      switch (condition.name) {
        case "Migraine":
          treatment += `   - Over-the-counter pain relievers like ibuprofen or acetaminophen for mild migraines\n`;
          treatment += `   - Prescription medications like triptans for moderate to severe migraines\n`;
          treatment += `   - Rest in a quiet, dark room\n`;
          treatment += `   - Cold compresses on the forehead\n`;
          treatment += `   - Identifying and avoiding triggers\n`;
          break;
        case "Tension Headache":
          treatment += `   - Over-the-counter pain relievers\n`;
          treatment += `   - Stress management techniques\n`;
          treatment += `   - Improving posture\n`;
          treatment += `   - Regular exercise\n`;
          treatment += `   - Adequate hydration\n`;
          break;
        case "Allergies":
          treatment += `   - Antihistamines (Zyrtec, Claritin, Allegra)\n`;
          treatment += `   - Nasal corticosteroids (Flonase, Nasacort)\n`;
          treatment += `   - Avoiding known allergens\n`;
          treatment += `   - Nasal irrigation with saline\n`;
          treatment += `   - For severe allergies, immunotherapy may be recommended\n`;
          break;
        case "Asthma or COPD":
          treatment += `   - Inhalers (bronchodilators and/or corticosteroids)\n`;
          treatment += `   - Avoiding triggers\n`;
          treatment += `   - Pulmonary rehabilitation\n`;
          treatment += `   - Oxygen therapy in severe cases\n`;
          treatment += `   - Regular follow-up with healthcare provider\n`;
          break;
        case "Gastroenteritis":
          treatment += `   - Stay hydrated with clear fluids\n`;
          treatment += `   - Gradual reintroduction of bland foods (BRAT diet)\n`;
          treatment += `   - Rest\n`;
          treatment += `   - Over-the-counter anti-diarrheal medications (use with caution)\n`;
          treatment += `   - Probiotics may help restore gut balance\n`;
          break;
        case "Acid Reflux / GERD":
          treatment += `   - Antacids for occasional heartburn\n`;
          treatment += `   - H2 blockers (like famotidine/Pepcid) for more frequent symptoms\n`;
          treatment += `   - Proton pump inhibitors (like omeprazole) for severe cases\n`;
          treatment += `   - Dietary changes: avoid trigger foods, eat smaller meals\n`;
          treatment += `   - Lifestyle changes: don't lie down after eating, elevate head of bed\n`;
          break;
        case "Arthritis":
          treatment += `   - Over-the-counter pain relievers and anti-inflammatories\n`;
          treatment += `   - Physical therapy\n`;
          treatment += `   - Hot/cold therapy\n`;
          treatment += `   - Maintaining a healthy weight\n`;
          treatment += `   - Prescription medications for moderate to severe cases\n`;
          break;
        case "Possible Heart Disease":
          treatment += `   - Medications: Aspirin to prevent blood clots, statins to lower cholesterol, beta-blockers to reduce heart rate and blood pressure, nitroglycerin for chest pain\n`;
          treatment += `   - Lifestyle changes: Heart-healthy diet low in saturated fat and sodium, regular physical activity (as recommended by a doctor), quitting smoking, limiting alcohol\n`;
          treatment += `   - Regular monitoring of blood pressure, cholesterol, and blood sugar\n`;
          treatment += `   - For severe cases: Angioplasty with stent placement, coronary artery bypass surgery, or other procedures may be needed\n`;
          treatment += `   - Cardiac rehabilitation programs for those recovering from heart problems or procedures\n`;
          break;
        case "Possible Heart Failure":
          treatment += `   - Medications: ACE inhibitors or ARBs to lower blood pressure, beta-blockers to slow heart rate, diuretics to reduce fluid buildup, aldosterone antagonists\n`;
          treatment += `   - Dietary changes: Reduced sodium intake (usually less than 2,000 mg daily), fluid restrictions if needed, balanced nutrition\n`;
          treatment += `   - Regular physical activity as advised by a healthcare provider (typically structured exercise programs)\n`;
          treatment += `   - Daily weight monitoring to detect fluid retention early\n`;
          treatment += `   - For advanced cases: Implantable devices like pacemakers or defibrillators, ventricular assist devices, or heart transplant may be considered\n`;
          treatment += `   - Regular follow-up with cardiologists and heart failure specialists\n`;
          break;
        case "Possible Arrhythmia":
          treatment += `   - Medications: Antiarrhythmic drugs to control heart rhythm, anticoagulants (blood thinners) to prevent clots in some types of arrhythmia\n`;
          treatment += `   - Lifestyle changes: Reducing caffeine and alcohol, managing stress, getting adequate sleep, avoiding stimulants\n`;
          treatment += `   - Cardioversion: A procedure to restore normal heart rhythm using electrical shock or medications\n`;
          treatment += `   - Catheter ablation: A procedure to destroy small areas of heart tissue causing abnormal rhythms\n`;
          treatment += `   - Implantable devices: Pacemakers for slow rhythms, implantable cardioverter-defibrillators (ICDs) for dangerous fast rhythms\n`;
          treatment += `   - Regular monitoring with a cardiologist or electrophysiologist (heart rhythm specialist)\n`;
          break;
        case "Cardiovascular Disease Risk":
          treatment += `   - Regular health check-ups and screenings for blood pressure, cholesterol, and diabetes\n`;
          treatment += `   - Heart-healthy diet: Mediterranean or DASH diet (rich in fruits, vegetables, whole grains, lean proteins, and healthy fats)\n`;
          treatment += `   - Regular physical activity: At least 150 minutes of moderate exercise weekly, as appropriate for your fitness level\n`;
          treatment += `   - Maintaining a healthy weight through balanced diet and regular activity\n`;
          treatment += `   - Medications to manage risk factors if prescribed (statins, blood pressure medications, etc.)\n`;
          treatment += `   - Stress management techniques such as meditation, deep breathing, or yoga\n`;
          treatment += `   - Adequate sleep (7-8 hours for most adults) and good sleep hygiene\n`;
          break;
        default:
          treatment += `   - General self-care measures include rest, hydration, and over-the-counter medications as appropriate\n`;
          treatment += `   - Consult with a healthcare provider for specific treatment recommendations\n`;
      }

      treatment += "\n";
    });

    treatment += "Remember: This information is general in nature. The appropriate treatment for your specific condition should be determined by a qualified healthcare provider.";

    return treatment;
  };

  // Provide guidance on when to see a doctor
  const provideWhenToSeeDoctor = (patientInfo, urgency) => {
    const conditions = detectConditionsRealTime(patientInfo);

    let advice = "Here's guidance on when to seek medical attention:\n\n";

    // Urgency-based advice
    if (urgency === "emergency") {
      advice += "SEEK IMMEDIATE MEDICAL ATTENTION (go to an emergency room or call emergency services).\n\n";
      advice += "Your symptoms suggest a potentially serious condition that requires emergency evaluation. Do not delay seeking care.\n\n";
    } else if (urgency === "urgent") {
      advice += "CONSULT A HEALTHCARE PROVIDER WITHIN 24-48 HOURS.\n\n";
      advice += "While not an immediate emergency, your symptoms suggest a condition that should be evaluated promptly by a healthcare professional.\n\n";
    } else {
      advice += "Based on the information provided, your condition appears to be non-urgent. However, you should still consider medical evaluation if:\n\n";
      advice += "- Your symptoms persist longer than expected\n";
      advice += "- Your symptoms worsen significantly\n";
      advice += "- You develop new, concerning symptoms\n";
      advice += "- Your symptoms interfere with daily activities\n\n";
    }

    // Condition-specific warning signs
    advice += "For your specific symptoms, here are warning signs that indicate you should seek immediate medical attention:\n\n";

    // Check detected conditions for specific advice
    let conditionSpecificAdvice = false;

    for (const condition of conditions) {
      switch (condition.name) {
        case "Migraine":
          advice += "For migraines, seek immediate care if you experience:\n";
          advice += "- The worst headache of your life (sudden onset)\n";
          advice += "- Headache with fever and stiff neck\n";
          advice += "- Headache after a head injury\n";
          advice += "- Headache with confusion, trouble speaking, or vision changes\n\n";
          conditionSpecificAdvice = true;
          break;
        case "Asthma or COPD":
          advice += "For respiratory conditions, seek immediate care if you experience:\n";
          advice += "- Severe shortness of breath or difficulty breathing\n";
          advice += "- Inability to speak in full sentences due to breathlessness\n";
          advice += "- Blue-tinged lips or nails\n";
          advice += "- Rapid worsening of symptoms despite using inhalers\n\n";
          conditionSpecificAdvice = true;
          break;
        case "Gastroenteritis":
          advice += "For digestive conditions, seek immediate care if you experience:\n";
          advice += "- Severe, persistent abdominal pain\n";
          advice += "- Bloody or black, tarry stools\n";
          advice += "- Persistent vomiting or vomiting blood\n";
          advice += "- Signs of dehydration (excessive thirst, dry mouth, little or no urination)\n\n";
          conditionSpecificAdvice = true;
          break;
        case "Acid Reflux / GERD":
          advice += "For acid reflux/GERD, seek medical attention if you experience:\n";
          advice += "- Chest pain that could be confused with a heart attack\n";
          advice += "- Difficulty swallowing or painful swallowing\n";
          advice += "- Vomiting blood or material that looks like coffee grounds\n";
          advice += "- Unexplained weight loss\n";
          advice += "- Symptoms that persist despite over-the-counter medications\n\n";
          conditionSpecificAdvice = true;
          break;
        case "Possible Heart Disease":
        case "Possible Heart Failure":
        case "Possible Arrhythmia":
        case "Cardiovascular Disease Risk":
          advice += "For heart-related conditions, seek IMMEDIATE emergency care if you experience:\n";
          advice += "- Chest pain or discomfort that lasts more than a few minutes or that goes away and comes back\n";
          advice += "- Shortness of breath with or without chest discomfort\n";
          advice += "- Pain or discomfort in one or both arms, the back, neck, jaw, or stomach\n";
          advice += "- Cold sweat, nausea, or lightheadedness\n";
          advice += "- Sudden severe weakness or fainting\n\n";
          advice += "These could be signs of a heart attack and require IMMEDIATE emergency medical attention - call emergency services (911/999/112).\n\n";
          advice += "For less urgent but concerning heart symptoms, consult a doctor within 24-48 hours if you experience:\n";
          advice += "- New or worsening palpitations\n";
          advice += "- Increasing shortness of breath, especially with minimal activity\n";
          advice += "- Worsening swelling in your legs, ankles or feet\n";
          advice += "- Unexplained fatigue or weakness\n";
          advice += "- Dizziness that is persistent or recurrent\n\n";
          conditionSpecificAdvice = true;
          break;
      }
    }

    // If no condition-specific advice, provide general advice
    if (!conditionSpecificAdvice) {
      advice += "- Severe, persistent pain\n";
      advice += "- Difficulty breathing\n";
      advice += "- High fever (above 103°F or 39.4°C) especially with rash\n";
      advice += "- Confusion or altered mental status\n";
      advice += "- Symptoms that are rapidly worsening\n";
    }

    advice += "\nRemember: When in doubt, it's better to err on the side of caution and seek medical evaluation. This guidance is not a substitute for professional medical advice.";

    return advice;
  };

  // ChatMessage component for displaying messages
  const ChatMessage = ({ message }) => {
    const { text, sender } = message;

    return (
      <div className={`chat-message ${sender}`}>
        <div className="message-content">
          {text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Start a new consultation
  const handleNewChat = () => {
    setPatientInfo({
      age: null,
      gender: null,
      symptoms: [],
      symptomCategory: null,
      stage: 'age'
    });

    setMessages([{
      text: "Let's start a new consultation. What is your age group?",
      sender: 'bot'
    }]);

    setOptions([
      { id: 'child', text: 'Under 12 years' },
      { id: 'teen', text: '12-17 years' },
      { id: 'adult', text: '18-64 years' },
      { id: 'senior', text: '65+ years' }
    ]);

    setDetectedConditions([]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Real-Time Health Condition Detection</h2>
        <p>Select options to get immediate assessment of possible health conditions</p>
        {messages.length > 2 && (
          <button onClick={handleNewChat} className="new-chat-button">
            New Consultation
          </button>
        )}
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {loading && <div className="typing-indicator">Assistant is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Real-time condition display */}
      {detectedConditions.length > 0 && (
        <div className="conditions-panel">
          <h3>Detected Conditions:</h3>
          <div className="conditions-list">
            {detectedConditions.map((condition, index) => (
              <div key={index} className={`condition-item ${condition.confidence} ${condition.urgent ? 'urgent' : ''}`}>
                <div className="condition-name">{condition.name}</div>
                <div className="condition-confidence">Confidence: {condition.confidence}</div>
              </div>
            ))}
          </div>
          <div className="disclaimer">
            This is not a medical diagnosis. Consult a healthcare professional.
          </div>
        </div>
      )}

      <div className="options-container">
        {options.map((option) => (
          <button
            key={option.id}
            className="option-button"
            onClick={() => handleOptionSelect(option)}
            disabled={loading}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;