'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './styles.css';
import WaveBackground from '../components/WaveBackground';

const PartnerDetailsForm = () => {
    const [formData, setFormData] = useState({
        spokenLanguages: [] as string[],
        hobbies: [] as string[],
        bio: '',
        audioIntro: null as File | null
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

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hobbiesDropdownRef = useRef<HTMLDivElement | null>(null);
    const languagesDropdownRef = useRef<HTMLDivElement | null>(null);
    const sampleAudioRef = useRef<HTMLAudioElement | null>(null);

    const router = useRouter();

    const languageOptions = [
        { name: 'English', active: false },
        { name: 'Hindi', active: false },
        { name: 'Punjabi', active: false },
        { name: 'Bengali', active: false },
        { name: 'Gujarati', active: false },
        { name: 'Marathi', active: false },
        { name: 'Tamil', active: false },
        { name: 'Telugu', active: false },
        { name: 'Kannada', active: false },
        { name: 'Malayalam', active: false },
        { name: 'Urdu', active: false },
        { name: 'Odia', active: false },
        { name: 'Assamese', active: false },
        { name: 'Maithili', active: false },
        { name: 'Sanskrit', active: false }
    ];
    
    const [languagesList, setLanguagesList] = useState(languageOptions);

    const hobbiesOptions = [
        { name: 'Cooking', active: false },
        { name: 'Painting', active: false },
        { name: 'Sports', active: false },
        { name: 'Gaming', active: false },
        { name: 'Planting', active: false },
        { name: 'Gardening', active: false },
        { name: 'Photography', active: false },
        { name: 'Traveling', active: false },
        { name: 'Sketching', active: false },
        { name: 'Reading', active: false },
        { name: 'Writing', active: false },
        { name: 'Dancing', active: false },
        { name: 'Singing', active: false },
        { name: 'Hiking', active: false },
        { name: 'Yoga', active: false },
        { name: 'Chess', active: false },
        { name: 'Cycling', active: false },
        { name: 'Swimming', active: false },
        { name: 'Crafting', active: false },
        { name: 'Baking', active: false }
    ];

    const [hobbiesList, setHobbiesList] = useState(hobbiesOptions);

    // Monitoring audioRecorded state changes
    useEffect(() => {
        console.log('audioRecorded state changed:', audioRecorded);
    }, [audioRecorded]);

    // Animation timing
    useEffect(() => {
        setTimeout(() => setAnimatedFields(true), 300);
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

    // Restore form progress from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('partnerDetailsProgress');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.formData) setFormData(parsed.formData);
                if (parsed.audioRecorded) setAudioRecorded(parsed.audioRecorded);
                if (parsed.audioUrl) setAudioUrl(parsed.audioUrl);
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    // Autosave form progress to localStorage on change
    useEffect(() => {
        localStorage.setItem('partnerDetailsProgress', JSON.stringify({
            formData,
            audioRecorded,
            audioUrl
        }));
    }, [formData, audioRecorded, audioUrl]);

    useEffect(() => {
        localStorage.setItem('lastVisitedPage', '/partner-details');
    }, []);

    const handleSelectLanguage = (index: number) => {
        const updatedLanguages = [...languagesList];
        updatedLanguages[index].active = !updatedLanguages[index].active;
        setLanguagesList(updatedLanguages);

        // Update formData with selected languages
        setFormData(prev => ({
            ...prev,
            spokenLanguages: updatedLanguages.filter(language => language.active).map(language => language.name)
        }));
    };

    const toggleLanguagesDropdown = () => {
        setIsLanguagesDropdownOpen(!isLanguagesDropdownOpen);
    };

    const handleSelectHobby = (index: number) => {
        const updatedHobbies = [...hobbiesList];
        updatedHobbies[index].active = !updatedHobbies[index].active;
        setHobbiesList(updatedHobbies);

        // Update formData with selected hobbies
        setFormData(prev => ({
            ...prev,
            hobbies: updatedHobbies.filter(hobby => hobby.active).map(hobby => hobby.name)
        }));
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
        }
    };

    const handleDeleteRecording = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);
        setAudioBlob(null);
        setAudioRecorded(false);
        setFormData(prev => ({
            ...prev,
            audioIntro: null
        }));
    };

    const handleReRecord = () => {
        // Clear previous recording
        handleDeleteRecording();
        // Start a new recording immediately
        setTimeout(() => {
            handleStartRecording();
        }, 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form
        if (!audioRecorded || !formData.audioIntro) {
            alert("Please record your audio introduction before submitting.");
            setIsSubmitting(false);
            return;
        }
        
        if (formData.spokenLanguages.length === 0) {
            alert("Please select at least one spoken language.");
            setIsSubmitting(false);
            return;
        }
        
        if (formData.hobbies.length === 0) {
            alert("Please select at least one hobby.");
            setIsSubmitting(false);
            return;
        }
        
        if (!formData.bio) {
            alert("Bio is required.");
            setIsSubmitting(false);
            return;
        }

        try {
            let audioUrl = '';
            
            // Upload audio file if exists
            if (formData.audioIntro) {
                setIsUploading(true);
                const audioFormData = new FormData();
                audioFormData.append('file', formData.audioIntro);

                try {
                    const uploadResponse = await fetch('/api/upload', {
                        method: 'POST',
                        body: audioFormData
                    });

                    if (!uploadResponse.ok) {
                        const errorData = await uploadResponse.json();
                        throw new Error(errorData.error || 'Failed to upload audio file');
                    }

                    const data = await uploadResponse.json();
                    audioUrl = data.url;
                } catch (uploadError: any) {
                    console.error('Error uploading audio:', uploadError);
                    alert(`Error uploading audio: ${uploadError.message || 'Unknown error'}`);
                    setIsSubmitting(false);
                    setIsUploading(false);
                    return;
                } finally {
                    setIsUploading(false);
                }
            }

            // Store partner details in localStorage
            const partnerDetails = {
                name: localStorage.getItem('name'),
                phoneNumber: localStorage.getItem('phoneNumber'),
                gender: localStorage.getItem('gender'),
                spokenLanguages: formData.spokenLanguages,
                hobbies: formData.hobbies,
                bio: formData.bio,
                audioIntro: audioUrl
            };

            localStorage.setItem('partnerDetails', JSON.stringify(partnerDetails));

            // Navigate to earn-multiple page after successful submission
            router.push('/earn-multiple');

        } catch (error: any) {
            console.error('Error submitting partner details:', error);
            alert(`Failed to submit partner details: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-hidden">
            {/* Main content */}
            <div className="flex flex-1 h-full">
                {/* Left side - Form */}
                <div className="w-full md:w-1/2 p-8 flex flex-col h-full">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className={`transition-all duration-500 mb-6 ${animatedFields ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#F5BC1C] mb-2" style={{ fontFamily: 'Inter' }}>
                                Enter Your details
                            </h1>
                            <p className="text-[#2D2D2D] text-xl font-medium md:text-base" style={{ fontFamily: 'Inter' }}>
                                Turn your time into income. Start your journey as a Partner.
                            </p>
                        </div>

                        {/* Form content - scrollable area */}
                        <div className="flex-1 space-y-4 overflow-auto pr-2 pb-4">
                            {/* Spoken Languages - Dropdown */}
                            <div className={`transition-all duration-500 delay-100 ${animatedFields ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    Spoken Languages <span className="text-[red]">*</span>
                                </label>
                                <div className="relative" ref={languagesDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={toggleLanguagesDropdown}
                                        className="w-full border border-[#F5BC1C] rounded-lg px-3 py-2 text-sm flex justify-between items-center bg-white button-animate z-1000"
                                        style={{ fontFamily: 'Inter' }}
                                    >
                                        <span className={`${formData.spokenLanguages.length > 0 ? 'text-[#2D2D2D] font-medium' : 'text-gray-500'} truncate mr-2`}>
                                            {formData.spokenLanguages.length > 0
                                                ? formData.spokenLanguages.join(', ')
                                                : 'Select languages you speak'}
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
                            </div>

                            {/* Hobbies & Interests - Dropdown */}
                            <div className={`transition-all duration-500 delay-200 ${animatedFields ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    Hobbies & Interests <span className="text-[red]">*</span>
                                </label>
                                <div className="relative" ref={hobbiesDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={toggleHobbiesDropdown}
                                        className="w-full border border-[#F5BC1C] rounded-lg px-3 py-2 text-sm flex justify-between items-center bg-white button-animate"
                                        style={{ fontFamily: 'Inter' }}
                                    >
                                        <span className={`${formData.hobbies.length > 0 ? 'text-[#2D2D2D] font-medium' : 'text-gray-500'} truncate mr-2`}>
                                            {formData.hobbies.length > 0
                                                ? formData.hobbies.join(', ')
                                                : 'Select your hobbies'}
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
                            </div>

                            {/* Bio */}
                            <div className={`transition-all duration-500 delay-300 ${animatedFields ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    Bio <span className="text-[red]">*</span>
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Typing..."
                                    className="w-full border border-[#F5BC1C] rounded-lg px-3 py-2 h-24 resize-none text-sm"
                                    style={{ fontFamily: 'Inter' }}
                                    required
                                />
                            </div>

                            {/* Audio Intro */}
                            <div className={`transition-all duration-500 delay-400 ${animatedFields ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <label className="relative text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    Record Your Intro <span className="text-[#F5BC1C]">*</span>
                                </label>
                                {!audioRecorded && !isRecording ? (
                                    <div className="bg-[#FFF9E9] rounded-lg p-4 border border-[#F5BC1C] border-opacity-30">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 pr-3">
                                                <p className="text-xs text-[#2D2D2D]" style={{ fontFamily: 'Inter' }}>
                                                    <span className="font-bold">When you upload your audio,</span> take a moment to talk about yourself your interests, what you're looking for, or anything you'd like others to know. Make sure your audio is at least <span className="font-bold">30 seconds long</span> so people can get a good sense of who you are!
                                                </p>
                                                <div className="mt-2 space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={handleHearSample}
                                                        className="flex items-center text-[#2D2D2D] text-xs font-medium button-animate"
                                                        style={{ fontFamily: 'Inter' }}
                                                    >
                                                        <span className="mr-3">Hear sample intro</span>
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center">
                                                            <img 
                                                                src={isSamplePlaying ? "/assets/pause.png" : "/assets/play.png"} 
                                                                alt={isSamplePlaying ? "Pause" : "Play"} 
                                                                className="w-9 h-9" 
                                                            />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center ml-2">
                                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2">
                                                    <img src="/assets/mic.png" alt="Microphone" className="w-9 h-9" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleStartRecording}
                                                    className="bg-[#F5BC1C] text-white rounded-2xl px-3 py-1.5 text-sm font-medium button-animate"
                                                    style={{ fontFamily: 'Inter' }}
                                                >
                                                    Upload Audio
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : isRecording ? (
                                    // Recording in progress view
                                    <div className="bg-[#FFF9E9] rounded-lg p-4 border border-[#F5BC1C] border-opacity-30">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-medium text-[#FF9900]" style={{ fontFamily: 'Inter' }}>
                                                    Recording... {formatTime(recordingTime)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleStopRecording}
                                                    className="bg-[#F5BC1C] text-white rounded-lg px-3 py-1.5 text-xs font-medium button-animate"
                                                    style={{ fontFamily: 'Inter' }}
                                                >
                                                    Stop Recording
                                                </button>
                                            </div>

                                            {/* Updated waveform to match the recorded audio view */}
                                            <div className="relative h-14 bg-[#FFF9E9] rounded-xl border border-[#F5BC1C] px-4 py-2">
                                                {/* Animated waveform visualization */}
                                                <div className="absolute inset-0 flex items-center space-x-1 px-4">
                                                    {Array(40).fill(0).map((_, index) => {
                                                        // Randomize which bars are active to simulate recording
                                                        const isActive = Math.random() > 0.6;
                                                        // Create dynamic height based on time and position
                                                        const height = 20 + Math.sin(index * 0.3 + recordingTime * 2) * 30;
                                                        
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`rounded-full ${isActive ? 'bg-[#F5BC1C]' : 'bg-gray-300'}`}
                                                                style={{
                                                                    height: `${height}%`,
                                                                    width: '5px',
                                                                    transition: 'height 0.1s ease'
                                                                }}
                                                            ></div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <p className="text-xs text-[#2D2D2D] mt-1" style={{ fontFamily: 'Inter' }}>
                                                Speak clearly and at a normal pace. Your audio will be used to introduce you to other users.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Audio recorded view
                                    <div className="bg-[#FFF9E9] rounded-lg p-4 border border-[#F5BC1C] border-opacity-30">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-medium text-[#2D2D2D]" style={{ fontFamily: 'Inter' }}>
                                                    Audio Recorded ({recordingTime > 0 ? formatTime(recordingTime) : '00:00'})
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleDeleteRecording}
                                                        className="border border-[#F5BC1C] text-[#F5BC1C] rounded-lg px-3 py-1.5 text-xs font-medium button-animate"
                                                        style={{ fontFamily: 'Inter' }}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleReRecord}
                                                        className="bg-[#F5BC1C] text-white rounded-lg px-3 py-1.5 text-xs font-medium button-animate"
                                                        style={{ fontFamily: 'Inter' }}
                                                    >
                                                        Re-record
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Audio Player - Updated to match the image */}
                                            <div className="relative h-14 bg-[#FFF9E9] rounded-xl border border-[#F5BC1C] px-4 py-2">
                                                {/* Waveform visualization */}
                                                <div className="absolute inset-0 flex items-center space-x-1 px-4">
                                                    {Array(40).fill(0).map((_, index) => {
                                                        // Make first few bars gold to match image
                                                        const isGold = index < 5;
                                                        // Vary heights for natural waveform look
                                                        const height = 30 + Math.sin(index * 0.5) * 25;
                                                        
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`rounded-full ${isGold ? 'bg-[#F5BC1C]' : 'bg-gray-300'}`}
                                                                style={{
                                                                    height: `${height}%`,
                                                                    width: '5px'
                                                                }}
                                                            ></div>
                                                        );
                                                    })}
                                                </div>
                                                
                                                {/* Play button positioned on the right */}
                                                <button
                                                    type="button"
                                                    onClick={handlePlayRecording}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center button-animate"
                                                >
                                                    {isPlaying ? (
                                                        <img src="/assets/pause-button.png" alt="Pause" className="w-5 h-5" />
                                                    ) : (
                                                        <img src="/assets/play.png" alt="Play" className="w-5 h-5" />
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
                        <div className="mt-4 mb-32 z-20 mx-auto">
                            <button
                                type="submit"
                                className={`w-[373px] mx-auto py-3 rounded-lg transition-colors font-medium text-md ${
                                    audioRecorded && formData.spokenLanguages.length > 0
                                    ? 'bg-[#F5BC1C] text-white cursor-pointer' 
                                    : 'bg-[#F5BC1C] bg-opacity-50 text-white cursor-not-allowed'
                                } ${isSubmitting || isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                style={{ fontFamily: 'Inter' }}
                                disabled={!audioRecorded || formData.spokenLanguages.length === 0 || isSubmitting || isUploading}
                            >
                                {isSubmitting || isUploading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        {isUploading ? 'Uploading Audio...' : 'Processing...'}
                                    </span>
                                ) : (
                                    'Join as a Partner'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right side - Illustration */}
                <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/assets/two-girls-illustration.png"
                            alt="Two people chatting"
                            width={600}
                            height={600}
                            className="object-contain z-10 relative"
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