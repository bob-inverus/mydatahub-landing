import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ethers } from 'ethers';

export async function POST(request: NextRequest) {
  try {
    const { address, signature, message, referralCode } = await request.json();

    // Validate input
    if (!address || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      // Check if recovered address matches the claimed address
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Signature verification error:', error);
      return NextResponse.json(
        { error: 'Failed to verify signature' },
        { status: 401 }
      );
    }

    // Create admin client for user management
    const adminClient = createAdminClient();

    // Create a virtual email for Web3 users
    const virtualEmail = `${address.toLowerCase()}@web3.mysanctum.local`;

    // Check if user already exists by searching for wallet address in metadata
    const { data: existingUsers, error: searchError } = await adminClient.auth.admin.listUsers();
    
    let userId: string | null = null;
    let isNewUser = false;

    if (!searchError && existingUsers?.users) {
      const existingUser = existingUsers.users.find(
        user => user.user_metadata?.wallet_address?.toLowerCase() === address.toLowerCase()
      );
      
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    if (!userId) {
      // Create new user
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: virtualEmail,
        email_confirm: true, // Auto-confirm email for Web3 users
        user_metadata: {
          wallet_address: address.toLowerCase(),
          auth_method: 'web3',
          ...(referralCode ? { referral_code: referralCode.trim().toUpperCase() } : {}),
        },
      });

      if (createError || !newUser.user) {
        console.error('Failed to create user:', createError);
        return NextResponse.json(
          { error: createError?.message || 'Failed to create account' },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
      isNewUser = true;
    }

    // Generate a session token for the user
    const { data: sessionData, error: sessionError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: virtualEmail,
    });

    if (sessionError || !sessionData) {
      console.error('Failed to generate session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Get the user client and set the session
    const supabase = await createClient();
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: sessionData.properties.access_token,
      refresh_token: sessionData.properties.refresh_token,
    });

    if (setSessionError) {
      console.error('Failed to set session:', setSessionError);
      return NextResponse.json(
        { error: 'Failed to set session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isNewUser,
      address: address.toLowerCase(),
    });

  } catch (error: any) {
    console.error('Web3 auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
