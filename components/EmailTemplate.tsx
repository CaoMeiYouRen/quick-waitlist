import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Link,
} from '@react-email/components'
import { PropsWithChildren } from 'react'
type Props = PropsWithChildren<{
    unsubscribeUrl: string
}>
const siteLogo = `${process.env.NEXT_PUBLIC_DOMAIN}/speaker.svg`

export const EmailTemplate = (props?: Props) => {
    const { unsubscribeUrl } = props || {}
    return (
        <Html>
            <Head />
            <Preview>{`你在 ${process.env.NEXT_PUBLIC_SITE_NAME} 的等待名单上`}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Img
                        style={img}
                        src={process.env.NEXT_PUBLIC_LOGO || siteLogo}
                        width="100"
                        height="100"
                        alt="Logo"
                    />
                    <Section>
                        <Text style={text}>
                            亲爱的用户
                        </Text>
                        <Text
                            style={text}
                        >非常欢迎和感谢订阅 {process.env.NEXT_PUBLIC_SITE_NAME}</Text>
                        <Text style={text}>
                            RSS Impact 是一个支持 Hook 的 RSS 订阅工具。
                        </Text>
                        <Text style={text}>
                            RSS Impact 具有以下亮点:<br />
                            1. 支持多种形式的 Hook,包括推送通知、Webhook、下载、BitTorrent 和 AI 大模型等,满足您各种订阅需求。<br />
                            2. 推送通知支持多种渠道,如 Server 酱、邮件、钉钉机器人等,并支持 Markdown 格式。<br />
                            3. BitTorrent Hook 可自动下载资源,并支持按体积过滤。<br />
                            4. Webhook 支持多种 HTTP 方法调用。<br />
                            5. 下载 Hook 支持按 MD5 和后缀名过滤资源。<br />
                            6. AI Hook 可对内容进行总结,并支持在总结后推送。<br />
                            7. 支持正则替换 Hook,可用于替换链接为代理地址。<br />
                            8. 支持自定义查询并转换为 RSS,还可将 AI 总结输出到正文中。<br />
                            9. 支持从 OPML 文件导入/导出订阅。<br />
                            10. 支持 Docker 一键部署,并集成 Redis 缓存和 SQLite 数据库。<br />
                            11. 支持配置代理。<br />
                        </Text>
                        {/* <Text style={text}>每周六会有一次版本发布（如果存在更新的话）</Text> */}
                        <Text style={text}>本邮件由系统自动发送，请勿回复。</Text>
                        <Text style={text}>
                            如果您想取消订阅，可以点击 <Link href={unsubscribeUrl}>这里</Link>.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

const main = {
    backgroundColor: '#f6f9fc',
    padding: '10px 0',
}

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    padding: '45px',
}

const img = {
    paddingTop: '40px',
    margin: '0 auto',
}

const text = {
    fontSize: '16px',
    fontFamily:
        '\'Open Sans\', \'HelveticaNeue-Light\', \'Helvetica Neue Light\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif',
    fontWeight: '400',
    color: '#404040',
    lineHeight: '26px',
    // padding: "0 40px",
}

const anchor = {
    textDecoration: 'underline',
}
