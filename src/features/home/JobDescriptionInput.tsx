interface JDInputProps {
    value: string;
    onTextChange: (text: string) => void
  }
  
export default function JobDescriptionInput(props: JDInputProps) {

    return (
        <div className='card'>
        <h2>Job Description</h2>
        <textarea value={ props.value } onChange={ (e) => props.onTextChange(e.target.value)} placeholder="Paste the job description here..." rows={16} style={{ width: '90%', padding: '8px' }}></textarea>
        </div>
    )
}