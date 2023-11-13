import getTrackingPixel from './tracking-pixel'

export type EmailProps = {
  userId: string;
  list: string;
  base_url: string;
};

export const campaignId = 'welcome'
export const subject = '🚀 Welcome to WebDev Town! Your Weekly Web Dev Newsletter 💻'

const getEmail = ({ userId, list, base_url }: EmailProps) => {
  return `<mjml>
    <mj-head>
      <mj-attributes>
        <mj-text font-size="16px" font-family="helvetica" />
        <mj-button font-family="helvetica" />
      </mj-attributes>
      <mj-style> a { color: #017a8c; } .bg > table { background-image: linear-gradient(158deg, rgba(84, 84, 84, 0.03) 0%, rgba(84, 84, 84, 0.03) 20%,rgba(219, 219, 219, 0.03) 20%, rgba(219, 219, 219, 0.03) 40%,rgba(54, 54, 54, 0.03) 40%, rgba(54, 54, 54, 0.03) 60%,rgba(99, 99, 99, 0.03) 60%, rgba(99, 99, 99, 0.03) 80%,rgba(92, 92, 92, 0.03) 80%, rgba(92, 92, 92, 0.03) 100%),linear-gradient(45deg, rgba(221, 221, 221, 0.02) 0%, rgba(221, 221, 221, 0.02) 14.286%,rgba(8, 8, 8, 0.02) 14.286%, rgba(8, 8, 8, 0.02) 28.572%,rgba(52, 52, 52, 0.02) 28.572%, rgba(52, 52, 52, 0.02) 42.858%,rgba(234, 234, 234, 0.02) 42.858%, rgba(234, 234, 234, 0.02) 57.144%,rgba(81, 81, 81, 0.02) 57.144%, rgba(81, 81, 81, 0.02) 71.42999999999999%,rgba(239, 239, 239, 0.02) 71.43%, rgba(239, 239, 239, 0.02) 85.71600000000001%,rgba(187, 187, 187, 0.02) 85.716%, rgba(187, 187, 187, 0.02) 100.002%),linear-gradient(109deg, rgba(33, 33, 33, 0.03) 0%, rgba(33, 33, 33, 0.03) 12.5%,rgba(147, 147, 147, 0.03) 12.5%, rgba(147, 147, 147, 0.03) 25%,rgba(131, 131, 131, 0.03) 25%, rgba(131, 131, 131, 0.03) 37.5%,rgba(151, 151, 151, 0.03) 37.5%, rgba(151, 151, 151, 0.03) 50%,rgba(211, 211, 211, 0.03) 50%, rgba(211, 211, 211, 0.03) 62.5%,rgba(39, 39, 39, 0.03) 62.5%, rgba(39, 39, 39, 0.03) 75%,rgba(55, 55, 55, 0.03) 75%, rgba(55, 55, 55, 0.03) 87.5%,rgba(82, 82, 82, 0.03) 87.5%, rgba(82, 82, 82, 0.03) 100%),linear-gradient(348deg, rgba(42, 42, 42, 0.02) 0%, rgba(42, 42, 42, 0.02) 20%,rgba(8, 8, 8, 0.02) 20%, rgba(8, 8, 8, 0.02) 40%,rgba(242, 242, 242, 0.02) 40%, rgba(242, 242, 242, 0.02) 60%,rgba(42, 42, 42, 0.02) 60%, rgba(42, 42, 42, 0.02) 80%,rgba(80, 80, 80, 0.02) 80%, rgba(80, 80, 80, 0.02) 100%),linear-gradient(120deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 14.286%,rgba(67, 67, 67, 0.03) 14.286%, rgba(67, 67, 67, 0.03) 28.572%,rgba(134, 134, 134, 0.03) 28.572%, rgba(134, 134, 134, 0.03) 42.858%,rgba(19, 19, 19, 0.03) 42.858%, rgba(19, 19, 19, 0.03) 57.144%,rgba(101, 101, 101, 0.03) 57.144%, rgba(101, 101, 101, 0.03) 71.42999999999999%,rgba(205, 205, 205, 0.03) 71.43%, rgba(205, 205, 205, 0.03) 85.71600000000001%,rgba(53, 53, 53, 0.03) 85.716%, rgba(53, 53, 53, 0.03) 100.002%),linear-gradient(45deg, rgba(214, 214, 214, 0.03) 0%, rgba(214, 214, 214, 0.03) 16.667%,rgba(255, 255, 255, 0.03) 16.667%, rgba(255, 255, 255, 0.03) 33.334%,rgba(250, 250, 250, 0.03) 33.334%, rgba(250, 250, 250, 0.03) 50.001000000000005%,rgba(231, 231, 231, 0.03) 50.001%, rgba(231, 231, 231, 0.03) 66.668%,rgba(241, 241, 241, 0.03) 66.668%, rgba(241, 241, 241, 0.03) 83.33500000000001%,rgba(31, 31, 31, 0.03) 83.335%, rgba(31, 31, 31, 0.03) 100.002%),linear-gradient(59deg, rgba(224, 224, 224, 0.03) 0%, rgba(224, 224, 224, 0.03) 12.5%,rgba(97, 97, 97, 0.03) 12.5%, rgba(97, 97, 97, 0.03) 25%,rgba(143, 143, 143, 0.03) 25%, rgba(143, 143, 143, 0.03) 37.5%,rgba(110, 110, 110, 0.03) 37.5%, rgba(110, 110, 110, 0.03) 50%,rgba(34, 34, 34, 0.03) 50%, rgba(34, 34, 34, 0.03) 62.5%,rgba(155, 155, 155, 0.03) 62.5%, rgba(155, 155, 155, 0.03) 75%,rgba(249, 249, 249, 0.03) 75%, rgba(249, 249, 249, 0.03) 87.5%,rgba(179, 179, 179, 0.03) 87.5%, rgba(179, 179, 179, 0.03) 100%),linear-gradient(241deg, rgba(58, 58, 58, 0.02) 0%, rgba(58, 58, 58, 0.02) 25%,rgba(124, 124, 124, 0.02) 25%, rgba(124, 124, 124, 0.02) 50%,rgba(254, 254, 254, 0.02) 50%, rgba(254, 254, 254, 0.02) 75%,rgba(52, 52, 52, 0.02) 75%, rgba(52, 52, 52, 0.02) 100%),linear-gradient(90deg, #ffffff,#ffffff); !important }; </mj-style>
    </mj-head>
    <mj-body>
      <mj-section css-class="bg" border-radius="0 0 10px 10px">
        <mj-column>
          <mj-image src="https://webdev.town/logo.png" width="100px" padding-bottom="20px" alt="WebDev Town" fluid-on-mobile="true" />
          <mj-text align="center" color="#1d1d1d">
            <h2>🚀 Welcome Aboard!</h2>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text>Hi,<br/>Thank you for subscribing to the <a href="https://webdev.town">WebDev Town</a> Newsletter.</mj-text>
          <mj-text><br/><i>📅 What to Expect:</i></mj-text>
          <mj-text>Each <b>Wednesday morning</b>, I'll send you an e-mail with the most valuable web development resources right to your inbox.</mj-text>
          <mj-text><br/><i>📚 Check Out What's Already Here:</i></mj-text>
          <mj-text>Can't wait for the next issue? You can find all previous resources and some useful collections on the website: </mj-text>
          </mj-text>
          <mj-text>
            <a href="https://webdev.town"> 🔗All resources from previous issues </a>
          </mj-text>
          <mj-text>
            <a href="https://webdev.town/collections/backgrounds"> 🖼️Ultimate Collection Of Websites For Creative Backgrounds </a>
          </mj-text>
          <mj-text>
            <a href="https://webdev.town/collections/icons"> 💻A Curated List Of Websites For Free Icon Sets </a>
          </mj-text>
          <mj-text><i><br/>💡 Share Your Knowledge:</i></mj-text>
        <mj-text>Do you have a side project, or a valuable resources you'd like to share with the community? I'd love to hear from you! Just hit "reply" to this email and send your links or feedback. You can also submit your links directly through the <a href="https://webdev.town/submit">online portal</a>.
  </mj-text>
          <mj-text> Thank you once again. I really do appreciate having you on board.<br/>Feel free to reach out anytime if you have questions, suggestions, or just want to chat about web development.</mj-text>
          <mj-text> Cheers,<br>Vincent</mj-text>
            <mj-text>P.S. You can also follow me on <a href="https://twitter.com/wweb_dev">Twitter</a>. I'm sharing insights how I'm building and growing this newsletter, along with other side-projects.</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text align="center">
            <a href="${base_url}/api/unsubscribe?id=${userId}&list=${list}">Unsubscribe</a><span>
          </mj-text>
        </mj-column>
        ${getTrackingPixel({ userId, emailId: 'welcome', list, base_url })}
      </mj-section>
    </mj-body>
  </mjml>`
}

export default getEmail