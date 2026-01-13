export const LANGUAGES = [
  { value: 'as', label: 'Assamese' },
  { value: 'bn', label: 'Bengali' },
  { value: 'brx', label: 'Bodo' },
  { value: 'doi', label: 'Dogri' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'hi', label: 'Hindi' },
  { value: 'kn', label: 'Kannada' },
  { value: 'ks', label: 'Kashmiri' },
  { value: 'kok', label: 'Konkani' },
  { value: 'mai', label: 'Maithili' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'mni', label: 'Manipuri' },
  { value: 'mr', label: 'Marathi' },
  { value: 'ne', label: 'Nepali' },
  { value: 'or', label: 'Odia' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'sa', label: 'Sanskrit' },
  { value: 'sat', label: 'Santali' },
  { value: 'sd', label: 'Sindhi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'ur', label: 'Urdu' },
  { value: 'en', label: 'English' } 
];


export const DEFAULT_LANG = 'en';

export const getLanguageLabel = (value) => {
  const lang = LANGUAGES.find(l => l.value === value);
  return lang ? lang.label : value;
};

// Function to get display name for any language (including dynamic ones from backend)
export const getLanguageDisplayName = (languageCode) => {
  // First check if it's in our predefined list
  const predefinedLang = LANGUAGES.find(l => l.value === languageCode);
  if (predefinedLang) {
    return predefinedLang.label;
  }
  
  // For dynamic languages from backend, capitalize first letter
  if (languageCode && typeof languageCode === 'string') {
    return languageCode.charAt(0).toUpperCase() + languageCode.slice(1);
  }
  
  return languageCode || 'Unknown';
};