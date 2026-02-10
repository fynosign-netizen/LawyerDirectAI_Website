
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User, Briefcase, Mail, Lock, Phone, Eye, EyeOff,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2,
  Shield, Smartphone, ArrowRight, MapPin,
  Award, DollarSign, AlertCircle, Scale, Sparkles,
  Download, Star, Clock, X, FileText, Camera, Mic, MicOff,
  Type, Linkedin, Upload, Trash2, Plus, GraduationCap,
  Building2, BadgeCheck, Globe, Gavel, Link2, IdCard, ImageIcon
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming','District of Columbia'
];

const PRACTICE_AREAS = [
  'Immigration','Family Law','Criminal Defense','Real Estate','Business & Contract',
  'Employment','Personal Injury','Bankruptcy','Intellectual Property','Tax Law',
  'Estate Planning','Small Claims','Landlord/Tenant','Consumer Protection'
];

const LANGUAGE_OPTIONS = [
  'English','Spanish','French','Mandarin','Arabic','Portuguese','Hindi',
  'Korean','Vietnamese','Tagalog','Russian','German','Japanese','Italian','Polish'
];

const COURT_LEVEL_OPTIONS = [
  'State','Federal','Appellate','Supreme Court','District','Bankruptcy Court','Tax Court','Military'
];

type Role = 'CLIENT' | 'LAWYER';
type FormStep = 'personal' | 'emailVerify' | 'phoneVerify' | 'professional' | 'success';

interface EducationEntry { institution: string; degree: string; year: string; }
interface FirmEntry { name: string; role: string; years: string; }
interface CertEntry { name: string; issuer: string; year: string; }

interface ProfileData {
  title: string;
  professionalSummary: string;
  education: EducationEntry[];
  previousFirms: FirmEntry[];
  certifications: CertEntry[];
  languages: string[];
  courtLevels: string[];
  linkedInUrl: string;
}

const inputClass = "w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800";
const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-widest";
const smallInputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800 text-sm";

const OTP_LENGTH = 6;

