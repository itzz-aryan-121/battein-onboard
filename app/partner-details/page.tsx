'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './styles.css';
import '../animations.css';
import WaveBackground from '../components/WaveBackground';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import ErrorModal from '../components/ErrorModal';

const PartnerDetailsForm = () => {
    const { t } = useLanguage();
    const { userData, updateUserData } = useUserData();
    const [formData, setFormData] = useState({
        spokenLanguages: userData.spokenLanguages || [],
        hobbies: userData.hobbies || [],
        bio: userData.bio || '',
        audioIntro: null as File | null
    });
    
    // Add comprehensive error state for all fields
    const [errors, setErrors] = useState({
        spokenLanguages: '',
        hobbies: '',
        bio: '',
        audioIntro: '',
        general: ''
    });
    
    const [audioRecorded, setAudioRecorded] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [animatedFields, setAnimatedFields] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHobbiesDropdownOpen, setIsHobbiesDropdownOpen] = useState(false);
    const [isLanguagesDropdownOpen, setIsLanguagesDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSamplePlaying, setIsSamplePlaying] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    
    // Real-time audio visualization states
    const [audioLevels, setAudioLevels] = useState<number[]>(Array(35).fill(0));

    const [animatedElements, setAnimatedElements] = useState({
        header: false,
        languageSection: false,
        hobbiesSection: false,
        bioSection: false,
        audioSection: false,
        submitButton: false
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hobbiesDropdownRef = useRef<HTMLDivElement | null>(null);
    const languagesDropdownRef = useRef<HTMLDivElement | null>(null);
    const sampleAudioRef = useRef<HTMLAudioElement | null>(null);
    
    // Audio analysis refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const router = useRouter();

    const languageOptions = [
        { name: 'Hindi', active: false },
        { name: 'English', active: false },
        { name: 'Tamil', active: false },
        { name: 'Punjabi', active: false },
        { name: 'Bhojpuri', active: false },
        { name: 'Rajasthani', active: false },
        { name: 'Marathi', active: false },
        { name: 'Malayalam', active: false },
        { name: 'Bengali', active: false },
        { name: 'Telugu', active: false },
        { name: 'Kannada', active: false },
        { name: 'Gujarati', active: false },
        { name: 'Assamese', active: false }
    ];
    
    const [languagesList, setLanguagesList] = useState(languageOptions);

    const hobbiesOptions = [
        { name: 'Foodie 🍕', active: false },
        { name: 'Travel Junkie ✈️', active: false },
        { name: 'Dog Lover 🐶', active: false },
        { name: 'Movie Buff 🎬', active: false },
        { name: 'Looking for my partner-in-crime 😉', active: false },
        { name: 'Coffee addict ☕', active: false },
        { name: 'Fluent in sarcasm 😉', active: false },
        { name: 'Bookworm 📚', active: false },
        { name: 'Gym freak 💪', active: false },
        { name: 'Let\'s make memories together! 💖', active: false },
        { name: 'Dancer by heart 💃', active: false },
        { name: 'Music is my therapy 🎶', active: false },
        { name: 'Beach over mountains 🌊', active: false },
        { name: 'Adventurer ⛺', active: false },
        { name: 'Love deep convos 🌙', active: false },
        { name: 'Passionate about life ❤️', active: false },
        { name: 'Love cozy cafés ☕', active: false },
        { name: 'K-drama obsessed 🧸', active: false }
    ];

    const [hobbiesList, setHobbiesList] = useState(hobbiesOptions);

    // Animation timing
    useEffect(() => {
        setTimeout(() => setAnimatedFields(true), 300);
    }, []);
    
    // Progressive animation timing
    useEffect(() => {
        const timeouts = [
            setTimeout(() => setAnimatedElements(prev => ({ ...prev, header: true })), 200),
            setTimeout(() => setAnimatedElements(prev => ({ ...prev, languageSection: true })), 400),
            setTimeout(() => setAnimatedElements(prev => ({ ...prev, hobbiesSection: true })), 600),
            setTimeout(() => setAnimatedElements(prev => ({ ...prev, bioSection: true })), 800),
            setTimeout(() => setAnimatedElements(prev => ({ ...prev, audioSection: true })), 1000),
            setTimeout(() => setAnimatedElements(prev => ({ ...prev, submitButton: true })), 1200),
        ];
        
        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    }, []);

    // Cleanup audio resources when component unmounts
    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            // Cleanup audio analysis
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [audioUrl]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (hobbiesDropdownRef.current && !hobbiesDropdownRef.current.contains(event.target as Node)) {
                setIsHobbiesDropdownOpen(false);
            }
            if (languagesDropdownRef.current && !languagesDropdownRef.current.contains(event.target as Node)) {
                setIsLanguagesDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Restore form progress from context on mount
    useEffect(() => {
        setFormData({
            spokenLanguages: userData.spokenLanguages || [],
            hobbies: userData.hobbies || [],
            bio: userData.bio || '',
            audioIntro: null
        });
        
        // Sync language list with saved data
        if (userData.spokenLanguages && userData.spokenLanguages.length > 0) {
            setLanguagesList(prev => prev.map(lang => ({
                ...lang,
                active: userData.spokenLanguages.includes(lang.name)
            })));
        }
        
        // Sync hobby list with saved data
        if (userData.hobbies && userData.hobbies.length > 0) {
            setHobbiesList(prev => prev.map(hobby => ({
                ...hobby,
                active: userData.hobbies.includes(hobby.name)
            })));
        }
        
        if (userData.audioIntro) {
            setAudioRecorded(true);
            setAudioUrl(userData.audioIntro);
        }
    }, [userData]); // Add userData as dependency to reload when context changes

    useEffect(() => {
        localStorage.setItem('lastVisitedPage', '/partner-details');
    }, []);

    const handleSelectLanguage = (index: number) => {
        const updatedLanguages = [...languagesList];
        updatedLanguages[index].active = !updatedLanguages[index].active;
        setLanguagesList(updatedLanguages);

        const selectedLanguages = updatedLanguages.filter(language => language.active).map(language => language.name);
        
        // Update formData with selected languages
        setFormData(prev => ({
            ...prev,
            spokenLanguages: selectedLanguages
        }));

        // Save to context
        updateUserData({ spokenLanguages: selectedLanguages });
        
        // Validate languages field
        validateField('spokenLanguages', selectedLanguages);
    };

    const toggleLanguagesDropdown = () => {
        setIsLanguagesDropdownOpen(!isLanguagesDropdownOpen);
    };

    const handleSelectHobby = (index: number) => {
        const updatedHobbies = [...hobbiesList];
        updatedHobbies[index].active = !updatedHobbies[index].active;
        setHobbiesList(updatedHobbies);

        const selectedHobbies = updatedHobbies.filter(hobby => hobby.active).map(hobby => hobby.name);
        
        // Update formData with selected hobbies
        setFormData(prev => ({
            ...prev,
            hobbies: selectedHobbies
        }));

        // Save to context
        updateUserData({ hobbies: selectedHobbies });
        
        // Validate hobbies field
        validateField('hobbies', selectedHobbies);
    };

    const toggleHobbiesDropdown = () => {
        setIsHobbiesDropdownOpen(!isHobbiesDropdownOpen);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Save bio to context
        if (name === 'bio') {
            updateUserData({ bio: value });
            // Validate bio field
            validateField('bio', value);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleHearSample = () => {
        if (!sampleAudioRef.current) {
            sampleAudioRef.current = new Audio('/assets/sample-intro.mp3');
        }

        if (isSamplePlaying) {
            sampleAudioRef.current.pause();
            setIsSamplePlaying(false);
        } else {
            sampleAudioRef.current.play();
            setIsSamplePlaying(true);
            sampleAudioRef.current.onended = () => {
                setIsSamplePlaying(false);
            };
        }
    };

    const handlePlayRecording = () => {
        if (audioRef.current && audioUrl) {
            if (audioRef.current.paused) {
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleStartRecording = async () => {
        try {
            chunksRef.current = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            // Setup audio analysis for real-time visualization
            await setupAudioAnalysis(stream);
            
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm' // More widely supported format
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioBlob(audioBlob);
                setAudioUrl(url);
                setAudioRecorded(true);

                // Create a File object from the Blob
                const audioFile = new File([audioBlob], "audio-recording.webm", {
                    type: "audio/webm",
                    lastModified: Date.now()
                });

                setFormData(prev => ({
                    ...prev,
                    audioIntro: audioFile
                }));

                // Stop all tracks in the stream
                stream.getTracks().forEach(track => track.stop());
                
                // Cleanup audio analysis
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                }
                
                // Reset visualization states
                setAudioLevels(Array(35).fill(0));
            };

            // Start recording
            mediaRecorder.start(100); // Collect data every 100ms for smoother processing
            setIsRecording(true);

            // Start timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access your microphone. Please check permissions and try again.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setAudioRecorded(true);

            // Clear the timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            
            // Stop audio analysis
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            
            // Stop stream tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            
            // Validate audio field
            validateField('audioIntro', true);
        }
    };

    const handleDeleteRecording = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);
        setAudioBlob(null);
        setAudioRecorded(false);
        setRecordingTime(0);
        setFormData(prev => ({ ...prev, audioIntro: null }));
        
        // Reset visualization states
        setAudioLevels(Array(35).fill(0));
    };

    const handleReRecord = () => {
        // Clear previous recording
        handleDeleteRecording();
        // Start a new recording immediately
        setTimeout(() => {
            handleStartRecording();
        }, 100);
    };

    // Validation function for individual fields
    const validateField = (fieldName: string, value: any) => {
        let newErrors = { ...errors };
        
        switch (fieldName) {
            case 'spokenLanguages':
                if (!value || value.length === 0) {
                    newErrors.spokenLanguages = 'Please select at least one spoken language';
                } else {
                    newErrors.spokenLanguages = '';
                }
                break;
                
            case 'hobbies':
                if (!value || value.length === 0) {
                    newErrors.hobbies = 'Please select at least one hobby or interest';
                } else {
                    newErrors.hobbies = '';
                }
                break;
                
            case 'bio':
                if (!value || value.trim() === '') {
                    newErrors.bio = 'Please write a bio about yourself';
                } else if (value.trim().length < 10) {
                    newErrors.bio = 'Bio should be at least 10 characters long';
                } else if (value.trim().length > 500) {
                    newErrors.bio = 'Bio should not exceed 500 characters';
                } else {
                    newErrors.bio = '';
                }
                break;
                
            case 'audioIntro':
                if (!audioRecorded && !userData.audioIntro) {
                    newErrors.audioIntro = 'Please record an audio introduction';
                } else {
                    newErrors.audioIntro = '';
                }
                break;
        }
        
        setErrors(newErrors);
        return newErrors[fieldName as keyof typeof newErrors] === '';
    };

    // Validate all fields
    const validateAllFields = () => {
        const isLanguagesValid = validateField('spokenLanguages', formData.spokenLanguages);
        const isHobbiesValid = validateField('hobbies', formData.hobbies);
        const isBioValid = validateField('bio', formData.bio);
        const isAudioValid = validateField('audioIntro', audioRecorded || userData.audioIntro);
        
        return isLanguagesValid && isHobbiesValid && isBioValid && isAudioValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation
        if (!validateAllFields()) {
            setShowErrorModal(true);
            setIsSubmitting(false);
            return;
        }

        try {
            let audioUrl = userData.audioIntro;
            
            // Upload audio file if exists and not already uploaded
            if (formData.audioIntro && !userData.audioIntro) {
                setIsUploading(true);
                const audioFormData = new FormData();
                audioFormData.append('file', formData.audioIntro);
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: audioFormData
                });
                const data = await uploadResponse.json();
                audioUrl = data.url;
                setIsUploading(false);
            }

            // Update context with all partner details including audio URL
            const updateData = {
                spokenLanguages: formData.spokenLanguages,
                hobbies: formData.hobbies,
                bio: formData.bio,
                audioIntro: audioUrl
            };
            updateUserData(updateData);

            // Navigate to earning preference page
            router.push('/earn-multiple');
        } catch (error: any) {
            console.error('Error saving partner details:', error);
            setErrors(prev => ({ ...prev, general: `Error saving details: ${error.message || 'Unknown error'}` }));
            setShowErrorModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Real-time audio analysis function
    const analyzeAudio = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate average volume
        const average = dataArrayRef.current.reduce((sum, value) => sum + value, 0) / dataArrayRef.current.length;
        
        // Generate dynamic waveform based on audio input
        const newLevels = Array(35).fill(0).map((_, index) => {
            // Use frequency data to create realistic waveform
            const freqIndex = Math.floor((index / 35) * dataArrayRef.current!.length);
            const baseLevel = dataArrayRef.current![freqIndex] || 0;
            
            // Create variation for realistic audio waves
            const timeVariation = Math.sin(Date.now() * 0.01 + index * 0.5) * 0.3;
            const positionVariation = Math.cos(index * 0.8) * 0.4;
            const randomVariation = (Math.random() - 0.5) * 0.4;
            
            // Combine all variations for natural wave pattern
            const combinedVariation = timeVariation + positionVariation + randomVariation;
            const smoothed = baseLevel * (0.7 + combinedVariation);
            
            // Create frequency-based multipliers for more realistic audio spectrum
            let frequencyMultiplier = 1.0;
            if (index < 8) {
                // Low frequencies (bass) - taller
                frequencyMultiplier = 1.4 + Math.sin(index * 0.3) * 0.3;
            } else if (index < 20) {
                // Mid frequencies - moderate height with variation
                frequencyMultiplier = 1.0 + Math.sin(index * 0.4) * 0.5;
            } else {
                // High frequencies - shorter with quick variations
                frequencyMultiplier = 0.6 + Math.sin(index * 0.7) * 0.4;
            }
            
            const adjustedLevel = smoothed * frequencyMultiplier;
            
            // Scale to create height differences (8-75px range)
            const height = Math.max(8, Math.min(75, (adjustedLevel / 255) * 60 + 15));
            
            // Add some bars that are significantly taller for dramatic effect
            if (Math.random() > 0.85 && baseLevel > 30) {
                return Math.min(75, height * 1.5);
            }
            
            return height;
        });
        
        setAudioLevels(newLevels);
        
        // Continue animation at 60fps for smooth visualization
        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    };

    // Setup audio analysis
    const setupAudioAnalysis = async (stream: MediaStream) => {
        try {
            // Create audio context
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // Create analyser node
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            analyserRef.current.smoothingTimeConstant = 0.8;
            
            // Create data array
            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);
            
            // Connect stream to analyser
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            
            // Start analysis
            analyzeAudio();
        } catch (error) {
            console.error('Error setting up audio analysis:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-hidden">
            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title={t('errors', 'pleaseCompleteFields')}
                errors={errors}
                fieldLabels={{
                    spokenLanguages: t('errors', 'spokenLanguages'),
                    hobbies: t('errors', 'hobbiesInterests'),
                    bio: t('errors', 'bio'),
                    audioIntro: t('errors', 'audioIntro'),
                    general: t('errors', 'generalError')
                }}
            />
            
            {/* Main content */}
            <div className="flex flex-1 h-full">
                {/* Left side - Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col h-full animate-pageEnter">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className={`transition-all duration-500 mb-6 ${animatedElements.header ? 'animate-headerSlide' : 'animate-on-load'}`}>
                            <h1 className="text-3xl md:text-4xl font-bold text-golden-shine mb-2" style={{ fontFamily: 'Inter' }}>
                                {t('partnerDetails', 'title')}
                            </h1>
                            <p className="text-[#2D2D2D] text-xl font-medium md:text-base" style={{ fontFamily: 'Inter' }}>
                                {t('partnerDetails', 'subtitle')}
                            </p>
                        </div>

                        {/* Form content - scrollable area */}
                        <div className="flex-1 space-y-4 overflow-auto pr-2 pb-4">
                            {/* Spoken Languages - Dropdown */}
                            <div className={`transition-all duration-500 ${animatedElements.languageSection ? 'animate-fadeInLeft' : 'animate-on-load'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    {t('partnerDetails', 'spokenLanguages')} <span className="text-[red]">*</span>
                                </label>
                                <div className="relative" ref={languagesDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={toggleLanguagesDropdown}
                                        className={`w-full border ${errors.spokenLanguages ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-2 text-sm flex justify-between items-center bg-white z-1000 transition-all`}
                                        style={{ fontFamily: 'Inter' }}
                                    >
                                        <span className={`${formData.spokenLanguages.length > 0 ? 'text-[#2D2D2D] font-medium' : 'text-gray-500'} truncate mr-2`}>
                                            {formData.spokenLanguages.length > 0
                                                ? formData.spokenLanguages.join(', ')
                                                : t('partnerDetails', 'spokenLanguagesPlaceholder')}
                                        </span>
                                        <svg
                                            width="12"
                                            height="6"
                                            viewBox="0 0 12 6"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`transition-transform ${isLanguagesDropdownOpen ? 'rotate-180' : ''} flex-shrink-0`}
                                        >
                                            <path d="M1 1L6 5L11 1" stroke="#F5BC1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    {/* Languages dropdown menu */}
                                    {isLanguagesDropdownOpen && (
                                       <div className="relative z-1000 mt-1 w-full bg-white border border-[#F5BC1C] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <div className="p-2">
                                                {languagesList.map((language, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center py-1.5 px-2 hover:bg-[#FFF9E9] rounded cursor-pointer z-1000"
                                                        onClick={() => handleSelectLanguage(index)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={language.active}
                                                            onChange={() => {}}
                                                            className="mr-2 h-4 w-4 accent-[#F5BC1C]"
                                                        />
                                                        <span className="text-xs text-[#2D2D2D]" style={{ fontFamily: 'Inter' }}>
                                                            {language.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Error message for spoken languages */}
                                {errors.spokenLanguages && (
                                    <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>
                                        {errors.spokenLanguages}
                                    </p>
                                )}
                            </div>

                            {/* Hobbies & Interests - Dropdown */}
                            <div className={`transition-all duration-500 ${animatedElements.hobbiesSection ? 'animate-fadeInLeft' : 'animate-on-load'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    {t('partnerDetails', 'hobbiesInterests')} <span className="text-[red]">*</span>
                                </label>
                                <div className="relative" ref={hobbiesDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={toggleHobbiesDropdown}
                                        className={`w-full border ${errors.hobbies ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-2 text-sm flex justify-between items-center bg-white`}
                                        style={{ fontFamily: 'Inter' }}
                                    >
                                        <span className={`${formData.hobbies.length > 0 ? 'text-[#2D2D2D] font-medium' : 'text-gray-500'} truncate mr-2`}>
                                            {formData.hobbies.length > 0
                                                ? formData.hobbies.join(', ')
                                                : t('partnerDetails', 'hobbiesPlaceholder')}
                                        </span>
                                        <svg
                                            width="12"
                                            height="6"
                                            viewBox="0 0 12 6"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`transition-transform ${isHobbiesDropdownOpen ? 'rotate-180' : ''} flex-shrink-0`}
                                        >
                                            <path d="M1 1L6 5L11 1" stroke="#F5BC1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    {/* Hobbies dropdown menu */}
                                    {isHobbiesDropdownOpen && (
                                        <div className="relative z-10 mt-1 w-full bg-white border border-[#F5BC1C] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <div className="p-2">
                                                {hobbiesList.map((hobby, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center py-1.5 px-2 hover:bg-[#FFF9E9] rounded cursor-pointer"
                                                        onClick={() => handleSelectHobby(index)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={hobby.active}
                                                            onChange={() => { }}
                                                            className="mr-2 h-4 w-4 accent-[#F5BC1C]"
                                                        />
                                                        <span className="text-xs text-[#2D2D2D]" style={{ fontFamily: 'Inter' }}>
                                                            {hobby.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Error message for hobbies */}
                                {errors.hobbies && (
                                    <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>
                                        {errors.hobbies}
                                    </p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className={`transition-all duration-500 ${animatedElements.bioSection ? 'animate-fadeInLeft' : 'animate-on-load'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    {t('partnerDetails', 'bio')} <span className="text-[red]">*</span>
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder={t('partnerDetails', 'bioPlaceholder')}
                                    className={`w-full border ${errors.bio ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-2 h-24 resize-none text-sm`}
                                    style={{ fontFamily: 'Inter' }}
                                    required
                                />
                                {/* Character count and error message */}
                                <div className="flex justify-between items-start mt-1">
                                    <div>
                                        {errors.bio && (
                                            <p className="text-xs text-red-500" style={{ fontFamily: 'Inter' }}>
                                                {errors.bio}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>
                                            {t('partnerDetails', 'bioNote')}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>
                                        {formData.bio.length}/500
                                    </p>
                                </div>
                            </div>

                            {/* Audio Intro */}
                            <div className={`transition-all duration-500 ${animatedElements.audioSection ? 'animate-fadeInLeft' : 'animate-on-load'}`}>
                                <label className="relative text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    {t('partnerDetails', 'recordIntro')} <span className="text-[#F5BC1C]">*</span>
                                </label>
                                {!audioRecorded && !isRecording ? (
                                    <div className={`audio-recording-container ${errors.audioIntro ? 'border-red-500' : ''}`}>
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex-1 mb-4 sm:mb-0 sm:pr-3">
                                                <p className="text-xs text-[#2D2D2D] mb-3" style={{ fontFamily: 'Inter' }}>
                                                    {t('partnerDetails', 'audioDescription')}
                                                </p>
                                                <div className="mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleHearSample}
                                                        className="flex items-center justify-center sm:justify-start text-[#2D2D2D] text-xs font-medium hover-scale transition-all w-full sm:w-auto"
                                                        style={{ fontFamily: 'Inter' }}
                                                    >
                                                        <span className="mr-3">{t('partnerDetails', 'hearSample')}</span>
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center hover-glow">
                                                            <img 
                                                                src={isSamplePlaying ? "/assets/pause.png" : "/assets/play.png"} 
                                                                alt={isSamplePlaying ? "Pause" : "Play"} 
                                                                className="w-9 h-9" 
                                                            />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center sm:ml-2">
                                                <div className="microphone-button microphone-glow mb-2" onClick={handleStartRecording}>
                                                    <img src="/assets/mic.png" alt="Microphone" className="w-6 h-6" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleStartRecording}
                                                    className="bg-[#F5BC1C] text-white rounded-2xl px-4 py-2 text-sm font-medium button-animate hover-glow transition-all w-full sm:w-auto min-w-[120px]"
                                                    style={{ fontFamily: 'Inter' }}
                                                >
                                                    {t('partnerDetails', 'startRecording')}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Error message for audio intro */}
                                        {errors.audioIntro && (
                                            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md animate-shakeX">
                                                <p className="text-xs text-red-600" style={{ fontFamily: 'Inter' }}>
                                                    {errors.audioIntro}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : isRecording ? (
                                    // Recording in progress view
                                    <div className="audio-recording-container">
                                        <div className="flex flex-col">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                                                <div className="recording-indicator flex items-center">
                                                    <div className="recording-dot"></div>
                                                    <span className="text-sm font-medium ml-2" style={{ fontFamily: 'Inter' }}>
                                                        {t('partnerDetails', 'recording')} {formatTime(recordingTime)}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleStopRecording}
                                                    className="bg-[#EF4444] text-white rounded-lg px-4 py-2 text-sm font-medium button-animate hover-glow transition-all w-full sm:w-auto"
                                                    style={{ fontFamily: 'Inter' }}
                                                >
                                                    {t('partnerDetails', 'stopRecording')}
                                                </button>
                                            </div>

                                            {/* Enhanced waveform visualization - Mobile Responsive */}
                                            <div className="waveform-container w-full">
                                                {audioLevels.map((height, index) => (
                                                    <div
                                                        key={index}
                                                        className="waveform-bar"
                                                        style={{
                                                            height: `${height}px`,
                                                            background: `linear-gradient(to top, #F5BC1C, #FFD700)`,
                                                            transition: 'height 0.1s ease-out, background 0.2s ease',
                                                            boxShadow: height > 30 
                                                                ? '0 0 8px rgba(245, 188, 28, 0.4)' 
                                                                : 'none'
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>

                                            <p className="text-xs text-[#2D2D2D] mt-3 text-center px-2" style={{ fontFamily: 'Inter' }}>
                                                Speak clearly and at a normal pace. Your audio will be used to introduce you to other users.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Audio recorded view
                                    <div className="audio-player-container">
                                        <div className="flex flex-col w-full">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2 sm:gap-0">
                                                <span className="text-sm font-medium text-[#2D2D2D] text-center sm:text-left" style={{ fontFamily: 'Inter' }}>
                                                    {t('partnerDetails', 'audioRecorded')} ({recordingTime > 0 ? formatTime(recordingTime) : '00:00'})
                                                </span>
                                                <div className="flex gap-2 justify-center sm:justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={handleDeleteRecording}
                                                        className="border border-[#EF4444] text-[#EF4444] rounded-lg px-3 py-1.5 text-xs font-medium button-animate hover-scale transition-all flex-1 sm:flex-none"
                                                        style={{ fontFamily: 'Inter' }}
                                                    >
                                                        {t('partnerDetails', 'delete')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleReRecord}
                                                        className="bg-[#F5BC1C] text-white rounded-lg px-3 py-1.5 text-xs font-medium button-animate hover-glow transition-all flex-1 sm:flex-none"
                                                        style={{ fontFamily: 'Inter' }}
                                                    >
                                                        {t('partnerDetails', 'reRecord')}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Enhanced Audio Player - Mobile Responsive */}
                                            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                                <div className="audio-waveform w-full flex-1">
                                                    {Array(50).fill(0).map((_, index) => {
                                                        // Create a more realistic static waveform
                                                        const height = 15 + Math.sin(index * 0.3) * 12 + Math.cos(index * 0.7) * 8;
                                                        const isActive = index < 12; // Show first few bars as active/played
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`audio-waveform-bar ${isActive ? 'active' : ''}`}
                                                                style={{ height: `${Math.max(6, height)}px` }}
                                                            ></div>
                                                        );
                                                    })}
                                                </div>
                                                {/* Play button: below waveform on mobile, right on desktop */}
                                                <button
                                                    type="button"
                                                    onClick={handlePlayRecording}
                                                    className="play-button mt-3 sm:mt-0 sm:ml-3 flex-shrink-0"
                                                    style={{ alignSelf: 'center' }}
                                                >
                                                    {isPlaying ? (
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                {/* Audio element - hidden */}
                                                {audioUrl && (
                                                    <audio
                                                        ref={audioRef}
                                                        src={audioUrl}
                                                        onEnded={() => setIsPlaying(false)}
                                                        className="hidden"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button - Fixed at bottom */}
                        <div className="mt-4 mb-32 z-20 w-full flex justify-center">
                            <button
                                type="submit"
                                className={`w-full max-w-[373px] py-3 rounded-lg transition-all duration-200 font-medium text-md hover-glow ${
                                    audioRecorded && formData.spokenLanguages.length > 0
                                    ? 'bg-[#F5BC1C] text-white cursor-pointer' 
                                    : 'bg-[#F5BC1C] bg-opacity-50 text-white cursor-not-allowed'
                                } ${isSubmitting || isUploading ? 'opacity-70 cursor-not-allowed' : ''} ${animatedElements.submitButton ? 'animate-buttonGlow' : 'animate-on-load'}`}
                                style={{ fontFamily: 'Inter' }}
                                disabled={!audioRecorded || formData.spokenLanguages.length === 0 || isSubmitting || isUploading}
                            >
                                {isSubmitting || isUploading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        {isUploading ? t('partnerDetails', 'uploadingAudio') : t('partnerDetails', 'processing')}
                                    </span>
                                ) : (
                                    t('partnerDetails', 'joinPartner')
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right side - Illustration */}
                <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center animate-fadeInRight">
                        <Image
                            src="/assets/two-girls-illustration.png"
                            alt="Two people chatting"
                            width={600}
                            height={600}
                            className="object-contain z-10 relative hover-scale"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Wave Background Component */}
            <WaveBackground height={200} />
        </div>
    );
};

export default PartnerDetailsForm;