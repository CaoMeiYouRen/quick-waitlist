import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { EmailTemplate } from '@/components/EmailTemplate'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)
const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL
const siteName = process.env.NEXT_PUBLIC_SITE_NAME
const audienceId = process.env.NEXT_PUBLIC_AUDIENCE_ID
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
const unsubscribeUrl = process.env.NEXT_PUBLIC_UNSUBSCRIBE_URL || ''
const subject = `你在 ${siteName} 的等待名单上`

type Body = {
    email: string
    unsubscribed?: boolean
}

export async function POST(req: NextRequest) {
    const body: Body = await req.json()
    const { email, unsubscribed = false } = body
    try {
        if (unsubscribed) {
            // 取消订阅
            const removeContact = await resend.contacts.create({
                email,
                unsubscribed: true,
                audienceId: audienceId as string,
            })

            return NextResponse.json({
                removeContact,
            })
        }
        // 增加订阅
        const sendEmail = await resend.emails.send({
            from: fromEmail as string,
            to: [email],
            subject,
            react: EmailTemplate(),
            headers: {
                'List-Unsubscribe': unsubscribeUrl,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
        })

        const addContact = await resend.contacts.create({
            email,
            unsubscribed: false,
            audienceId: audienceId as string,
        })

        return NextResponse.json({
            sendEmail,
            addContact,
        })
    } catch (error) {
        return NextResponse.json({ error })
    }
}