const Register: React.FC = () => {
  const [role, setRole] = useState<Role>('CLIENT');
  const [step, setStep] = useState<FormStep>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Personal fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Email verification
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailCode, setEmailCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [emailResendCooldown, setEmailResendCooldown] = useState(0);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Phone verification
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneCode, setPhoneCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [phoneResendCooldown, setPhoneResendCooldown] = useState(0);
  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Lawyer required fields
  const [barNumber, setBarNumber] = useState('');
  const [licenseState, setLicenseState] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [consultationRate, setConsultationRate] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [bio, setBio] = useState('');

  // AI Profile Data
  const [profileData, setProfileData] = useState<ProfileData>({
    title: '', professionalSummary: '', education: [], previousFirms: [],
    certifications: [], languages: [], courtLevels: [], linkedInUrl: '',
  });
  const [aiProcessing, setAiProcessing] = useState(false);
  const [hasAIData, setHasAIData] = useState(false);

  // AI input modes
  const [aiActiveMode, setAiActiveMode] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [linkedinInput, setLinkedinInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Document uploads
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<string | null>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const barDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [detectedStateName, setDetectedStateName] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  // ─── Cooldown Timers ───
  useEffect(() => {
    if (emailResendCooldown <= 0) return;
    const id = setInterval(() => setEmailResendCooldown(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [emailResendCooldown]);

  useEffect(() => {
    if (phoneResendCooldown <= 0) return;
    const id = setInterval(() => setPhoneResendCooldown(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [phoneResendCooldown]);

  // ─── Bar Number → State Auto-Detection ───
  useEffect(() => {
    if (barDebounceRef.current) clearTimeout(barDebounceRef.current);
    if (!barNumber.trim() || barNumber.trim().length < 2) {
      setDetectedStateName(null);
      return;
    }
    barDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/ai-profile/bar-lookup`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barNumber: barNumber.trim() }),
        });
        const data = await res.json();
        if (data.success && data.data?.stateName) {
          setLicenseState(data.data.stateName);
          setDetectedStateName(data.data.stateName);
        } else {
          setDetectedStateName(null);
        }
      } catch {
        setDetectedStateName(null);
      }
    }, 500);
    return () => { if (barDebounceRef.current) clearTimeout(barDebounceRef.current); };
  }, [barNumber]);

  // ─── OTP Helpers ───

  const handleOtpChange = (
    index: number,
    value: string,
    code: string[],
    setCode: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    onComplete: (fullCode: string) => void
  ) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
    const full = newCode.join('');
    if (full.length === OTP_LENGTH && newCode.every(d => d !== '')) {
      onComplete(full);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    code: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    setCode: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    onComplete: (fullCode: string) => void
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newCode = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => { newCode[i] = d; });
    setCode(newCode);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    refs.current[focusIdx]?.focus();
    if (pasted.length === OTP_LENGTH) onComplete(pasted);
  };

  // ─── Email Verification Handlers ───

  const handleSendEmailOtp = async () => {
    setEmailSending(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/otp/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'email', destination: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send verification code');
      setEmailResendCooldown(60);
      setStep('emailVerify');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmail = async (code: string) => {
    setEmailVerifying(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/otp/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'email', destination: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid verification code');
      // Email verified — move to phone step
      setPhoneSent(false);
      setPhoneCode(Array(OTP_LENGTH).fill(''));
      setStep('phoneVerify');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
      setEmailCode(Array(OTP_LENGTH).fill(''));
      emailOtpRefs.current[0]?.focus();
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (emailResendCooldown > 0) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/otp/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'email', destination: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend code');
      setEmailResendCooldown(60);
      setEmailCode(Array(OTP_LENGTH).fill(''));
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    }
  };

  // ─── Phone Verification Handlers ───

  const handleSendPhoneOtp = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setPhoneSending(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/otp/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'phone', destination: `+1${digits}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send verification code');
      setPhoneSent(true);
      setPhoneResendCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setPhoneSending(false);
    }
  };

  const handleVerifyPhone = async (code: string) => {
    const digits = phone.replace(/\D/g, '');
    setPhoneVerifying(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/otp/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'phone', destination: `+1${digits}`, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid verification code');
      // Phone verified
      if (role === 'LAWYER') {
        setStep('professional');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmit();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
      setPhoneCode(Array(OTP_LENGTH).fill(''));
      phoneOtpRefs.current[0]?.focus();
    } finally {
      setPhoneVerifying(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    if (phoneResendCooldown > 0) return;
    const digits = phone.replace(/\D/g, '');
    setError('');
    try {
      const res = await fetch(`${API_URL}/otp/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'phone', destination: `+1${digits}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend code');
      setPhoneResendCooldown(60);
      setPhoneCode(Array(OTP_LENGTH).fill(''));
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    }
  };

  // ─── AI Input Handlers ───

  const mergeAIData = useCallback((data: any) => {
    if (data.specializations?.length) setSpecializations(prev => [...new Set([...prev, ...data.specializations])]);
    if (data.yearsExperience) setYearsExperience(String(data.yearsExperience));
    if (data.bio) setBio(data.bio);
    if (data.consultationRate) setConsultationRate(String(Math.round(data.consultationRate / 100)));
    setProfileData(prev => ({
      title: data.title || prev.title,
      professionalSummary: data.professionalSummary || prev.professionalSummary,
      education: data.education?.length ? data.education.map((e: any) => ({ institution: e.institution || '', degree: e.degree || '', year: e.year?.toString() || '' })) : prev.education,
      previousFirms: data.previousFirms?.length ? data.previousFirms.map((f: any) => ({ name: f.name || '', role: f.role || '', years: f.years?.toString() || '' })) : prev.previousFirms,
      certifications: data.certifications?.length ? data.certifications.map((c: any) => ({ name: c.name || '', issuer: c.issuer || '', year: c.year?.toString() || '' })) : prev.certifications,
      languages: data.languages?.length ? data.languages : prev.languages,
      courtLevels: data.courtLevels?.length ? data.courtLevels : prev.courtLevels,
      linkedInUrl: data.linkedInUrl || prev.linkedInUrl,
    }));
    setHasAIData(true);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'photo') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    setAiProcessing(true);
    setError('');
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch(`${API_URL}/ai-profile/parse`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: { base64, mimeType: file.type, fileName: file.name } }),
      });
      const data = await res.json();
      if (data.success && data.data) mergeAIData(data.data);
      else throw new Error(data.message || 'Failed to parse file');
    } catch (err: any) {
      setError(err.message || 'Failed to process file. Please try again.');
    } finally {
      setAiProcessing(false);
      e.target.value = '';
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAiProcessing(true);
        setError('');
        try {
          const base64 = await blobToBase64(blob);
          const res = await fetch(`${API_URL}/ai-profile/parse`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: { base64, mimeType: 'audio/webm' } }),
          });
          const data = await res.json();
          if (data.success && data.data) mergeAIData(data.data);
          else throw new Error(data.message || 'Failed to process audio');
        } catch (err: any) {
          setError(err.message || 'Failed to process audio. Please try again.');
        } finally {
          setAiProcessing(false);
        }
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch {
      setError('Microphone access is required for voice recording.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setAiProcessing(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/ai-profile/parse`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput.trim() }),
      });
      const data = await res.json();
      if (data.success && data.data) { mergeAIData(data.data); setTextInput(''); setAiActiveMode(null); }
      else throw new Error(data.message || 'Failed to process text');
    } catch (err: any) {
      setError(err.message || 'Failed to process text. Please try again.');
    } finally {
      setAiProcessing(false);
    }
  };

  const handleLinkedinSubmit = async () => {
    if (!linkedinInput.trim()) return;
    setAiProcessing(true);
    setError('');
    try {
      const isUrl = linkedinInput.trim().includes('linkedin.com');
      const res = await fetch(`${API_URL}/ai-profile/parse`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedinUrl: isUrl ? linkedinInput.trim() : undefined,
          text: isUrl ? undefined : linkedinInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) { mergeAIData(data.data); setLinkedinInput(''); setAiActiveMode(null); }
      else throw new Error(data.message || 'Failed to process LinkedIn info');
    } catch (err: any) {
      setError(err.message || 'Failed to process LinkedIn info. Please try again.');
    } finally {
      setAiProcessing(false);
    }
  };

  // ─── Document Upload Handlers ───

  const handleDocumentImage = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ─── Helpers ───

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const blobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  // ─── Profile Data Updaters ───

  const updateProfileField = (field: keyof ProfileData, value: any) => setProfileData(prev => ({ ...prev, [field]: value }));
  const toggleSpecialization = (area: string) => setSpecializations(prev => prev.includes(area) ? prev.filter(s => s !== area) : [...prev, area]);
  const toggleLanguage = (lang: string) => updateProfileField('languages', profileData.languages.includes(lang) ? profileData.languages.filter(l => l !== lang) : [...profileData.languages, lang]);
  const toggleCourtLevel = (level: string) => updateProfileField('courtLevels', profileData.courtLevels.includes(level) ? profileData.courtLevels.filter(c => c !== level) : [...profileData.courtLevels, level]);

  const addEducation = () => updateProfileField('education', [...profileData.education, { institution: '', degree: '', year: '' }]);
  const removeEducation = (i: number) => updateProfileField('education', profileData.education.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: keyof EducationEntry, value: string) => {
    const arr = [...profileData.education]; arr[i] = { ...arr[i], [field]: value }; updateProfileField('education', arr);
  };

  const addFirm = () => updateProfileField('previousFirms', [...profileData.previousFirms, { name: '', role: '', years: '' }]);
  const removeFirm = (i: number) => updateProfileField('previousFirms', profileData.previousFirms.filter((_, idx) => idx !== i));
  const updateFirm = (i: number, field: keyof FirmEntry, value: string) => {
    const arr = [...profileData.previousFirms]; arr[i] = { ...arr[i], [field]: value }; updateProfileField('previousFirms', arr);
  };

  const addCert = () => updateProfileField('certifications', [...profileData.certifications, { name: '', issuer: '', year: '' }]);
  const removeCert = (i: number) => updateProfileField('certifications', profileData.certifications.filter((_, idx) => idx !== i));
  const updateCert = (i: number, field: keyof CertEntry, value: string) => {
    const arr = [...profileData.certifications]; arr[i] = { ...arr[i], [field]: value }; updateProfileField('certifications', arr);
  };

  // ─── Validation ───

  const validatePersonal = (): boolean => {
    if (!firstName.trim()) { setError('First name is required'); return false; }
    if (!lastName.trim()) { setError('Last name is required'); return false; }
    if (!email.trim()) { setError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return false; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return false; }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) { setError('A valid phone number is required'); return false; }
    return true;
  };

  const validateProfessional = (): boolean => {
    if (!barNumber.trim()) { setError('Bar license number is required'); return false; }
    if (!licenseState) { setError('License state is required'); return false; }
    if (specializations.length === 0) { setError('Select at least one practice area'); return false; }
    return true;
  };

  const handleNext = async () => {
    if (!validatePersonal()) return;
    setError('');
    // Send email OTP and advance
    await handleSendEmailOtp();
  };

  const handleSubmit = async () => {
    if (role === 'LAWYER' && !validateProfessional()) return;
    setIsSubmitting(true);
    setError('');
    const phoneDigits = phone.replace(/\D/g, '');
    try {
      const response = await fetch(`${API_URL}/web-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role, firstName: firstName.trim(), lastName: lastName.trim(),
          email: email.trim().toLowerCase(), password,
          phone: phoneDigits ? `+1${phoneDigits}` : undefined,
          ...(role === 'LAWYER' && {
            title: profileData.title.trim() || undefined,
            barNumber: barNumber.trim(), licenseState, specializations,
            consultationRate: consultationRate ? parseInt(consultationRate) * 100 : undefined,
            yearsExperience: yearsExperience ? parseInt(yearsExperience) : undefined,
            bio: bio.trim() || undefined,
            professionalSummary: profileData.professionalSummary.trim() || undefined,
            education: profileData.education.filter(e => e.institution).map(e => ({ ...e, year: e.year ? parseInt(e.year) : null })),
            previousFirms: profileData.previousFirms.filter(f => f.name),
            certifications: profileData.certifications.filter(c => c.name).map(c => ({ ...c, year: c.year ? parseInt(c.year) : null })),
            languages: profileData.languages.length ? profileData.languages : undefined,
            courtLevels: profileData.courtLevels.length ? profileData.courtLevels : undefined,
            linkedInUrl: profileData.linkedInUrl.trim() || undefined,
            licenseImage: licenseImage || undefined,
            idImage: idImage || undefined,
          }),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed.');
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSwitch = (newRole: Role) => {
    if (step === 'success') return;
    setRole(newRole);
    setStep('personal');
    setError('');
    setEmailCode(Array(OTP_LENGTH).fill(''));
    setPhoneCode(Array(OTP_LENGTH).fill(''));
    setPhoneSent(false);
    setEmailResendCooldown(0);
    setPhoneResendCooldown(0);
  };

  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i, size: Math.random() * 300 + 100, x: Math.random() * 100,
    y: Math.random() * 100, duration: Math.random() * 10 + 15,
  }));

  // ─── AI Input Modes Config ───
  const aiModes = [
    { id: 'cv', icon: <FileText className="w-5 h-5" />, label: 'Upload CV', action: () => fileInputRef.current?.click() },
    { id: 'photo', icon: <Camera className="w-5 h-5" />, label: 'Photo', action: () => photoInputRef.current?.click() },
    { id: 'voice', icon: isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />, label: isRecording ? 'Stop' : 'Speak', action: isRecording ? handleStopRecording : handleStartRecording },
    { id: 'text', icon: <Type className="w-5 h-5" />, label: 'Type', action: () => setAiActiveMode(aiActiveMode === 'text' ? null : 'text') },
    { id: 'linkedin', icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', action: () => setAiActiveMode(aiActiveMode === 'linkedin' ? null : 'linkedin') },
  ];

  // ─── Step Indicator Config ───
  const stepOrder: FormStep[] = role === 'LAWYER'
    ? ['personal', 'emailVerify', 'phoneVerify', 'professional']
    : ['personal', 'emailVerify', 'phoneVerify'];

  const stepLabels: Record<string, string> = {
    personal: 'Personal',
    emailVerify: 'Email',
    phoneVerify: 'Phone',
    professional: 'Professional',
  };

  const currentStepIndex = stepOrder.indexOf(step);

  const getStepState = (idx: number) => {
    if (step === 'success') return 'completed';
    if (idx < currentStepIndex) return 'completed';
    if (idx === currentStepIndex) return 'active';
    return 'upcoming';
  };

  // ─── Hero Text ───
  const heroTitle = (() => {
    if (step === 'success') return <>You're All Set!</>;
    if (step === 'emailVerify') return <>Verify Your <br className="hidden sm:block" /><span className="text-indigo-200">Email</span></>;
    if (step === 'phoneVerify') return <>Verify Your <br className="hidden sm:block" /><span className="text-indigo-200">Phone</span></>;
    return <>Create Your <br className="hidden sm:block" /><span className="text-indigo-200">Account</span></>;
  })();

  const heroSubtitle = (() => {
    if (step === 'success') return 'Your account has been created successfully.';
    if (step === 'emailVerify') return `We sent a 6-digit code to ${email}`;
    if (step === 'phoneVerify') return 'Verify your phone number to secure your account.';
    if (role === 'LAWYER') return 'Join our network of verified attorneys and grow your practice with qualified leads.';
    return 'Get matched with verified lawyers instantly. Your first 3 minutes are free.';
  })();

  // ─── OTP Input Renderer ───
  const renderOtpInput = (
    code: string[],
    setCode: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    onComplete: (fullCode: string) => void,
    disabled: boolean
  ) => (
    <div className="flex justify-center gap-3">
      {code.map((digit, i) => (
        <motion.input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={e => handleOtpChange(i, e.target.value, code, setCode, refs, onComplete)}
          onKeyDown={e => handleOtpKeyDown(i, e, code, refs)}
          onPaste={e => handleOtpPaste(e, setCode, refs, onComplete)}
          whileFocus={{ scale: 1.08 }}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all ${
            digit ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-800'
          } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'photo')} />
      <input ref={licenseInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleDocumentImage(e, setLicenseImage)} />
      <input ref={idInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleDocumentImage(e, setIdImage)} />

      <main className="flex-grow">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 pt-32 pb-40 px-6 overflow-hidden">
          {particles.map(p => (
            <motion.div key={p.id} animate={{ x: [0,30,-20,0], y: [0,-40,20,0], scale: [1,1.1,0.9,1] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
              className="absolute rounded-full bg-white/5 blur-3xl pointer-events-none"
              style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }} />
          ))}
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-8 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-4 h-4 mr-2" />
              {step === 'success' ? 'Welcome Aboard!' : 'Join 10,000+ Users'}
            </motion.div>
            <motion.h1 key={step} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              {heroTitle}
            </motion.h1>
            <motion.p key={`sub-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg text-indigo-100 max-w-xl mx-auto">
              {heroSubtitle}
            </motion.p>
          </div>
        </div>

        {/* Form Section */}
        <div className={`mx-auto px-6 -mt-24 relative z-20 pb-24 ${step === 'professional' ? 'max-w-3xl' : 'max-w-2xl'}`}>
          <AnimatePresence mode="wait">
            {step === 'success' ? (
              /* ═══ SUCCESS ═══ */
              <motion.div key="success" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100">
                <div className="flex justify-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }} className="relative">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
                      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }}>
                        <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                      </motion.div>
                    </div>
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.4, opacity: 0 }} transition={{ delay: 0.5, duration: 1 }} className="absolute inset-0 border-2 border-emerald-300 rounded-full" />
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ delay: 0.7, duration: 1 }} className="absolute inset-0 border-2 border-emerald-200 rounded-full" />
                  </motion.div>
                </div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Account Created!</h2>
                  <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
                    {role === 'LAWYER' ? 'Your lawyer account is ready. Download the Lawyer Direct app to complete your verification and start accepting consultations.'
                      : 'Your account is ready. Download the Lawyer Direct app to find qualified lawyers and get instant legal help.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                      { icon: <Download className="w-5 h-5" />, label: 'Download App', color: 'bg-indigo-50 text-indigo-600' },
                      { icon: <Smartphone className="w-5 h-5" />, label: 'Sign In', color: 'bg-violet-50 text-violet-600' },
                      { icon: role === 'LAWYER' ? <Briefcase className="w-5 h-5" /> : <Scale className="w-5 h-5" />, label: role === 'LAWYER' ? 'Start Consulting' : 'Find a Lawyer', color: 'bg-emerald-50 text-emerald-600' },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-2`}>{item.icon}</div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Step {i + 1}</span>
                        <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="space-y-6">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Download the App</p>
                    <div className="flex items-center justify-center space-x-4">
                      <motion.a href="#" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-14" />
                      </motion.a>
                      <motion.a href="#" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-14" />
                      </motion.a>
                    </div>
                    <div className="pt-6 border-t border-slate-100 mt-6">
                      <Link to="/" className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors inline-flex items-center space-x-1">
                        <span>Back to Home</span><ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              /* ═══ FORM ═══ */
              <motion.div key="form" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100">

                {/* Role Toggle — only on personal step */}
                {step === 'personal' && (
                  <div className="flex justify-center mb-10">
                    <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                      {(['CLIENT', 'LAWYER'] as Role[]).map(r => (
                        <motion.button key={r} onClick={() => handleRoleSwitch(r)}
                          className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${role === r ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                          {role === r && <motion.div layoutId="roleToggle" className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                          {r === 'CLIENT' ? <User className="w-4 h-4 relative z-10" /> : <Briefcase className="w-4 h-4 relative z-10" />}
                          <span className="relative z-10">{r === 'CLIENT' ? 'I Need a Lawyer' : 'I Am a Lawyer'}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step Indicator — shown for all steps except success */}
                {step !== 'personal' && (
                  <div className="flex items-center justify-center mb-10">
                    <div className="flex items-center space-x-2">
                      {stepOrder.map((s, idx) => (
                        <React.Fragment key={s}>
                          {idx > 0 && (
                            <div className="w-6 sm:w-8 h-0.5 bg-slate-200 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: getStepState(idx) === 'upcoming' ? '0%' : '100%' }}
                                className="h-full bg-indigo-600 rounded-full" transition={{ duration: 0.3 }} />
                            </div>
                          )}
                          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            getStepState(idx) === 'active' ? 'bg-indigo-600 text-white'
                            : getStepState(idx) === 'completed' ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                          }`}>
                            {getStepState(idx) === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
                            <span className="hidden sm:inline">{stepLabels[s]}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
                      <div className="flex items-start space-x-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium flex-1">{error}</span>
                        <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step === 'personal' && (
                    /* ─── STEP 1: Personal ─── */
                    <motion.div key="step-personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2"><label className={labelClass}>First Name</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" className={inputClass} /></div></div>
                        <div className="space-y-2"><label className={labelClass}>Last Name</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" className={inputClass} /></div></div>
                      </div>
                      <div className="space-y-2"><label className={labelClass}>Email Address</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className={inputClass} /></div></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2"><label className={labelClass}>Password</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
                        <div className="space-y-2"><label className={labelClass}>Confirm Password</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
                      </div>
                      <div className="space-y-2"><label className={labelClass}>Phone Number</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="tel" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} placeholder="(555) 123-4567" className={inputClass} /></div></div>
                      <div className="pt-4">
                        <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleNext} disabled={emailSending}
                          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed">
                          {emailSending ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Sending Code...</span></>
                            : <><span>Next: Verify Email</span><ChevronRight className="w-5 h-5" /></>}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'emailVerify' && (
                    /* ─── STEP 2: Email Verification ─── */
                    <motion.div key="step-email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                          <Mail className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Check Your Email</h3>
                        <p className="text-sm text-slate-500">We sent a 6-digit verification code to</p>
                        <p className="text-sm font-semibold text-indigo-600 mt-1">{email}</p>
                      </div>

                      {renderOtpInput(emailCode, setEmailCode, emailOtpRefs, handleVerifyEmail, emailVerifying)}

                      {emailVerifying && (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                          <span className="text-sm text-indigo-600 font-medium">Verifying...</span>
                        </div>
                      )}

                      <div className="text-center space-y-3">
                        {emailResendCooldown > 0 ? (
                          <p className="text-sm text-slate-400">Resend code in <span className="font-semibold text-slate-600">{emailResendCooldown}s</span></p>
                        ) : (
                          <button onClick={handleResendEmailOtp} className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                            Didn't receive the code? Resend
                          </button>
                        )}
                        <div>
                          <button onClick={() => { setStep('personal'); setError(''); setEmailCode(Array(OTP_LENGTH).fill('')); }}
                            className="text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center space-x-1">
                            <ChevronLeft className="w-3.5 h-3.5" /><span>Change email address</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 'phoneVerify' && (
                    /* ─── STEP 3: Phone Verification ─── */
                    <motion.div key="step-phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                          <Phone className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Verify Your Phone</h3>
                        <p className="text-sm text-slate-500">We'll send a verification code via SMS</p>
                      </div>

                      {!phoneSent ? (
                        <>
                          {/* Phone input + send button */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className={labelClass}>Phone Number</label>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="tel" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} placeholder="(555) 123-4567" className={inputClass} />
                              </div>
                            </div>
                            <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleSendPhoneOtp} disabled={phoneSending || phone.replace(/\D/g, '').length < 10}
                              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed">
                              {phoneSending ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Sending Code...</span></>
                                : <><span>Send Verification Code</span><ArrowRight className="w-5 h-5" /></>}
                            </motion.button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* OTP input after code sent */}
                          <div className="text-center mb-2">
                            <p className="text-sm text-slate-500">Code sent to <span className="font-semibold text-slate-700">{phone}</span></p>
                          </div>

                          {renderOtpInput(phoneCode, setPhoneCode, phoneOtpRefs, handleVerifyPhone, phoneVerifying)}

                          {phoneVerifying && (
                            <div className="flex items-center justify-center space-x-2">
                              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                              <span className="text-sm text-indigo-600 font-medium">Verifying...</span>
                            </div>
                          )}

                          <div className="text-center space-y-3">
                            {phoneResendCooldown > 0 ? (
                              <p className="text-sm text-slate-400">Resend code in <span className="font-semibold text-slate-600">{phoneResendCooldown}s</span></p>
                            ) : (
                              <button onClick={handleResendPhoneOtp} className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                                Didn't receive the code? Resend
                              </button>
                            )}
                            <div>
                              <button onClick={() => { setPhoneSent(false); setPhoneCode(Array(OTP_LENGTH).fill('')); setError(''); }}
                                className="text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center space-x-1">
                                <ChevronLeft className="w-3.5 h-3.5" /><span>Change phone number</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="text-center">
                        <button onClick={() => { setStep('emailVerify'); setError(''); }}
                          className="text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center space-x-1">
                          <ChevronLeft className="w-3.5 h-3.5" /><span>Back to email verification</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'professional' && (
                    /* ─── STEP 4: Professional (Full AI Profile Builder) ─── */
                    <motion.div key="step-professional" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">

                      {/* ── AI Profile Builder Card ── */}
                      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100">
                        <div className="flex items-center space-x-2 mb-1">
                          <Sparkles className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-base font-bold text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>AI Profile Builder</h3>
                          {hasAIData && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Data Extracted</span>}
                        </div>
                        <p className="text-sm text-slate-500 mb-5">Upload your CV, snap a photo, record audio, type, or paste your LinkedIn to auto-fill your profile.</p>

                        {/* 5 Mode Buttons */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                          {aiModes.map(mode => (
                            <motion.button key={mode.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={mode.action} disabled={aiProcessing}
                              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all text-xs font-medium ${
                                (aiActiveMode === mode.id || (mode.id === 'voice' && isRecording))
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                              } disabled:opacity-50`}>
                              {mode.icon}
                              <span>{mode.label}</span>
                            </motion.button>
                          ))}
                        </div>

                        {/* Recording indicator */}
                        {isRecording && (
                          <div className="flex items-center space-x-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm text-red-600 font-medium">Recording... Click Stop when finished</span>
                          </div>
                        )}

                        {/* Selected file */}
                        {selectedFileName && !aiProcessing && (
                          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-4">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-emerald-700 font-medium flex-1">{selectedFileName}</span>
                            <button onClick={() => setSelectedFileName('')}><X className="w-4 h-4 text-slate-400" /></button>
                          </div>
                        )}

                        {/* Text Input */}
                        {aiActiveMode === 'text' && (
                          <div className="relative mb-4">
                            <textarea rows={4} value={textInput} onChange={e => setTextInput(e.target.value)}
                              placeholder="Tell us about your legal career, education, specializations, years of experience..."
                              className="w-full px-4 py-3 pr-14 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm text-slate-800 resize-none" />
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleTextSubmit}
                              disabled={!textInput.trim() || aiProcessing}
                              className="absolute right-3 bottom-3 w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:bg-slate-300">
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}

                        {/* LinkedIn Input */}
                        {aiActiveMode === 'linkedin' && (
                          <div className="relative mb-4">
                            <textarea rows={3} value={linkedinInput} onChange={e => setLinkedinInput(e.target.value)}
                              placeholder="Paste your LinkedIn URL or About section..."
                              className="w-full px-4 py-3 pr-14 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm text-slate-800 resize-none" />
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLinkedinSubmit}
                              disabled={!linkedinInput.trim() || aiProcessing}
                              className="absolute right-3 bottom-3 w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:bg-slate-300">
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}

                        {/* Processing */}
                        {aiProcessing && (
                          <div className="flex items-center justify-center space-x-3 bg-indigo-50 rounded-xl py-4">
                            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                            <span className="text-sm font-medium text-indigo-700">Analyzing your profile...</span>
                          </div>
                        )}
                      </div>

                      {/* ── Divider: Required ── */}
                      <div className="flex items-center gap-3"><div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Required Fields</span><div className="flex-1 h-px bg-slate-200" /></div>

                      {/* Title */}
                      <div className="space-y-2"><label className={labelClass}>Professional Title</label><div className="relative"><Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" value={profileData.title} onChange={e => updateProfileField('title', e.target.value)} placeholder="e.g., Attorney at Law, Esq., Partner" className={inputClass} /></div></div>

                      {/* Bar Number */}
                      <div className="space-y-2"><label className={labelClass}>Bar License Number</label><div className="relative"><Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" value={barNumber} onChange={e => setBarNumber(e.target.value)} placeholder="e.g., NY-2019-48291" className={inputClass} /></div></div>

                      {/* License State */}
                      <div className="space-y-2"><label className={labelClass}>Licensed State {detectedStateName && <span className="text-indigo-500 normal-case font-normal ml-1">Auto-detected</span>}</label><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" /><select value={licenseState} onChange={e => { setLicenseState(e.target.value); setDetectedStateName(null); }} className={`${inputClass} appearance-none cursor-pointer`}><option value="">Select your state</option>{US_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select><ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" /></div></div>

                      {/* Practice Areas */}
                      <div className="space-y-3">
                        <label className={labelClass}>Practice Areas <span className="text-slate-300 font-normal normal-case">(select all that apply)</span></label>
                        <div className="flex flex-wrap gap-2">
                          {PRACTICE_AREAS.map(area => (
                            <motion.button key={area} type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => toggleSpecialization(area)}
                              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${specializations.includes(area) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'}`}>
                              {area}
                            </motion.button>
                          ))}
                        </div>
                        {specializations.length > 0 && <p className="text-xs text-indigo-600 font-medium">{specializations.length} area{specializations.length !== 1 ? 's' : ''} selected</p>}
                      </div>

                      {/* Rate & Experience */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2"><label className={labelClass}>Consultation Rate <span className="text-slate-300 font-normal normal-case">($/session)</span></label><div className="relative"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="number" value={consultationRate} onChange={e => setConsultationRate(e.target.value)} placeholder="30" min="1" className={inputClass} /></div></div>
                        <div className="space-y-2"><label className={labelClass}>Years of Experience</label><div className="relative"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="number" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} placeholder="e.g., 5" min="0" className={inputClass} /></div></div>
                      </div>

                      {/* ── Divider: Profile Details ── */}
                      <div className="flex items-center gap-3"><div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Details</span><div className="flex-1 h-px bg-slate-200" /></div>

                      {/* Professional Summary */}
                      <div className="space-y-2"><label className={labelClass}>Professional Summary {hasAIData && profileData.professionalSummary && <span className="text-indigo-500 normal-case font-normal ml-1">AI</span>}</label><textarea rows={4} value={profileData.professionalSummary} onChange={e => updateProfileField('professionalSummary', e.target.value)} placeholder="A brief summary of your legal career and expertise..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800 resize-none" /></div>

                      {/* Education */}
                      <div className="space-y-3">
                        <label className={labelClass}><GraduationCap className="w-3.5 h-3.5 inline mr-1" />Education</label>
                        {profileData.education.map((edu, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="Institution" className={smallInputClass} />
                              <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="Degree" className={smallInputClass} />
                              <input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} placeholder="Year" className={smallInputClass} />
                            </div>
                            <button onClick={() => removeEducation(i)} className="mt-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button onClick={addEducation} className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"><Plus className="w-4 h-4" /><span>Add Education</span></button>
                      </div>

                      {/* Previous Firms */}
                      <div className="space-y-3">
                        <label className={labelClass}><Building2 className="w-3.5 h-3.5 inline mr-1" />Previous Firms</label>
                        {profileData.previousFirms.map((firm, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input value={firm.name} onChange={e => updateFirm(i, 'name', e.target.value)} placeholder="Firm Name" className={smallInputClass} />
                              <input value={firm.role} onChange={e => updateFirm(i, 'role', e.target.value)} placeholder="Role" className={smallInputClass} />
                              <input value={firm.years} onChange={e => updateFirm(i, 'years', e.target.value)} placeholder="Years" className={smallInputClass} />
                            </div>
                            <button onClick={() => removeFirm(i)} className="mt-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button onClick={addFirm} className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"><Plus className="w-4 h-4" /><span>Add Firm</span></button>
                      </div>

                      {/* Certifications */}
                      <div className="space-y-3">
                        <label className={labelClass}><BadgeCheck className="w-3.5 h-3.5 inline mr-1" />Certifications</label>
                        {profileData.certifications.map((cert, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input value={cert.name} onChange={e => updateCert(i, 'name', e.target.value)} placeholder="Certification" className={smallInputClass} />
                              <input value={cert.issuer} onChange={e => updateCert(i, 'issuer', e.target.value)} placeholder="Issued By" className={smallInputClass} />
                              <input value={cert.year} onChange={e => updateCert(i, 'year', e.target.value)} placeholder="Year" className={smallInputClass} />
                            </div>
                            <button onClick={() => removeCert(i)} className="mt-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button onClick={addCert} className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"><Plus className="w-4 h-4" /><span>Add Certification</span></button>
                      </div>

                      {/* Languages */}
                      <div className="space-y-3">
                        <label className={labelClass}><Globe className="w-3.5 h-3.5 inline mr-1" />Languages Spoken</label>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGE_OPTIONS.map(lang => (
                            <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${profileData.languages.includes(lang) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300'}`}>
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Court Levels */}
                      <div className="space-y-3">
                        <label className={labelClass}><Gavel className="w-3.5 h-3.5 inline mr-1" />Court Levels</label>
                        <div className="flex flex-wrap gap-2">
                          {COURT_LEVEL_OPTIONS.map(level => (
                            <button key={level} type="button" onClick={() => toggleCourtLevel(level)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${profileData.courtLevels.includes(level) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300'}`}>
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-2"><label className={labelClass}>Bio</label><textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell potential clients about your experience and expertise..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800 resize-none" /></div>

                      {/* LinkedIn URL */}
                      <div className="space-y-2"><label className={labelClass}><Link2 className="w-3.5 h-3.5 inline mr-1" />LinkedIn Profile URL</label><div className="relative"><Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="url" value={profileData.linkedInUrl} onChange={e => updateProfileField('linkedInUrl', e.target.value)} placeholder="https://linkedin.com/in/your-profile" className={inputClass} /></div></div>

                      {/* ── Divider: Documents ── */}
                      <div className="flex items-center gap-3"><div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Uploads <span className="normal-case font-normal">(optional)</span></span><div className="flex-1 h-px bg-slate-200" /></div>

                      {/* Bar License Image */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <IdCard className="w-5 h-5 text-indigo-600" />
                          <span className="text-sm font-bold text-slate-700">Bar License Card</span>
                          {licenseImage && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Uploaded</span>}
                        </div>
                        {licenseImage ? (
                          <div className="relative rounded-xl overflow-hidden">
                            <img src={licenseImage} alt="Bar License" className="w-full h-44 object-cover rounded-xl" />
                            <button onClick={() => setLicenseImage(null)} className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow"><X className="w-4 h-4 text-red-500" /></button>
                          </div>
                        ) : (
                          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => licenseInputRef.current?.click()}
                            className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all flex flex-col items-center space-y-2">
                            <Upload className="w-6 h-6" /><span className="text-sm font-medium">Click to upload image</span>
                          </motion.button>
                        )}
                      </div>

                      {/* Government ID */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <ImageIcon className="w-5 h-5 text-indigo-600" />
                          <span className="text-sm font-bold text-slate-700">Government-Issued ID</span>
                          {idImage && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Uploaded</span>}
                        </div>
                        {idImage ? (
                          <div className="relative rounded-xl overflow-hidden">
                            <img src={idImage} alt="Government ID" className="w-full h-44 object-cover rounded-xl" />
                            <button onClick={() => setIdImage(null)} className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow"><X className="w-4 h-4 text-red-500" /></button>
                          </div>
                        ) : (
                          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => idInputRef.current?.click()}
                            className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all flex flex-col items-center space-y-2">
                            <Upload className="w-6 h-6" /><span className="text-sm font-medium">Click to upload image</span>
                          </motion.button>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => { setStep('phoneVerify'); setError(''); }}
                          className="sm:w-auto px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center space-x-2">
                          <ChevronLeft className="w-5 h-5" /><span>Back</span>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit} disabled={isSubmitting}
                          className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed">
                          {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating Account...</span></> : <><span>Create Lawyer Account</span><ArrowRight className="w-5 h-5" /></>}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Terms */}
                {step !== 'success' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center text-sm text-slate-400 mt-8">
                    By creating an account, you agree to our{' '}
                    <Link to="/legal-disclaimer" className="text-indigo-600 font-medium hover:text-indigo-700">Terms of Service</Link>{' '}and{' '}
                    <Link to="/privacy-policy" className="text-indigo-600 font-medium hover:text-indigo-700">Privacy Policy</Link>
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust indicators */}
          {step !== 'success' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: <Shield className="w-5 h-5 text-indigo-600" />, title: 'Bank-Level Security', subtitle: 'Your data is encrypted and protected' },
                { icon: <Star className="w-5 h-5 text-amber-500" />, title: '4.9 Star Rating', subtitle: 'Trusted by thousands of users' },
                { icon: <Clock className="w-5 h-5 text-emerald-600" />, title: 'Instant Setup', subtitle: 'Start using in under 2 minutes' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">{item.icon}</div>
                  <p className="text-sm font-bold text-slate-700">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.subtitle}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
