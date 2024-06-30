'use client'
import React, { useTransition, Suspense } from 'react'
import Mail from '/public/mail.svg'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const UnsubscribePage = () => {
    const [isPending, startTransaction] = useTransition()
    const query = useSearchParams()
    const defaultEmail = query?.get('email') as string
    const id = query?.get('id') as string
    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        const target = event.target as HTMLFormElement
        const form = new FormData(target)
        const email = form.get('email')
        if (!email && !id) {
            toast.error('未填写邮箱！')
            return null
        }

        startTransaction(async () => {
            try {
                const res = await fetch('/api/resend', {
                    method: 'POST',
                    body: JSON.stringify({
                        id,
                        email,
                        unsubscribed: true,
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })

                if (res.ok) {
                    target.reset()
                    toast.success('取消订阅成功！')
                } else {
                    console.error('Error:', res.status, res.statusText)
                    toast.error('出现了一些问题')
                }
            } catch (error) {
                console.error('Fetch error:', error)
            }
        })
    }
    return (
        <section className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2">
            <div className="max-w-screen-lg border-[1.5px] border-[#F0E4D2] mx-auto relative">
                <div className="flex flex-col items-center p-4 md:p-12">
                    <div className="text-center mb-4 lg:mb-6">
                        <h1 className="text-3xl md:text-[55px] font-semibold leading-none md:leading-tight">
                            很抱歉看到你离开
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex justify-center items-center gap-2"
                    >
                        {!id && <div className="relative">
                            <label
                                htmlFor="email"
                                className="absolute inset-y-0 left-0 pl-2.5 flex items-center"
                            >
                                <Image src={Mail} alt="mail" />
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={defaultEmail}
                                required
                                placeholder="请确认要退订的邮箱"
                                className="lg:w-[300px] py-2 px-3 rounded-md text-base pl-8 shadow-button-shadow border bg-white/50 focus-visible:outline-none focus-visible:bg-white"
                            />
                        </div>}
                        <button disabled={isPending} className="bg-black text-white py-2 px-6 rounded-md text-base transition-all duration-200 hover:bg-black/60">
                            退订
                        </button>
                    </form>
                    <p className="text-black/40 font-normal mb-6">
                    </p>
                    <Link
                        href="/"
                        className="bg-black text-white px-2.5 py-2 rounded-md text-base transition-all duration-200 hover:bg-black/60"
                    >
                        返回主页
                    </Link>
                </div>
                <span className="w-2 h-2 absolute z-10 -top-[1%] -left-[0.5%] block bg-white border border-[#F0E4D2]"></span>
                <span className="w-2 h-2 absolute z-10 -bottom-[1%] -left-[0.5%] block bg-white border border-[#F0E4D2]"></span>
                <span className="w-2 h-2 absolute z-10 -top-[1%] -right-[0.5%] block bg-white border border-[#F0E4D2]"></span>
                <span className="w-2 h-2 absolute z-10 -bottom-[1%] -right-[0.5%] block bg-white border border-[#F0E4D2]"></span>
            </div>
        </section>
    )
}

const UnsubscribePageWrapper = () => <Suspense>
    <UnsubscribePage />
</Suspense>

export default UnsubscribePageWrapper 
