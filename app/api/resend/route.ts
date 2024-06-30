import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { EmailTemplate } from '@/components/EmailTemplate'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)
const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL
const siteName = process.env.NEXT_PUBLIC_SITE_NAME
const audienceId = process.env.NEXT_PUBLIC_AUDIENCE_ID
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
const subject = `你在 ${siteName} 的等待名单上`

function getUnsubscribeUrl(obj: { email?: string, id?: string }) {
    const { email, id } = obj
    // 优先使用 id，id 是 uuid 格式，可以避免信息泄露
    const url = new URL(process.env.NEXT_PUBLIC_UNSUBSCRIBE_URL as string)
    if (id) {
        const search = new URLSearchParams({
            id,
        }).toString()
        url.search = search
        return url.toString()
    }
    if (email) {
        const search = new URLSearchParams({
            email,
        }).toString()
        url.search = search
        return url.toString()
    }
    throw new Error('email 或 id 必须有其一')
}

type Body = {
    email?: string // 订阅 或  根据 email 取消订阅
    unsubscribed?: boolean // 是否为 取消订阅
    id?: string  // 根据 id 取消订阅
}

export async function POST(req: NextRequest) {
    const body: Body = await req.json()
    const { email = '', id = '', unsubscribed = false } = body
    try {
        if (unsubscribed) {
            // 取消订阅
            const removeContact = await resend.contacts.remove({
                id,
                email,
                audienceId: audienceId as string,
            })

            return NextResponse.json({
                removeContact,
            })
        }
        // 增加订阅
        const addContact = await resend.contacts.create({
            email,
            unsubscribed: false,
            audienceId: audienceId as string,
        })
        const contactId = addContact.data?.id
        const unsubscribeUrl = getUnsubscribeUrl({ email, id: contactId })
        const sendEmail = await resend.emails.send({
            from: fromEmail as string,
            to: [email],
            subject,
            react: EmailTemplate({ unsubscribeUrl }),
            headers: {
                'List-Unsubscribe': unsubscribeUrl,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
        })

        return NextResponse.json({
            sendEmail,
            addContact,
        })
    } catch (error) {
        return NextResponse.json({ error })
    }
}
