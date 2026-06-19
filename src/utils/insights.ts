import type { StudentResultSummary } from './calculations';

export interface AIInsight {
  strengths: string;
  improvements: string;
  advice: string;
}

export function generateAIInsights(summary: StudentResultSummary, language: 'en' | 'te'): AIInsight {
  const { subjectResults, overallPercentage } = summary;
  
  if (subjectResults.length === 0) {
    return {
      strengths: language === 'en' ? 'No assessment data available.' : 'సమాచారం అందుబాటులో లేదు.',
      improvements: language === 'en' ? 'No assessment data available.' : 'సమాచారం అందుబాటులో లేదు.',
      advice: language === 'en' ? 'Please complete exams to generate insights.' : 'దయచేసి విశ్లేషణల కోసం పరీక్షలను పూర్తి చేయండి.'
    };
  }

  // Find strongest and weakest subjects
  const sortedSubjects = [...subjectResults].sort((a, b) => b.percentage - a.percentage);
  const strongest = sortedSubjects[0];
  const weakest = sortedSubjects[sortedSubjects.length - 1];

  // Group subjects by quality
  const strongSubjects = subjectResults.filter(s => s.percentage >= 75);
  const weakSubjects = subjectResults.filter(s => s.percentage < 50);

  let strengthsText = '';
  let improvementsText = '';
  let adviceText = '';

  if (language === 'en') {
    // English Strengths
    if (strongSubjects.length > 0) {
      const names = strongSubjects.map(s => s.subjectName).join(' and ');
      strengthsText = `Excellent performance in ${names}. Demonstrates a strong understanding of these core concepts.`;
    } else {
      strengthsText = `Showing steady effort. Strongest subject is ${strongest.subjectName} with a score of ${strongest.percentage}%.`;
    }

    // English Improvements
    if (weakSubjects.length > 0) {
      const names = weakSubjects.map(s => s.subjectName).join(' and ');
      improvementsText = `Needs focused attention and additional tutoring in ${names} to clear fundamental doubts.`;
    } else if (weakest.percentage < 65) {
      improvementsText = `Can put more effort in ${weakest.subjectName} to raise the overall performance.`;
    } else {
      improvementsText = `Maintaining good progress across all subjects. Minor review of ${weakest.subjectName} would be beneficial.`;
    }

    // English Advice
    if (overallPercentage >= 85) {
      adviceText = 'Keep up the brilliant work! Encourage the student to participate in quizzes, science fairs, and peer teaching.';
    } else if (overallPercentage >= 65) {
      adviceText = 'Regular homework reviews and systematic study hours before exams will help maintain and boost grades.';
    } else if (overallPercentage >= 50) {
      adviceText = 'Focusing on daily classroom revisions and solved examples will boost confidence in weaker subjects.';
    } else {
      adviceText = 'Close monitoring, daily revision, and coordination with teachers is highly recommended to improve grades.';
    }

  } else {
    // Telugu translation helper for subject names
    const getTeluguSubjectName = (name: string): string => {
      const lower = name.toLowerCase();
      if (lower.includes('telugu')) return 'తెలుగు';
      if (lower.includes('english')) return 'ఇంగ్లీష్';
      if (lower.includes('math')) return 'గణితం';
      if (lower.includes('science')) return 'సైన్స్';
      if (lower.includes('social')) return 'సాంఘిక శాస్త్రం';
      return name;
    };

    // Telugu Strengths
    if (strongSubjects.length > 0) {
      const names = strongSubjects.map(s => getTeluguSubjectName(s.subjectName)).join(' మరియు ');
      strengthsText = `${names} సబ్జెక్టులలో అత్యుత్తమ ప్రతిభ కనబరిచారు. ఈ విషయాలపై మంచి పట్టు సాధించారు.`;
    } else {
      strengthsText = `మెరుగైన ప్రయత్నం చేస్తున్నారు. ${getTeluguSubjectName(strongest.subjectName)} లో అత్యధికంగా ${strongest.percentage}% మార్కులు సాధించారు.`;
    }

    // Telugu Improvements
    if (weakSubjects.length > 0) {
      const names = weakSubjects.map(s => getTeluguSubjectName(s.subjectName)).join(' మరియు ');
      improvementsText = `${names} సబ్జెక్టులపై ప్రత్యేక శ్రద్ధ మరియు అదనపు సాధన అవసరం.`;
    } else if (weakest.percentage < 65) {
      improvementsText = `${getTeluguSubjectName(weakest.subjectName)} లో మరికొంత శ్రద్ధ చూపిస్తే మొత్తం శాతాన్ని పెంచుకోవచ్చు.`;
    } else {
      improvementsText = `అన్ని సబ్జెక్టులలోనూ స్థిరమైన పురోగతి ఉంది. ${getTeluguSubjectName(weakest.subjectName)} ను కొద్దిగా పునశ్చరణ చేస్తే మరింత బాగుంటుంది.`;
    }

    // Telugu Advice
    if (overallPercentage >= 85) {
      adviceText = 'ఇలాగే మున్ముందుకు సాగండి! విద్యార్థిని క్విజ్ పోటీలలో మరియు ఇతర పాఠ్యాంశ కార్యకలాపాలలో పాల్గొనేలా ప్రోత్సహించండి.';
    } else if (overallPercentage >= 65) {
      adviceText = 'క్రమశిక్షణతో కూడిన రోజువారీ సాధన మరియు పరీక్షల ముందస్తు పునశ్చరణ గ్రేడ్లను మరింత మెరుగుపరుస్తుంది.';
    } else if (overallPercentage >= 50) {
      adviceText = 'తరగతి గది పాఠాలను ప్రతిరోజూ ఇంటివద్ద చదవడం మరియు సందేహాలను ఉపాధ్యాయులను అడిగి తెలుసుకోవడం మంచిది.';
    } else {
      adviceText = 'మార్కులు మెరుగుపడటానికి నిరంతర పర్యవేక్షణ, ఉపాధ్యాయులతో సంప్రదింపులు మరియు అదనపు తరగతులు అవసరం.';
    }
  }

  return {
    strengths: strengthsText,
    improvements: improvementsText,
    advice: adviceText
  };
}
