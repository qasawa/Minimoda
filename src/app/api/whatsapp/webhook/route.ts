/**
 * WhatsApp Business API Webhook Endpoint
 * 
 * This endpoint receives webhooks from WhatsApp Business API for:
 * - Incoming customer messages
 * - Message delivery status updates
 * - User interactions with sent messages
 * 
 * Security: Verifies webhook signature to ensure authenticity
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { WhatsAppService } from '@/lib/services/whatsapp-service'

// Webhook verification (required by WhatsApp)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // Check if this is a webhook verification request
  if (mode === 'subscribe') {
    const webhookToken = process.env.WHATSAPP_WEBHOOK_TOKEN
    
    if (!webhookToken) {
      console.error('WHATSAPP_WEBHOOK_TOKEN not configured')
      return NextResponse.json({ error: 'Webhook token not configured' }, { status: 500 })
    }

    if (token === webhookToken) {
      console.log('WhatsApp webhook verified successfully')
      return new NextResponse(challenge, { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    } else {
      console.error('WhatsApp webhook verification failed - invalid token')
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 403 })
    }
  }

  return NextResponse.json({ error: 'Invalid webhook request' }, { status: 400 })
}

// Handle incoming webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256') || ''
    
    // Verify webhook signature for security
    const webhookToken = process.env.WHATSAPP_WEBHOOK_TOKEN
    if (!webhookToken) {
      console.error('WHATSAPP_WEBHOOK_TOKEN not configured')
      return NextResponse.json({ error: 'Webhook token not configured' }, { status: 500 })
    }

    // Verify the signature to ensure the request is from WhatsApp
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', webhookToken)
      .update(body)
      .digest('hex')
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Parse the webhook data
    const webhookData = JSON.parse(body)
    
    // Log the incoming webhook for debugging
    console.log('WhatsApp webhook received:', {
      object: webhookData.object,
      entryCount: webhookData.entry?.length || 0,
      timestamp: new Date().toISOString()
    })

    // Process the webhook data
    await WhatsAppService.handleWebhook(webhookData)

    // WhatsApp expects a 200 OK response
    return NextResponse.json({ status: 'ok' }, { status: 200 })

  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    
    // Return 200 OK even for errors to prevent WhatsApp from retrying
    // Log the error for manual investigation
    return NextResponse.json({ 
      status: 'error', 
      message: 'Internal processing error' 
    }, { status: 200 })
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
