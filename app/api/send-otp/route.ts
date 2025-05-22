

import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';


const config = {
  FAST2SMS_KEY: process.env.FAST2SMS_KEY || ''
};

interface SendOtpRequest {
  phoneNumber: string;
  otp: string;
}

interface Fast2SMSResponse {
  return: boolean;
  request_id: string;
  message: string[];
}

const sendOtp = async (contactNumber: string, otp: string): Promise<boolean> => {
  if (!config.FAST2SMS_KEY) {
    console.error('FAST2SMS_KEY is not configured');
    return false;
  }

  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${config.FAST2SMS_KEY}&route=dlt&sender_id=ELYSFT&variables_values=${otp}&flash=0&numbers=${contactNumber}&message=170490`;
  
  try {
    const response = await axios.get<Fast2SMSResponse>(url);
    console.log('SMS API Response:', response.data);
    
    // Fast2SMS returns success status in 'return' field
    return response.data.return === true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: SendOtpRequest = await request.json();
    const { phoneNumber, otp } = body;

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { 
          error: 'Phone number and OTP are required',
          success: false 
        }, 
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        { 
          error: 'OTP must be a 4-digit number',
          success: false 
        }, 
        { status: 400 }
      );
    }


    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    

    if (!/^\d{10}$/.test(cleanPhoneNumber)) {
      return NextResponse.json(
        { 
          error: 'Invalid phone number format',
          success: false 
        }, 
        { status: 400 }
      );
    }

    // Send OTP
    const success = await sendOtp(cleanPhoneNumber, otp);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent successfully',
        phoneNumber: cleanPhoneNumber
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send OTP. Please try again.' 
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request format' 
        }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
}