import { useEffect, useState } from 'react';
import './App.css'

function App() {

  return (
    <div className='container'>   
      <h1>AI Resume Evaluator</h1>
      <p>Compare your resume against a job description.</p>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <JobDescriptionInput />
        <ResumeUploader />
      </div>

    </div>
  )
}

function JobDescriptionInput() {
  return (
    <div className='card'>
      <h2>Job Description</h2>
      <textarea placeholder="Paste the job description here..." rows={26} style={{ width: '90%', padding: '8px' }}></textarea>
    </div>
  )
}

function ResumeUploader() {
  return (
    <div className="card">
      <h2>Upload Resume</h2>
      <input type="file" accept=".pdf,.doc,.docx" />
      <button style={{ display: 'block', marginTop: '10px' }}>
        Evaluate Resume
      </button>
    </div>
  )
}

export default App
