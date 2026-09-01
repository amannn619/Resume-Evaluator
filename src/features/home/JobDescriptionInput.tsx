interface JDInputProps {
    value: string;
    error?: string;
    onTextChange: (text: string) => void
}

export default function JobDescriptionInput({ value, error, onTextChange }: JDInputProps) {

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '8px', fontWeight: 'bold' }}>Job Description</label>
            <textarea
                placeholder="Paste at least 50 characters..."
                rows={6}
                value={value}
                onChange={(e) => onTextChange(e.target.value)}
                style={{ borderColor: error ? 'red' : '#ccc', padding: '8px' }}
            />
            {error && <span style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{error}</span>}
        </div>
    )
}