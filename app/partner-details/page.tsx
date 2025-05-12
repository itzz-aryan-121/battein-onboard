'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './styles.css';

const PartnerDetailsForm = () => {
    const [formData, setFormData] = useState({
        spokenLanguage: 'English',
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

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();

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

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsHobbiesDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        // Logic to play sample audio
        const sampleAudio = new Audio('/assets/sample-intro.mp3');
        sampleAudio.play();
        setIsPlaying(true);
        sampleAudio.onended = () => setIsPlaying(false);
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
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/mpeg' });
                const url = URL.createObjectURL(audioBlob);
                setAudioBlob(audioBlob);
                setAudioUrl(url);
                setAudioRecorded(true);

                // Create a File object from the Blob
                const audioFile = new File([audioBlob], "audio-recording.mp3", {
                    type: "audio/mpeg",
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
            mediaRecorder.start();
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!audioRecorded || !formData.audioIntro) {
            alert("Please record your audio introduction before submitting.");
            return;
        }

        console.log('Form submitted:', formData);
        // Navigate to next page in the flow
        // router.push('/next-page');
    };

    return (
        <div className="fixed inset-0 bg-white overflow-hidden flex flex-col">
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
                            {/* Spoken Language */}
                            <div className={`transition-all duration-500 delay-100 ${animatedFields ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    Spoken Language <span className="text-[red]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="spokenLanguage"
                                    value={formData.spokenLanguage}
                                    onChange={handleChange}
                                    placeholder="English"
                                    className="w-full border border-[#F5BC1C] rounded-lg px-3 py-2 text-sm"
                                    style={{ fontFamily: 'Inter' }}
                                    required
                                />
                            </div>

                            {/* Hobbies & Interests - Dropdown */}
                            <div className={`transition-all duration-500 delay-200 ${animatedFields ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    Hobbies & Interests
                                </label>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={toggleHobbiesDropdown}
                                        className="w-full border border-[#F5BC1C] rounded-lg px-3 py-2 text-sm flex justify-between items-center bg-white"
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

                                    {/* Dropdown menu */}
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
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Typing..."
                                    className="w-full border border-[#F5BC1C] rounded-lg px-3 py-2 h-24 resize-none text-sm"
                                    style={{ fontFamily: 'Inter' }}
                                />
                            </div>

                            {/* Audio Intro */}
                            <div className={`transition-all duration-500 delay-400 ${animatedFields ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <label className="block text-[#2D2D2D] font-medium mb-1 text-sm" style={{ fontFamily: 'Inter' }}>
                                    Record Your Intro <span className="text-[#F5BC1C]">*</span>
                                </label>
                                <div className="bg-[#FFF9E9] rounded-lg p-4 border border-[#F5BC1C] border-opacity-30">
                                    {!audioRecorded ? (
                                        <>
                                            {!isRecording ? (
                                                <>
                                                    <div className="flex flex-col md:flex-row gap-3">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-[#2D2D2D]" style={{ fontFamily: 'Inter' }}>
                                                                <span className="font-bold">When you upload your audio,</span> take a moment to talk about yourself, your interests, what you're looking for, or anything you'd like others to know. Make sure your audio is at least 30 seconds long so people can get a good sense of who you are!
                                                            </p>
                                                            <div className="flex items-center mt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={handleHearSample}
                                                                    className="flex items-center text-[#F5BC1C] text-xs font-medium"
                                                                    style={{ fontFamily: 'Inter' }}
                                                                    disabled={isPlaying}
                                                                >
                                                                    <div className="w-5 h-5 rounded-full flex items-center justify-center mr-1.5">
                                                                        {isPlaying ? (
                                                                            <span className="w-2 h-2"></span>
                                                                        ) : (
                                                                            <img src="/assets/play.png" alt="Play" className="w-4 h-4" />
                                                                        )}
                                                                    </div>
                                                                    Hear sample intro
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <button
                                                                type="button"
                                                                onClick={handleStartRecording}
                                                                className="bg-[#F5BC1C] text-white rounded-lg px-3 py-1.5 text-xs font-medium"
                                                                style={{ fontFamily: 'Inter' }}
                                                            >
                                                                Start Recording
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                // Recording in progress view
                                                <div className="flex flex-col">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-medium text-[#FF9900]" style={{ fontFamily: 'Inter' }}>
                                                            Recording... {formatTime(recordingTime)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={handleStopRecording}
                                                            className="bg-[#F5BC1C] text-white rounded-lg px-2 py-1 text-xs font-medium"
                                                            style={{ fontFamily: 'Inter' }}
                                                        >
                                                            Stop Recording
                                                        </button>
                                                    </div>

                                                    {/* Audio Waveform Visualization */}
                                                    <div className="h-10 w-full rounded-lg border border-[#F5BC1C] border-opacity-30 overflow-hidden bg-white p-1">
                                                        <div className="flex items-center justify-between h-full space-x-0.5">
                                                            {/* Simulate a sound wave with bars matching the design */}
                                                            {Array(40).fill(0).map((_, index) => {
                                                                // Determine if this is a golden/active bar or a gray/inactive bar
                                                                const isActive = Math.random() > 0.5; // Randomly alternate for animation effect
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={`h-full w-0.5 rounded-full ${isActive ? 'bg-[#F5BC1C]' : 'bg-[#DDDDDD]'}`}
                                                                        style={{
                                                                            height: `${20 + Math.sin(index * 0.3 + recordingTime * 2) * 60}%`,
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
                                            )}
                                        </>
                                    ) : (
                                        // Audio recorded view
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-medium text-[#2D2D2D]" style={{ fontFamily: 'Inter' }}>
                                                    Audio Recorded ({recordingTime > 0 ? formatTime(recordingTime) : '00:00'})
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleDeleteRecording}
                                                        className="border border-[#F5BC1C] text-[#F5BC1C] rounded-lg px-3 py-1.5 text-xs font-medium"
                                                        style={{ fontFamily: 'Inter' }}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleStartRecording}
                                                        className="bg-[#F5BC1C] text-white rounded-lg px-3 py-1.5 text-xs font-medium"
                                                        style={{ fontFamily: 'Inter' }}
                                                    >
                                                        Record Again
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Audio Player */}
                                            <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-[#F5BC1C] border-opacity-30">
                                                <button
                                                    type="button"
                                                    onClick={handlePlayRecording}
                                                    className="w-6 h-6 rounded-full bg-[#F5BC1C] flex items-center justify-center flex-shrink-0"
                                                >
                                                    {isPlaying ? (
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect x="6" y="4" width="4" height="16" fill="white" />
                                                            <rect x="14" y="4" width="4" height="16" fill="white" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8 5V19L19 12L8 5Z" fill="white" />
                                                        </svg>
                                                    )}
                                                </button>

                                                <div className="h-6 flex-1 relative">
                                                    {/* Static waveform for recorded audio - styled like the image */}
                                                    <div className="absolute inset-0 flex items-center justify-between space-x-0.5">
                                                        {Array(40).fill(0).map((_, index) => {
                                                            // Create a pattern similar to the image
                                                            const isActive = index % 3 === 0 || index % 5 === 0; // Create a pattern of active bars
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`h-full flex-1 rounded-full ${isActive ? 'bg-[#F5BC1C]' : 'bg-[#DDDDDD]'}`}
                                                                    style={{
                                                                        height: `${30 + Math.sin(index * 0.4) * 50}%`
                                                                    }}
                                                                ></div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Audio element */}
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
                        </div>

                        {/* Submit Button - Fixed at bottom */}
                        <div className="mt-4 mb-2 sticky bottom-0 z-20">
                            <button
                                type="submit"
                                className={`w-full py-2.5 rounded-lg transition-colors font-medium ${
                                    audioRecorded 
                                    ? 'bg-[#F5BC1C] text-white cursor-pointer' 
                                    : 'bg-[#F5BC1C] bg-opacity-50 text-white cursor-not-allowed'
                                }`}
                                style={{ fontFamily: 'Inter' }}
                                disabled={!audioRecorded}
                            >
                                Join as a Partner
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

            {/* Wave Combination */}
            <div className="absolute bottom-0 left-0 right-0 w-full h-28 overflow-hidden pointer-events-none">
                {/* Main wave */}
                <img
                    src="/assets/wave-bottom-yellow.png"
                    alt="Wave"
                    className="w-full object-cover absolute bottom-0"
                    style={{ height: '130px' }}
                />

                {/* Middle layer wave */}
                <div className="absolute bottom-0 w-full" style={{ opacity: 0.4, transform: 'translateY(-20px)' }}>
                    <img
                        src="/assets/wave-middle.png"
                        alt="Wave Middle"
                        className="w-full object-cover"
                        style={{ height: '80px' }}
                    />
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 w-full">
                    <div className="absolute left-[10%] bottom-[40px]">
                        <div className="bg-[#F5BC1C] opacity-20 rounded-full" style={{ width: '20px', height: '20px' }}></div>
                    </div>
                    <div className="absolute right-[15%] bottom-[60px]">
                        <div className="bg-[#F5BC1C] opacity-30 rounded-full" style={{ width: '15px', height: '15px' }}></div>
                    </div>
                    <div className="absolute left-[30%] bottom-[30px]">
                        <div className="bg-[#F5BC1C] opacity-25 rounded-full" style={{ width: '12px', height: '12px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerDetailsForm;